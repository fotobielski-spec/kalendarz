import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import { healthRoutes } from './health.js';

describe('GET /health', () => {
  it('returns ok status', async () => {
    const app = Fastify();
    await app.register(healthRoutes, { prefix: '/api/v1' });

    const res = await app.inject({ method: 'GET', url: '/api/v1/health' });
    assert.equal(res.statusCode, 200);
    const body = res.json() as { status: string; service: string };
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'dokumenty-id-api');
    await app.close();
  });
});
