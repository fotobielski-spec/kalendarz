import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MockBiometricProcessor } from '@dokumenty-id/processing';
import { ProcessingService } from './processing.service.js';

describe('ProcessingService', () => {
  it('uses internal processor only', async () => {
    const svc = new ProcessingService(new MockBiometricProcessor());
    const sessionId = crypto.randomUUID();
    const result = await svc.analyze({
      sessionId,
      storageKey: 'raw/a.jpg',
      bucket: 'dokumenty-id',
    });
    assert.equal(result.compliancePercent, 100);
    assert.match(svc.version, /mock-internal/);
  });
});
