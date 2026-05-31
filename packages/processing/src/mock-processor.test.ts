import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MockBiometricProcessor } from './mock-processor.js';

describe('MockBiometricProcessor', () => {
  it('returns 100% analysis without external calls', async () => {
    const p = new MockBiometricProcessor();
    const sessionId = crypto.randomUUID();
    const result = await p.analyze({
      sessionId,
      storageKey: 'raw/x.jpg',
      bucket: 'test',
    });
    assert.equal(result.compliancePercent, 100);
    assert.equal(result.rules?.hair_on_face?.passed, true);
  });
});
