import { z } from 'zod';

const ConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'test', 'production']).default('development'),
  port: z.coerce.number().default(4000),
  host: z.string().default('0.0.0.0'),
  databaseUrl: z.string().url().or(z.string().startsWith('postgresql://')),
  appBaseUrl: z.string().url().default('http://localhost:3000'),
  corsOrigins: z.array(z.string()).default(['http://localhost:3000', 'http://localhost:3001']),
  fotowayLegacyBaseUrl: z.string().url().optional(),
  dokumentyEngineTimeoutMs: z.coerce.number().positive().default(30_000),
  printReadyAutoProcess: z.boolean().default(true),
  impositionGapMm: z.coerce.number().min(0).max(6).default(1.5),
  impositionCutLines: z.boolean().default(true),
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
    // Local default keeps analysis enabled even when env vars are not loaded.
    fotowayLegacyBaseUrl: process.env.FOTOWAY_LEGACY_BASE_URL || 'http://127.0.0.1:8010',
    dokumentyEngineTimeoutMs: process.env.DOKUMENTY_ID_ENGINE_TIMEOUT_MS ?? 30_000,
    printReadyAutoProcess: parseBoolean(process.env.PRINT_READY_AUTO_PROCESS, true),
    impositionGapMm: process.env.IMPOSITION_GAP_MM ?? 1.5,
    impositionCutLines: parseBoolean(process.env.IMPOSITION_CUT_LINES, true),
  });
}

function parseBoolean(raw: string | undefined, fallback: boolean): boolean {
  if (raw === undefined) {
    return fallback;
  }
  const normalized = raw.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }
  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }
  return fallback;
}
