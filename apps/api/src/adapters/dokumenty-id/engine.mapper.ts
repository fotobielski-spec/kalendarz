import type { EngineAnalysisResult } from '@dokumenty-id/engine-contract';
import type { AnalysisResult, AnalysisViolation } from '@dokumenty-id/shared';

/** Mapowanie odpowiedzi silnika → kontrakt sklepu (@dokumenty-id/shared) */
export function mapEngineAnalysisToShared(
  engine: EngineAnalysisResult,
): AnalysisResult {
  const violations: AnalysisViolation[] = engine.violations.map((v) => ({
    code: v.code,
    severity: v.severity,
    score: v.score,
  }));

  return {
    sessionId: engine.sessionId,
    status:
      engine.status === 'completed'
        ? 'completed'
        : engine.status === 'failed'
          ? 'failed'
          : engine.status === 'running'
            ? 'running'
            : 'pending',
    compliancePercent: engine.compliancePercent,
    violations,
    rules: engine.rules
      ? {
          hair_on_face: engine.rules.hair_on_face,
          hair_on_eyebrows: engine.rules.hair_on_eyebrows,
        }
      : undefined,
    engineVersion: engine.engineVersion,
    analyzedAt: engine.status === 'completed' ? new Date().toISOString() : undefined,
  };
}

/** Kody silnika → komunikaty PL dla UI (rozszerzane w etapie 2) */
export const ENGINE_VIOLATION_MESSAGES_PL: Record<string, string> = {
  FACE_NOT_CENTERED: 'Twarz nie jest wyśrodkowana w kadrze.',
  hair_on_face: 'Włosy zasłaniają część twarzy — popraw fryzurę lub zrób zdjęcie ponownie.',
  hair_on_eyebrows: 'Włosy nachodzą na brwi — popraw fryzurę lub zrób zdjęcie ponownie.',
};
