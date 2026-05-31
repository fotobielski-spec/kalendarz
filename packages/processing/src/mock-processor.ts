import type { AnalysisResult } from '@dokumenty-id/shared';
import type { AnalysisInput, BiometricProcessor, GenerateInput, GenerateOutput } from './types.js';

/**
 * Implementacja tymczasowa (dev / testy) — zastąpiona docelową logiką w packages/processing.
 * Nie woła żadnego zewnętrznego programu.
 */
export class MockBiometricProcessor implements BiometricProcessor {
  readonly version = '0.1.0-mock-internal';

  async analyze(input: AnalysisInput): Promise<AnalysisResult> {
    return {
      sessionId: input.sessionId,
      status: 'completed',
      compliancePercent: 100,
      violations: [],
      rules: {
        hair_on_face: { passed: true, score: 100 },
        hair_on_eyebrows: { passed: true, score: 100 },
      },
      processorVersion: this.version,
      analyzedAt: new Date().toISOString(),
    };
  }

  async generate(input: GenerateInput): Promise<GenerateOutput> {
    const base = `generated/${input.sessionId}`;
    return {
      sessionId: input.sessionId,
      files: [
        {
          type: 'electronic',
          storageKey: `${base}/electronic.jpg`,
          mimeType: 'image/jpeg',
          sizeBytes: 120_000,
        },
        {
          type: 'imposition_1x8_10x15',
          storageKey: `${base}/imposition-1x8.jpg`,
          mimeType: 'image/jpeg',
          sizeBytes: 240_000,
        },
      ],
    };
  }
}
