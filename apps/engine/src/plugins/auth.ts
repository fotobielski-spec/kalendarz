import type { FastifyPluginAsync } from 'fastify';
import type { EngineConfig } from '../config.js';

export const authPlugin =
  (config: EngineConfig): FastifyPluginAsync =>
  async (app) => {
    if (!config.apiKey) {
      app.log.warn('DOKUMENTY_ID_ENGINE_API_KEY not set — auth disabled (dev only)');
      return;
    }

    app.addHook('onRequest', async (request, reply) => {
      if (request.url.startsWith('/v1/health')) return;

      const header = request.headers.authorization;
      const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
      if (token !== config.apiKey) {
        return reply.code(401).send({ error: 'UNAUTHORIZED' });
      }
    });
  };
