import { z } from 'zod';

const ConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'test', 'production']).default('development'),
  port: z.coerce.number().default(4000),
  host: z.string().default('0.0.0.0'),
  databaseUrl: z.string().url().or(z.string().startsWith('postgresql://')),
  appBaseUrl: z.string().url().default('http://localhost:3000'),
  corsOrigins: z.array(z.string()).default(['http://localhost:3000', 'http://localhost:3001']),
});

export type AppConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(): AppConfig {
  const corsRaw = process.env.CORS_ORIGINS;
  const corsOrigins = corsRaw
    ? corsRaw.split(',').map((s) => s.trim())
    : ['http://localhost:3000', 'http://localhost:3001'];

  return ConfigSchema.parse({
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: process.env.API_PORT ?? 4000,
    host: process.env.API_HOST ?? '0.0.0.0',
    databaseUrl: process.env.DATABASE_URL ?? 'postgresql://dokumenty:dokumenty@localhost:5432/dokumenty_id',
    appBaseUrl: process.env.APP_BASE_URL ?? 'http://localhost:3000',
    corsOrigins,
  });
}
