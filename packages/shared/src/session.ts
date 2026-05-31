import { z } from 'zod';

/**
 * Status sesji wizyty w sklepie online (etap 1+).
 * QR opcjonalny: tylko gdy użytkownik na desktopie przenosi capture na telefon.
 */
export const SessionStatusSchema = z.enum([
  'created',
  'qr_displayed', // opcjonalnie: desktop → kontynuacja na telefonie
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
