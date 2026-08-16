import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { PrismaClient } from '@prisma/client';
import { healthRoutes } from './routes/health.js';
import { buildSessionRoutes } from './routes/sessions.js';
import { loadConfig } from './config.js';
import { InMemorySessionStore, PrismaSessionStore } from './repositories/session-store.js';

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
await app.register(multipart, {
  limits: {
    fileSize: 15 * 1024 * 1024,
    files: 1,
  },
});

await app.register(healthRoutes, { prefix: '/api/v1' });
const prisma = config.nodeEnv === 'test' ? null : new PrismaClient();
const sessionStore = prisma ? new PrismaSessionStore(prisma) : new InMemorySessionStore();
await app.register(buildSessionRoutes({ store: sessionStore }), { prefix: '/api/v1' });

if (prisma) {
  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
}

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
