import crypto from 'node:crypto';
import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import {
  AnalysisResultSchema,
  CreateSessionResponseSchema,
  CreateUploadResponseSchema,
  GenerateAssetsResponseSchema,
  SessionDetailsResponseSchema,
  SessionResolveByTokenResponseSchema,
} from '@dokumenty-id/shared';
import type { AnalysisResult, AnalysisViolation } from '@dokumenty-id/shared';
import { loadConfig } from '../config.js';
import { FotowayLegacyClient } from '../adapters/dokumenty-id/fotoway-client.js';
import type { SessionStore } from '../repositories/session-store.js';

type BuildSessionRoutesOptions = {
  store: SessionStore;
};

const MAX_UPLOAD_SIZE_BYTES = 15 * 1024 * 1024;
const WARNING_CODES = new Set([
  'SMILE_DETECTED',
  'GLASSES_REFLECTION',
  'HAIR_OVER_EYES',
  'HAIR_ON_FACE',
  'HAIR_ON_EYEBROWS',
  'BACKGROUND_NOT_UNIFORM',
  'BACKGROUND_SHADOW',
  'FACE_SHADOW',
  'BAD_WHITE_BALANCE',
  'TOO_DARK',
  'TOO_BRIGHT',
  'RED_EYE',
  'HEAD_TILTED',
  'FACE_TOO_SMALL',
  'FACE_TOO_LARGE',
  'FACE_CUT_OFF',
  'EYES_CLOSED',
  'HEAD_TURNED',
  'MOUTH_OPEN',
  'MOUTH_NOT_DETECTED',
  'BLURRY_IMAGE',
]);

function analysisPassed(analysis: {
  compliancePercent: number;
  violations: AnalysisViolation[];
}): boolean {
  // Adapter mapuje pass_for_print → 100; twarde błędy zostają poniżej.
  if (analysis.compliancePercent >= 100) {
    return true;
  }
  const hardErrors = analysis.violations.filter((v) => v.severity === 'error');
  return analysis.compliancePercent >= 75 && hardErrors.length === 0;
}

type GeneratedAssetState = {
  assetId: string;
  type: 'electronic' | 'imposition_1x8';
  path: string;
  downloadToken: string;
  expiresAt: Date;
};

type GeneratedAssetsState = {
  previewToken: string;
  previewTokenExpiresAt: Date;
  assets: GeneratedAssetState[];
};

type SessionEngineBinding = {
  legacySessionId?: string;
  legacyPhotoId?: string;
  analysis?: AnalysisResult;
  generatedAssets?: GeneratedAssetsState;
};

const sessionEngineBindings = new Map<string, SessionEngineBinding>();

