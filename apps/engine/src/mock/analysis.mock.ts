import type { EngineAnalysisResult } from '@dokumenty-id/engine-contract';
import type { EngineConfig } from '../config.js';

const jobs = new Map<string, EngineAnalysisResult>();

export function startAnalysisMock(
  sessionId: string,
  config: EngineConfig,
): { jobId: string } {
  const jobId = crypto.randomUUID();
  jobs.set(jobId, {
    jobId,
    sessionId,
    status: 'running',
    compliancePercent: 0,
    violations: [],
    engineVersion: config.engineVersion,
  });

  // Symulacja async — wynik gotowy od razu po pierwszym GET (uproszczenie mock)
  setTimeout(() => {
    jobs.set(jobId, buildCompletedAnalysis(jobId, sessionId, config));
  }, 100);

  return { jobId };
}

export function getAnalysisMock(jobId: string): EngineAnalysisResult | undefined {
  return jobs.get(jobId);
}

function buildCompletedAnalysis(
  jobId: string,
  sessionId: string,
  config: EngineConfig,
): EngineAnalysisResult {
  return {
    jobId,
    sessionId,
    status: 'completed',
    compliancePercent: 100,
    violations: [],
    rules: {
      hair_on_face: { passed: true, score: 100, code: 'hair_on_face' },
      hair_on_eyebrows: { passed: true, score: 100, code: 'hair_on_eyebrows' },
    },
    engineVersion: config.engineVersion,
  };
}

/** Mock: wymuś wynik z błędami (nagłówek testowy X-Mock-Scenario: fail) */
export function setAnalysisFailMock(jobId: string, sessionId: string, config: EngineConfig): void {
  jobs.set(jobId, {
    jobId,
    sessionId,
    status: 'completed',
    compliancePercent: 72,
    violations: [
      {
        code: 'FACE_NOT_CENTERED',
        severity: 'error',
        score: 72,
        messagePl: 'Twarz nie jest wyśrodkowana w kadrze.',
      },
      {
        code: 'hair_on_face',
        severity: 'warning',
        score: 80,
        messagePl: 'Włosy zasłaniają część twarzy.',
      },
    ],
    rules: {
      hair_on_face: { passed: false, score: 80, code: 'hair_on_face' },
      hair_on_eyebrows: { passed: true, score: 100, code: 'hair_on_eyebrows' },
    },
    engineVersion: config.engineVersion,
  });
}
