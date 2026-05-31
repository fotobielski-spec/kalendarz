import { z } from 'zod';

const ConfigSchema = z.object({
  port: z.coerce.number().default(4100),
  host: z.string().default('0.0.0.0'),
  apiKey: z.string().optional(),
  mode: z.enum(['mock', 'legacy']).default('mock'),
  engineVersion: z.string().default('0.1.0-mock'),
});

export type EngineConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(): EngineConfig {
  return ConfigSchema.parse({
    port: process.env.ENGINE_PORT ?? 4100,
    host: process.env.ENGINE_HOST ?? '0.0.0.0',
    apiKey: process.env.DOKUMENTY_ID_ENGINE_API_KEY,
    mode: process.env.ENGINE_MODE ?? 'mock',
    engineVersion: process.env.ENGINE_VERSION ?? '0.1.0-mock',
  });
}