export const buildSessionRoutes = ({ store }: BuildSessionRoutesOptions): FastifyPluginAsync => {
  const sessionRoutes: FastifyPluginAsync = async (app) => {
    const config = loadConfig();
    const legacyClient = config.fotowayLegacyBaseUrl
      ? new FotowayLegacyClient({
          baseUrl: config.fotowayLegacyBaseUrl,
          timeoutMs: config.dokumentyEngineTimeoutMs,
        })
      : null;

    app.post('/sessions', async () => {
      const qrToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
      const session = await store.createSession({
        qrToken,
        expiresAt,
        status: 'created',
      });

      const mobileUrl = `${config.appBaseUrl}/m/${qrToken}`;

      return CreateSessionResponseSchema.parse({
        sessionId: session.id,
        qrToken,
        mobileUrl,
        expiresAt: expiresAt.toISOString(),
      });
    });

    app.get('/sessions/:sessionId', async (request, reply) => {
      const { sessionId } = request.params as { sessionId: string };
      const session = await store.findSessionById(sessionId);

      if (!session) {
        return reply.code(404).send({ error: 'SESSION_NOT_FOUND' });
      }

      return SessionDetailsResponseSchema.parse({
        sessionId,
        qrToken: session.qrToken,
        status: session.status,
        expiresAt: session.expiresAt.toISOString(),
        uploadCount: session.uploads.length,
        analysisStatus: sessionEngineBindings.get(sessionId)?.analysis?.status,
        compliancePercent: sessionEngineBindings.get(sessionId)?.analysis?.compliancePercent,
      });
    });

    app.get('/sessions/by-token/:qrToken', async (request, reply) => {
      const { qrToken } = request.params as { qrToken: string };
      const session = await store.findSessionByToken(qrToken);

      if (!session) {
        return reply.code(404).send({ error: 'SESSION_NOT_FOUND' });
      }

      if (session.status === 'created' || session.status === 'qr_displayed') {
        await store.updateSessionStatus(session.id, 'mobile_opened');
        session.status = 'mobile_opened';
      }

      return SessionResolveByTokenResponseSchema.parse({
        sessionId: session.id,
        qrToken: session.qrToken,
        status: session.status,
        expiresAt: session.expiresAt.toISOString(),
      });
    });

    app.post('/sessions/:sessionId/uploads', async (request, reply) => {
      const { sessionId } = request.params as { sessionId: string };
      const session = await store.findSessionById(sessionId);

      if (!session) {
        return reply.code(404).send({ error: 'SESSION_NOT_FOUND' });
      }

      if (session.expiresAt.getTime() <= Date.now()) {
        await store.updateSessionStatus(sessionId, 'expired');
        return reply.code(410).send({ error: 'SESSION_EXPIRED' });
      }

      const file = await request.file({ limits: { fileSize: MAX_UPLOAD_SIZE_BYTES } });
      if (!file) {
        return reply.code(400).send({ error: 'FILE_REQUIRED' });
      }

      let sizeBytes = 0;
      const chunks: Buffer[] = [];
      for await (const chunk of file.file) {
        chunks.push(chunk);
        sizeBytes += chunk.length;
      }

      if (sizeBytes === 0) {
        return reply.code(400).send({ error: 'EMPTY_FILE' });
      }

      const uploadId = crypto.randomUUID();
      const safeFilename = (file.filename ?? 'upload.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
      const storageKey = `sessions/${sessionId}/${uploadId}-${safeFilename}`;

      await store.updateSessionStatus(sessionId, 'uploading');
      await store.createUpload({
        sessionId,
        storageKey,
        mimeType: file.mimetype,
        sizeBytes,
      });
      await store.updateSessionStatus(sessionId, 'uploaded');

      const binding = sessionEngineBindings.get(sessionId) ?? {};
      let legacyPhotoId: string | undefined;
      if (legacyClient) {
        const uploadBlob = new Blob(chunks, { type: file.mimetype || 'application/octet-stream' });
        if (!binding.legacySessionId) {
          const legacySession = await legacyClient.createLegacySession();
          binding.legacySessionId = legacySession.sessionId;
        }
        const legacyUpload = await legacyClient.uploadPhotoToLegacy(
          binding.legacySessionId,
          uploadBlob,
          safeFilename
        );
        legacyPhotoId = legacyUpload.photoId;
        binding.legacyPhotoId = legacyPhotoId;
        binding.analysis = undefined;
        binding.generatedAssets = undefined;
        sessionEngineBindings.set(sessionId, binding);
      }

      return CreateUploadResponseSchema.parse({
        uploadId,
        sessionId,
        status: 'uploaded',
        mimeType: file.mimetype,
        sizeBytes,
        legacyPhotoId,
      });
    });

    app.post('/sessions/:sessionId/analyze', async (request, reply) => {
      const { sessionId } = request.params as { sessionId: string };
      const session = await store.findSessionById(sessionId);
      if (!session) {
        return reply.code(404).send({ error: 'SESSION_NOT_FOUND' });
      }
      if (!legacyClient) {
        return reply.code(503).send({ error: 'ENGINE_UNAVAILABLE' });
      }

      const binding = sessionEngineBindings.get(sessionId);
      if (!binding?.legacyPhotoId) {
        return reply.code(400).send({ error: 'ANALYSIS_FAILED', message: 'NO_UPLOADED_PHOTO' });
      }

      await store.updateSessionStatus(sessionId, 'analyzing');

      try {
        // Najpierw korekcja (białe tło / kolor) — analiza na surowym selfie zbyt ostro odrzucała dobre ujęcia.
        if (config.printReadyAutoProcess) {
          await legacyClient.processPhotoAuto(binding.legacyPhotoId);
        }
        const legacyResult = await legacyClient.analyzePhoto(binding.legacyPhotoId);
        const normalized = normalizeLegacyAnalysis(sessionId, legacyResult);
        binding.analysis = AnalysisResultSchema.parse(normalized);
        binding.generatedAssets = undefined;
        sessionEngineBindings.set(sessionId, binding);

        await store.updateSessionStatus(
          sessionId,
          analysisPassed(binding.analysis) ? 'analysis_passed' : 'analysis_failed'
        );
        return binding.analysis;
      } catch (error) {
        await store.updateSessionStatus(sessionId, 'analysis_failed');
        const failed: AnalysisResult = {
          sessionId,
          status: 'failed',
          compliancePercent: 0,
          violations: [{ code: 'ANALYSIS_FAILED', severity: 'error' }],
          analyzedAt: new Date().toISOString(),
        };
        binding.analysis = failed;
        sessionEngineBindings.set(sessionId, binding);
        request.log.error({ err: error, sessionId }, 'Legacy analysis failed');
        const errorMessage = error instanceof Error ? error.message : '';
        const engineUnavailable =
          /fetch failed|ECONNREFUSED|ENOTFOUND|timed out|abort/i.test(errorMessage) ||
          /^FOTOWAY API 5\d\d:/i.test(errorMessage);

        if (engineUnavailable) {
          return reply.code(503).send({
            error: 'ENGINE_UNAVAILABLE',
            ...(config.nodeEnv !== 'production'
              ? { message: errorMessage || 'FOTOWAY_LEGACY_UNREACHABLE' }
              : {}),
          });
        }

        return reply.code(502).send({
          error: 'ANALYSIS_FAILED',
          ...(config.nodeEnv !== 'production' ? { message: errorMessage || 'LEGACY_ANALYSIS_ERROR' } : {}),
        });
      }
    });

    app.get('/sessions/:sessionId/analysis', async (request, reply) => {
      const { sessionId } = request.params as { sessionId: string };
      const session = await store.findSessionById(sessionId);
      if (!session) {
        return reply.code(404).send({ error: 'SESSION_NOT_FOUND' });
      }
      const analysis = sessionEngineBindings.get(sessionId)?.analysis;
      if (!analysis) {
        return AnalysisResultSchema.parse({
          sessionId,
          status: 'pending',
          compliancePercent: 0,
          violations: [],
        });
      }
      return analysis;
    });

    app.post('/sessions/:sessionId/generate-assets', async (request, reply) => {
      const { sessionId } = request.params as { sessionId: string };
      const session = await store.findSessionById(sessionId);
      if (!session) {
        return reply.code(404).send({ error: 'SESSION_NOT_FOUND' });
      }
      if (!legacyClient) {
        return reply.code(503).send({ error: 'ENGINE_UNAVAILABLE' });
      }

      const binding = sessionEngineBindings.get(sessionId);
      if (!binding?.legacyPhotoId || !binding.legacySessionId) {
        return reply.code(400).send({ error: 'GENERATION_FAILED', message: 'NO_ANALYZED_PHOTO' });
      }
      if (!binding.analysis || !analysisPassed(binding.analysis)) {
        return reply.code(409).send({ error: 'ANALYSIS_IN_PROGRESS' });
      }

      await store.updateSessionStatus(sessionId, 'generating');

      try {
        if (config.printReadyAutoProcess) {
          // "Gotowe do druku": zawsze odświeżamy wynik z aktualnym pipeline FOTOWAY.
          // Po stronie legacy źródłem jest oryginał, więc nie kumulujemy degradacji.
          await legacyClient.processPhotoAuto(binding.legacyPhotoId);
          await legacyClient.cropPhotoToBiometric(binding.legacyPhotoId);
        }

        const photoPaths = await legacyClient.getPhotoFilePaths(binding.legacyPhotoId);
        // Dla wersji elektronicznej preferujemy wynik "processed" (jak w FOTOWAY UI),
        // a kadr 35x45 zostaje źródłem do impozycji/druku.
        const electronicPath = photoPaths.processedPath || photoPaths.cropPath || photoPaths.originalPath;
        if (!electronicPath) {
          throw new Error('MISSING_ELECTRONIC_ASSET');
        }

        const impositionResult = await legacyClient.generateImposition1x8WithOptions(
          binding.legacySessionId,
          binding.legacyPhotoId,
          {
            gapMm: 1.5,
            cutLines: config.impositionCutLines,
          }
        );
        const refreshedPhotoPaths = await legacyClient.getPhotoFilePaths(binding.legacyPhotoId);
        const impositionPath = impositionResult.path || refreshedPhotoPaths.impositionPath;
        if (!impositionPath) {
          throw new Error('MISSING_IMPOSITION_ASSET');
        }

        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
        const generatedAssets: GeneratedAssetsState = {
          previewToken: createShortToken(),
          previewTokenExpiresAt: expiresAt,
          assets: [
            {
              assetId: crypto.randomUUID(),
              type: 'electronic',
              path: electronicPath,
              downloadToken: createShortToken(),
              expiresAt,
            },
            {
              assetId: crypto.randomUUID(),
              type: 'imposition_1x8',
              path: impositionPath,
              downloadToken: createShortToken(),
              expiresAt,
            },
          ],
        };

        binding.generatedAssets = generatedAssets;
        sessionEngineBindings.set(sessionId, binding);
        await store.updateSessionStatus(sessionId, 'preview_ready');

        const requestBaseUrl = getRequestBaseUrl(request);
        return GenerateAssetsResponseSchema.parse({
          sessionId,
          status: 'preview_ready',
          previewUrl: `${requestBaseUrl}/api/v1/sessions/${sessionId}/assets/preview?token=${generatedAssets.previewToken}`,
          previewTokenExpiresAt: generatedAssets.previewTokenExpiresAt.toISOString(),
          assets: generatedAssets.assets.map((asset) => ({
            assetId: asset.assetId,
            type: asset.type,
            status: 'ready',
            expiresAt: asset.expiresAt.toISOString(),
            securedDownloadUrl: `${requestBaseUrl}/api/v1/sessions/${sessionId}/assets/${asset.assetId}/download?token=${asset.downloadToken}`,
          })),
        });
      } catch (error) {
        await store.updateSessionStatus(sessionId, 'analysis_passed');
        request.log.error({ err: error, sessionId }, 'Asset generation failed');
        return reply.code(502).send({ error: 'GENERATION_FAILED' });
      }
    });

    app.get('/sessions/:sessionId/assets/preview', async (request, reply) => {
      const { sessionId } = request.params as { sessionId: string };
      const { token } = request.query as { token?: string };
      const generated = sessionEngineBindings.get(sessionId)?.generatedAssets;
      if (!generated || !token) {
        return reply.code(404).send({ error: 'ASSET_NOT_FOUND' });
      }
      if (generated.previewToken !== token || generated.previewTokenExpiresAt.getTime() <= Date.now()) {
        return reply.code(403).send({ error: 'FORBIDDEN' });
      }
      if (!legacyClient) {
        return reply.code(503).send({ error: 'ENGINE_UNAVAILABLE' });
      }

      const previewAsset =
        generated.assets.find((asset) => asset.type === 'imposition_1x8') ?? generated.assets[0];
      if (!previewAsset) {
        return reply.code(404).send({ error: 'ASSET_NOT_FOUND' });
      }

      return reply.redirect(legacyClient.buildReadFileUrl(previewAsset.path));
    });

    app.get('/sessions/:sessionId/assets/:assetId/download', async (request, reply) => {
      const { sessionId, assetId } = request.params as { sessionId: string; assetId: string };
      const { token } = request.query as { token?: string };
      const generated = sessionEngineBindings.get(sessionId)?.generatedAssets;
      if (!generated || !token) {
        return reply.code(404).send({ error: 'ASSET_NOT_FOUND' });
      }
      const asset = generated.assets.find((candidate) => candidate.assetId === assetId);
      if (!asset) {
        return reply.code(404).send({ error: 'ASSET_NOT_FOUND' });
      }
      if (asset.downloadToken !== token || asset.expiresAt.getTime() <= Date.now()) {
        return reply.code(403).send({ error: 'FORBIDDEN' });
      }
      if (!legacyClient) {
        return reply.code(503).send({ error: 'ENGINE_UNAVAILABLE' });
      }
      return reply.redirect(legacyClient.buildReadFileUrl(asset.path));
    });
  };

  return sessionRoutes;
};

function normalizeLegacyAnalysis(
  sessionId: string,
  legacyResult: {
    compliancePercent: number;
    overallStatus: string;
    passForPrint?: boolean;
    violations: string[];
  }
): AnalysisResult {
  const filteredViolationCodes = legacyResult.violations.filter(
    (code) => !isBackgroundViolationCode(code)
  );
  const onlyBackgroundViolations =
    legacyResult.violations.length > 0 && filteredViolationCodes.length === 0;

  const violations: AnalysisViolation[] = filteredViolationCodes.map((code) => ({
    code,
    severity: WARNING_CODES.has(code) ? 'warning' : 'error',
  }));

  const hairOnFace = violations.some(
    (item) => item.code === 'HAIR_ON_FACE' || item.code === 'HAIR_OVER_EYES'
  );
  const hairOnEyebrows = violations.some(
    (item) => item.code === 'HAIR_ON_EYEBROWS' || item.code === 'HAIR_OVER_EYES'
  );

  const status = legacyResult.overallStatus === 'error' ? 'failed' : 'completed';
  const passed =
    legacyResult.passForPrint === true ||
    onlyBackgroundViolations ||
    legacyResult.overallStatus === 'ok' ||
    legacyResult.overallStatus === 'warning';

  return {
    sessionId,
    status,
    compliancePercent: passed
      ? 100
      : Math.max(0, Math.min(100, Math.round(legacyResult.compliancePercent))),
    violations,
    rules: {
      hair_on_face: {
        passed: !hairOnFace,
      },
      hair_on_eyebrows: {
        passed: !hairOnEyebrows,
      },
    },
    analyzedAt: new Date().toISOString(),
    engineVersion: 'fotoway-legacy-v2',
  };
}

function isBackgroundViolationCode(code: string): boolean {
  const normalized = code.trim().toLowerCase();
  return (
    normalized.startsWith('background_') ||
    normalized.includes('background') ||
    normalized.includes('tło') ||
    normalized.includes('na tle')
  );
}

function createShortToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

function getRequestBaseUrl(request: FastifyRequest): string {
  const forwardedProto = request.headers['x-forwarded-proto'];
  const protocol =
    typeof forwardedProto === 'string'
      ? (forwardedProto.split(',')[0]?.trim() ?? request.protocol)
      : request.protocol;
  const host =
    typeof request.headers['x-forwarded-host'] === 'string'
      ? request.headers['x-forwarded-host']
      : request.headers.host;
  return `${protocol}://${host}`;
}
