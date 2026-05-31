import type { FastifyPluginAsync } from 'fastify';
import {
  StartGenerateRequestSchema,
  StartGenerateResponseSchema,
  EngineGenerateResultSchema,
} from '@dokumenty-id/engine-contract';
import type { EngineConfig } from '../config.js';
import { getGenerateMock, startGenerateMock } from '../mock/generate.mock.js';

export const generateRoutes =
  (config: EngineConfig): FastifyPluginAsync =>
  async (app) => {
    app.post('/v1/jobs/generate', async (request, reply) => {
      const body = StartGenerateRequestSchema.parse(request.body);

      if (config.mode !== 'mock') {
        return reply.code(501).send({
          error: 'NOT_IMPLEMENTED',
          message: 'ENGINE_MODE=legacy — port generacji w toku',
        });
      }

      const { jobId } = startGenerateMock(
        body.sessionId,
        body.sourceImageKey,
        body.types,
        config,
      );
      return StartGenerateResponseSchema.parse({ jobId, status: 'pending' });
    });

    app.get('/v1/jobs/generate/:jobId', async (request, reply) => {
      const { jobId } = request.params as { jobId: string };
      const result = getGenerateMock(jobId);
      if (!result) {
        return reply.code(404).send({ error: 'JOB_NOT_FOUND' });
      }
      return EngineGenerateResultSchema.parse(result);
    });
  };
