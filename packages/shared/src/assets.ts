import { z } from 'zod';

export const GeneratedAssetTypeSchema = z.enum(['electronic', 'imposition_1x8']);
export type GeneratedAssetType = z.infer<typeof GeneratedAssetTypeSchema>;

export const GeneratedAssetSchema = z.object({
  assetId: z.string().uuid(),
  type: GeneratedAssetTypeSchema,
  status: z.enum(['ready']),
  expiresAt: z.string().datetime(),
  securedDownloadUrl: z.string().url(),
});
export type GeneratedAsset = z.infer<typeof GeneratedAssetSchema>;

export const GenerateAssetsResponseSchema = z.object({
  sessionId: z.string().uuid(),
  status: z.literal('preview_ready'),
  previewUrl: z.string().url(),
  previewTokenExpiresAt: z.string().datetime(),
  assets: z.array(GeneratedAssetSchema).length(2),
});
export type GenerateAssetsResponse = z.infer<typeof GenerateAssetsResponseSchema>;
