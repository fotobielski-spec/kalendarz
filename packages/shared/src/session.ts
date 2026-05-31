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
