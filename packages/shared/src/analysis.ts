import { z } from 'zod';

export const AnalysisStatusSchema = z.enum([
  'pending',
  'running',
  'completed',
  'failed',
]);
export type AnalysisStatus = z.infer<typeof AnalysisStatusSchema>;

/** Pojedyncze naruszenie reguły biometrycznej */
export const AnalysisViolationSchema = z.object({
  code: z.string(),
  severity: z.enum(['error', 'warning']),
  /** Procent zgodności reguły 0–100 (jeśli dostępny) */
  score: z.number().min(0).max(100).optional(),
});
export type AnalysisViolation = z.infer<typeof AnalysisViolationSchema>;

/**
 * Kontrakt wyniku analizy — mapowany z zewnętrznego silnika Dokumenty ID.
 * hair_on_face / hair_on_eyebrows: nowe reguły (etap 2).
 */
export const AnalysisResultSchema = z.object({
  sessionId: z.string().uuid(),
  status: AnalysisStatusSchema,
  /** Ogólna zgodność 0–100; 100 = gotowe do generacji */
  compliancePercent: z.number().min(0).max(100),
  violations: z.array(AnalysisViolationSchema),
  rules: z
    .object({
      hair_on_face: z
        .object({
          passed: z.boolean(),
          score: z.number().min(0).max(100).optional(),
        })
        .optional(),
      hair_on_eyebrows: z
        .object({
          passed: z.boolean(),
          score: z.number().min(0).max(100).optional(),
        })
        .optional(),
    })
    .optional(),
  engineVersion: z.string().optional(),
  analyzedAt: z.string().datetime().optional(),
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
