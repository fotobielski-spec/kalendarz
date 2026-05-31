import type { FastifyPluginAsync } from 'fastify';
import {
  StartAnalysisRequestSchema,
  StartAnalysisResponseSchema,
  EngineAnalysisResultSchema,
} from '@dokumenty-id/engine-contract';
import type { EngineConfig } from '../config.js';
import {
  getAnalysisMock,
  setAnalysisFailMock,
  startAnalysisMock,
} from '../mock/analysis.mock.js';

export const analysisRoutes =
  (config: EngineConfig): FastifyPluginAsync =>
  async (app) => {
    app.post('/v1/jobs/analysis', async (request, reply) => {
      const body = StartAnalysisRequestSchema.parse(request.body);
      const mockScenario = request.headers['x-mock-scenario'];

      if (config.mode !== 'mock') {
        return reply.code(501).send({
          error: 'NOT_IMPLEMENTED',
          message: 'ENGINE_MODE=legacy — port core z backupu w toku (docs/ENGINE_REBUILD.md)',
        });
      }

      const { jobId } = startAnalysisMock(body.sessionId, config);
      if (mockScenario === 'fail') {
        setAnalysisFailMock(jobId, body.sessionId, config);
      }

      return StartAnalysisResponseSchema.parse({ jobId, status: 'pending' });
    });

    app.get('/v1/jobs/analysis/:jobId', async (request, reply) => {
      const { jobId } = request.params as { jobId: string };
      const result = getAnalysisMock(jobId);
      if (!result) {
        return reply.code(404).send({ error: 'JOB_NOT_FOUND' });
      }
      return EngineAnalysisResultSchema.parse(result);
    });
  };
