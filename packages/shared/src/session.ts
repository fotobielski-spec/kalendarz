import { z } from 'zod';

/** Status sesji capture (etap 1+) */
export const SessionStatusSchema = z.enum([
  'created',
  'qr_displayed',
  'mobile_opened',
  'uploading',
  'uploaded',
  'analyzing',
  'analysis_failed',
  'analysis_passed',
  'generating',
  'preview_ready',
  'checkout',
  'paid',
  'delivered',
  'abandoned',
  'expired',
]);
export type SessionStatus = z.infer<typeof SessionStatusSchema>;

export const CreateSessionResponseSchema = z.object({
  sessionId: z.string().uuid(),
  qrToken: z.string(),
  mobileUrl: z.string().url(),
  expiresAt: z.string().datetime(),
});
export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>;

export const SessionDetailsResponseSchema = z.object({
  sessionId: z.string().uuid(),
  qrToken: z.string(),
  status: SessionStatusSchema,
  expiresAt: z.string().datetime(),
  uploadCount: z.number().int().nonnegative(),
  analysisStatus: z.enum(['pending', 'running', 'completed', 'failed']).optional(),
  compliancePercent: z.number().min(0).max(100).optional(),
});
export type SessionDetailsResponse = z.infer<typeof SessionDetailsResponseSchema>;

export const SessionResolveByTokenResponseSchema = z.object({
  sessionId: z.string().uuid(),
  qrToken: z.string(),
  status: SessionStatusSchema,
  expiresAt: z.string().datetime(),
});
export type SessionResolveByTokenResponse = z.infer<typeof SessionResolveByTokenResponseSchema>;

export const CreateUploadResponseSchema = z.object({
  uploadId: z.string().uuid(),
  sessionId: z.string().uuid(),
  status: SessionStatusSchema,
  mimeType: z.string(),
  sizeBytes: z.number().int().positive(),
  legacyPhotoId: z.string().optional(),
});
export type CreateUploadResponse = z.infer<typeof CreateUploadResponseSchema>;
