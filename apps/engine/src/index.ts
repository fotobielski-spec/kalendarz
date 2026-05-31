import Fastify from 'fastify';
import cors from '@fastify/cors';
import { loadConfig } from './config.js';
import { authPlugin } from './plugins/auth.js';
import { healthRoutes } from './routes/health.js';
import { analysisRoutes } from './routes/analysis.js';
import { generateRoutes } from './routes/generate.js';

const config = loadConfig();

const app = Fastify({
  logger: { level: 'info' },
});

await app.register(cors);
await app.register(authPlugin(config));
await app.register(healthRoutes(config));
await app.register(analysisRoutes(config));
await app.register(generateRoutes(config));

await app.listen({ port: config.port, host: config.host });
app.log.info(`Engine listening (${config.mode}) on ${config.host}:${config.port}`);
