import { z } from 'zod';

const FotowaySessionSchema = z.object({
  id: z.string(),
});

const FotowayPhotoSchema = z.object({
  id: z.string(),
});

const FotowayPhotoDetailsSchema = z.object({
  id: z.string(),
  original_path: z.string().nullable().optional(),
  processed_path: z.string().nullable().optional(),
  crop_path: z.string().nullable().optional(),
  imposition_path: z.string().nullable().optional(),
});

const FotowayAnalysisSchema = z.object({
  photo_id: z.string(),
  analysis: z.object({
    overall_score: z.number().optional().default(0),
    overall_status: z.string().optional().default('reject'),
    pass_for_print: z.boolean().optional(),
    warnings: z.array(z.string()).optional().default([]),
    warning_codes: z.array(z.string()).optional().default([]),
    critical_codes: z.array(z.string()).optional().default([]),
    issue_codes: z.array(z.string()).optional().default([]),
  }),
});

const FotowayImpositionSchema = z.object({
  imposition_path: z.string().optional(),
});

const FotowayProcessAutoSchema = z.object({
  processed_path: z.string().optional(),
  photo: z
    .object({
      processed_path: z.string().nullable().optional(),
      background_removed_path: z.string().nullable().optional(),
    })
    .optional(),
});

const FotowayCropSchema = z.object({
  crop_path: z.string(),
});

export type LegacyFotowayConfig = {
  baseUrl: string;
  timeoutMs?: number;
};

export type LegacyAnalysisResult = {
  compliancePercent: number;
  overallStatus: string;
  passForPrint: boolean;
  violations: string[];
};

export type LegacyPhotoFilePaths = {
  originalPath: string | null;
  processedPath: string | null;
  cropPath: string | null;
  impositionPath: string | null;
};

export type Imposition1x8Options = {
  gapMm?: number;
  cutLines?: boolean;
};

/**
 * Adapter do istniejącego backendu FOTOWAY ID (FastAPI).
 * To jest warstwa przejściowa, żeby budować nową aplikację na stabilnym silniku legacy.
 */
export class FotowayLegacyClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(config: LegacyFotowayConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.timeoutMs = config.timeoutMs ?? 30_000;
  }

  async createLegacySession(documentProfileId?: string): Promise<{ sessionId: string }> {
    const payload = documentProfileId ? { document_profile_id: documentProfileId } : {};
    const response = await this.request('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
    const parsed = FotowaySessionSchema.parse(response);
    return { sessionId: parsed.id };
  }

  async uploadPhotoToLegacy(sessionId: string, file: Blob, filename: string): Promise<{ photoId: string }> {
    const form = new FormData();
    form.append('session_id', sessionId);
    form.append('files', file, filename);

    const response = await this.request('/api/import/upload', {
      method: 'POST',
      body: form,
    });
    const first = z
      .object({
        photos: z.array(FotowayPhotoSchema).min(1),
      })
      .parse(response);
    const firstPhoto = first.photos[0];
    if (!firstPhoto) {
      throw new Error('FOTOWAY upload zwrocil pustą listę zdjęć.');
    }

    return { photoId: firstPhoto.id };
  }

  async analyzePhoto(photoId: string): Promise<LegacyAnalysisResult> {
    const response = await this.request(`/api/photos/${photoId}/analyze`, {
      method: 'POST',
    });
    const parsed = FotowayAnalysisSchema.parse(response);
    const analysis = parsed.analysis;
    const status = analysis.overall_status;
    const score = Math.max(0, Math.min(100, analysis.overall_score));
    const passForPrint =
      analysis.pass_for_print ?? (status === 'ok' || status === 'warning');

    // Web UI historycznie wymagało ~100 — mapujemy pass → 100, żeby nie blokować dobrych ujęć.
    const compliancePercent = passForPrint ? 100 : score;

    const codeViolations = [
      ...analysis.critical_codes,
      ...analysis.warning_codes,
      ...analysis.issue_codes,
    ].filter((code) => /^[A-Z0-9_]+$/.test(code));

    return {
      compliancePercent,
      overallStatus: status,
      passForPrint,
      violations: [...new Set(codeViolations)],
    };
  }

  async generateImposition1x8(sessionId: string, photoId: string): Promise<{ path: string | null }> {
    return this.generateImposition1x8WithOptions(sessionId, photoId, {});
  }

  async generateImposition1x8WithOptions(
    sessionId: string,
    photoId: string,
    options: Imposition1x8Options
  ): Promise<{ path: string | null }> {
    const response = await this.request('/api/imposition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        photo_id: photoId,
        layout: '8',
        paper: '10x15',
        output_format: 'jpg',
        dpi: 300,
        gap_mm: options.gapMm ?? 1.5,
        cut_lines: options.cutLines ?? true,
      }),
    });
    const parsed = FotowayImpositionSchema.parse(response);
    return { path: parsed.imposition_path ?? null };
  }

  async processPhotoAuto(photoId: string): Promise<{ processedPath: string | null }> {
    const response = await this.request(`/api/photos/${photoId}/process-auto`, {
      method: 'POST',
    });
    const parsed = FotowayProcessAutoSchema.parse(response);
    return {
      processedPath: parsed.processed_path ?? parsed.photo?.processed_path ?? null,
    };
  }

  async cropPhotoToBiometric(photoId: string): Promise<{ cropPath: string | null }> {
    const response = await this.request(`/api/photos/${photoId}/crop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accept: true,
        manual_adjustments: {
          offset_x: 0,
          offset_y: 0,
          scale: 1,
          rotation: 0,
        },
      }),
    });
    const parsed = FotowayCropSchema.parse(response);
    return { cropPath: parsed.crop_path ?? null };
  }

  async getPhotoFilePaths(photoId: string): Promise<LegacyPhotoFilePaths> {
    const response = await this.request(`/api/photos/${photoId}`, { method: 'GET' });
    const parsed = FotowayPhotoDetailsSchema.parse(response);
    return {
      originalPath: parsed.original_path ?? null,
      processedPath: parsed.processed_path ?? null,
      cropPath: parsed.crop_path ?? null,
      impositionPath: parsed.imposition_path ?? null,
    };
  }

  buildReadFileUrl(path: string): string {
    return `${this.baseUrl}/api/files?path=${encodeURIComponent(path)}`;
  }

  private async request(path: string, init: RequestInit): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        signal: controller.signal,
      });
      if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`FOTOWAY API ${response.status}: ${body || 'request failed'}`);
      }
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }
}
