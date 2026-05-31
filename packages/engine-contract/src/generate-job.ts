import { z } from 'zod';

export const GenerateAssetTypeSchema = z.enum(['electronic', 'imposition_1x8_10x15']);
export type GenerateAssetType = z.infer<typeof GenerateAssetTypeSchema>;

export const StartGenerateRequestSchema = z.object({
  sessionId: z.string().uuid(),
  /** Klucz S3 zatwierdzonego zdjęcia źródłowego (po analizie 100%) */
  sourceImageKey: z.string(),
  types: z.array(GenerateAssetTypeSchema).min(1),
});
export type StartGenerateRequest = z.infer<typeof StartGenerateRequestSchema>;

export const StartGenerateResponseSchema = z.object({
  jobId: z.string().uuid(),
  status: z.literal('pending'),
});
export type StartGenerateResponse = z.infer<typeof StartGenerateResponseSchema>;

export const GeneratedFileSchema = z.object({
  type: GenerateAssetTypeSchema,
  bucket: z.string(),
  key: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number().int().positive(),
});

export const EngineGenerateResultSchema = z.object({
  jobId: z.string().uuid(),
  sessionId: z.string().uuid(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  files: z.array(GeneratedFileSchema),
  engineVersion: z.string(),
  errorCode: z.string().optional(),
});
export type EngineGenerateResult = z.infer<typeof EngineGenerateResultSchema>;
