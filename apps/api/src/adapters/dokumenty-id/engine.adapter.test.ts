import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { DokumentyIdEngineAdapter } from './engine.adapter.js';
import { DokumentyIdEngineClient } from './engine.client.js';

describe('DokumentyIdEngineAdapter', () => {
  it('maps engine analysis to shared AnalysisResult', async () => {
    const sessionId = crypto.randomUUID();
    const jobId = crypto.randomUUID();

    const client = {
      startAnalysis: mock.fn(async () => ({ jobId, status: 'pending' as const })),
      getAnalysis: mock.fn(async () => ({
        jobId,
        sessionId,
        status: 'completed' as const,
        compliancePercent: 100,
        violations: [],
        rules: {
          hair_on_face: { passed: true, score: 100 },
          hair_on_eyebrows: { passed: true, score: 100 },
        },
        engineVersion: '0.1.0-mock',
      })),
    } as unknown as DokumentyIdEngineClient;

    const adapter = new DokumentyIdEngineAdapter(client);
    await adapter.startAnalysis(sessionId, {
      type: 's3',
      bucket: 'dokumenty-id',
      key: 'raw/test.jpg',
    });
    const result = await adapter.getAnalysisResult(jobId);

    assert.equal(result.sessionId, sessionId);
    assert.equal(result.compliancePercent, 100);
    assert.equal(result.rules?.hair_on_face?.passed, true);
  });
});
