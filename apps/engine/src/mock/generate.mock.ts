import type { EngineGenerateResult, GenerateAssetType } from '@dokumenty-id/engine-contract';
import type { EngineConfig } from '../config.js';

const jobs = new Map<string, EngineGenerateResult>();

export function startGenerateMock(
  sessionId: string,
  sourceImageKey: string,
  types: GenerateAssetType[],
  config: EngineConfig,
): { jobId: string } {
  const jobId = crypto.randomUUID();
  const bucket = process.env.S3_BUCKET ?? 'dokumenty-id';

  jobs.set(jobId, {
    jobId,
    sessionId,
    status: 'running',
    files: [],
    engineVersion: config.engineVersion,
  });

  setTimeout(() => {
    const files = types.map((type) => ({
      type,
      bucket,
      key: `generated/${sessionId}/${type}.jpg`,
      mimeType: 'image/jpeg',
      sizeBytes: 120_000,
    }));
    jobs.set(jobId, {
      jobId,
      sessionId,
      status: 'completed',
      files,
      engineVersion: config.engineVersion,
    });
  }, 150);

  return { jobId };
}

export function getGenerateMock(jobId: string): EngineGenerateResult | undefined {
  return jobs.get(jobId);
}
