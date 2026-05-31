import type { FastifyPluginAsync } from 'fastify';
import { CreateSessionResponseSchema } from '@dokumenty-id/shared';
import { loadConfig } from '../config.js';

/**
 * Sesje sklepu online — pełna implementacja w ETAPIE 1.
 * QR opcjonalny (desktop → telefon); domyślnie capture w tej samej przeglądarce.
 */
export const sessionRoutes: FastifyPluginAsync = async (app) => {
  const config = loadConfig();

  app.post('/sessions', async () => {
    const sessionId = crypto.randomUUID();
    const qrToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const mobileUrl = `${config.appBaseUrl}/m/${qrToken}`;

    const response = CreateSessionResponseSchema.parse({
      sessionId,
      qrToken,
      mobileUrl,
      expiresAt,
    });

    return { ...response, _note: 'ETAP 0: brak zapisu DB — implementacja w etapie 1' };
  });

  app.get('/sessions/:sessionId', async (request) => {
    const { sessionId } = request.params as { sessionId: string };
    return {
      sessionId,
      status: 'created',
      _note: 'ETAP 0: placeholder statusu',
    };
  });
};
