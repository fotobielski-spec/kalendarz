import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { startAnalysisMock, getAnalysisMock } from './analysis.mock.js';

describe('analysis mock', () => {
  it('completes with 100% compliance', async () => {
    const config = { engineVersion: 'test' } as Parameters<typeof startAnalysisMock>[1];
    const { jobId } = startAnalysisMock(crypto.randomUUID(), config);
    await new Promise((r) => setTimeout(r, 150));
    const result = getAnalysisMock(jobId);
    assert.ok(result);
    assert.equal(result.status, 'completed');
    assert.equal(result.compliancePercent, 100);
    assert.equal(result.rules?.hair_on_face?.passed, true);
  });
});
