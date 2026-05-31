import Fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health.js';
import { sessionRoutes } from './routes/sessions.js';
import { loadConfig } from './config.js';

const config = loadConfig();

const app = Fastify({
  logger: {
    level: config.nodeEnv === 'production' ? 'info' : 'debug',
    redact: ['req.headers.authorization', 'req.body.password'],
  },
});

await app.register(cors, {
  origin: config.corsOrigins,
  credentials: true,
});

await app.register(healthRoutes, { prefix: '/api/v1' });
await app.register(sessionRoutes, { prefix: '/api/v1' });

const start = async () => {
  try {
    await app.listen({ port: config.port, host: config.host });
    app.log.info(`API listening on ${config.host}:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
