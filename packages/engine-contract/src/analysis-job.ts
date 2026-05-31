import { z } from 'zod';
import { ImageSourceSchema } from './image-source.js';

export const StartAnalysisRequestSchema = z.object({
  sessionId: z.string().uuid(),
  image: ImageSourceSchema,
});
export type StartAnalysisRequest = z.infer<typeof StartAnalysisRequestSchema>;

export const StartAnalysisResponseSchema = z.object({
  jobId: z.string().uuid(),
  status: z.literal('pending'),
});
export type StartAnalysisResponse = z.infer<typeof StartAnalysisResponseSchema>;

export const EngineAnalysisRuleResultSchema = z.object({
  passed: z.boolean(),
  score: z.number().min(0).max(100).optional(),
  code: z.string().optional(),
  messagePl: z.string().optional(),
});

export const EngineViolationSchema = z.object({
  code: z.string(),
  severity: z.enum(['error', 'warning']),
  score: z.number().min(0).max(100).optional(),
  messagePl: z.string().optional(),
});

export const EngineAnalysisResultSchema = z.object({
  jobId: z.string().uuid(),
  sessionId: z.string().uuid(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  compliancePercent: z.number().min(0).max(100),
  violations: z.array(EngineViolationSchema),
  rules: z
    .object({
      hair_on_face: EngineAnalysisRuleResultSchema.optional(),
      hair_on_eyebrows: EngineAnalysisRuleResultSchema.optional(),
    })
    .optional(),
  engineVersion: z.string(),
  errorCode: z.string().optional(),
});
export type EngineAnalysisResult = z.infer<typeof EngineAnalysisResultSchema>;
