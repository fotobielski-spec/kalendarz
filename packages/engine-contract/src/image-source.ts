import { z } from 'zod';

/** Obraz wejściowy — API przekazuje lokalizację w S3 (engine pobiera po signed URL). */
export const ImageSourceSchema = z.object({
  type: z.literal('s3'),
  bucket: z.string(),
  key: z.string(),
  /** Opcjonalny signed GET — jeśli engine nie ma własnych credów do bucketu */
  signedGetUrl: z.string().url().optional(),
});
export type ImageSource = z.infer<typeof ImageSourceSchema>;
