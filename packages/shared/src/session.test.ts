import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SessionStatusSchema } from './session.js';

describe('SessionStatusSchema', () => {
  it('accepts valid status', () => {
    assert.equal(SessionStatusSchema.parse('created'), 'created');
  });

  it('rejects invalid status', () => {
    assert.throws(() => SessionStatusSchema.parse('invalid'));
  });
});
