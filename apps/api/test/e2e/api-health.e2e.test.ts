import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from '../../src/routes/health.js';
import multipart from '@fastify/multipart';
import { buildSessionRoutes } from '../../src/routes/sessions.js';
import { InMemorySessionStore } from '../../src/repositories/session-store.js';

/**
 * Minimalny test e2e API — pełny flow upload w etapie 1.
 */
describe('API e2e (etap 0)', () => {
  let app: ReturnType<typeof Fastify>;

  before(async () => {
    app = Fastify({ logger: false });
    await app.register(cors);
    await app.register(multipart);
    await app.register(healthRoutes, { prefix: '/api/v1' });
    await app.register(buildSessionRoutes({ store: new InMemorySessionStore() }), {
      prefix: '/api/v1',
    });
    await app.ready();
  });

  after(async () => {
    await app.close();
  });

  it('health + create session flow', async () => {
    const health = await app.inject({ method: 'GET', url: '/api/v1/health' });
    assert.equal(health.statusCode, 200);

    const session = await app.inject({ method: 'POST', url: '/api/v1/sessions' });
    assert.equal(session.statusCode, 200);
    const body = session.json() as { sessionId: string; mobileUrl: string; qrToken: string };
    assert.ok(body.sessionId);
    assert.ok(body.mobileUrl.includes('/m/'));

    const status = await app.inject({
      method: 'GET',
      url: `/api/v1/sessions/${body.sessionId}`,
    });
    assert.equal(status.statusCode, 200);

    const byToken = await app.inject({
      method: 'GET',
      url: `/api/v1/sessions/by-token/${body.qrToken}`,
    });
    assert.equal(byToken.statusCode, 200);
  });
});
