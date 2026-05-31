import type { FastifyPluginAsync } from 'fastify';
import type { EngineConfig } from '../config.js';

export const healthRoutes =
  (config: EngineConfig): FastifyPluginAsync =>
  async (app) => {
    app.get('/v1/health', async () => ({
      status: 'ok',
      service: 'dokumenty-id-engine',
      mode: config.mode,
      engineVersion: config.engineVersion,
    }));
  };
