import type {
  EngineAnalysisResult,
  EngineGenerateResult,
  StartAnalysisRequest,
  StartGenerateRequest,
} from '@dokumenty-id/engine-contract';

export type EngineClientConfig = {
  baseUrl: string;
  apiKey?: string;
  timeoutMs: number;
};

export class DokumentyIdEngineClient {
  constructor(private readonly config: EngineClientConfig) {}

  private headers(extra?: Record<string, string>): Record<string, string> {
    const h: Record<string, string> = { 'content-type': 'application/json', ...extra };
    if (this.config.apiKey) {
      h.authorization = `Bearer ${this.config.apiKey}`;
    }
    return h;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const res = await fetch(`${this.config.baseUrl}${path}`, {
        ...init,
        signal: controller.signal,
        headers: { ...this.headers(), ...(init?.headers as Record<string, string>) },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new EngineHttpError(res.status, text);
      }
      return (await res.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  startAnalysis(body: StartAnalysisRequest): Promise<{ jobId: string; status: 'pending' }> {
    return this.request('/v1/jobs/analysis', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  getAnalysis(jobId: string): Promise<EngineAnalysisResult> {
    return this.request(`/v1/jobs/analysis/${jobId}`);
  }

  startGenerate(body: StartGenerateRequest): Promise<{ jobId: string; status: 'pending' }> {
    return this.request('/v1/jobs/generate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  getGenerate(jobId: string): Promise<EngineGenerateResult> {
    return this.request(`/v1/jobs/generate/${jobId}`);
  }

  health(): Promise<{ status: string; mode: string; engineVersion: string }> {
    return this.request('/v1/health');
  }
}

export class EngineHttpError extends Error {
  constructor(
    readonly statusCode: number,
    readonly body: string,
  ) {
    super(`Engine HTTP ${statusCode}: ${body}`);
    this.name = 'EngineHttpError';
  }
}

export function createEngineClientFromEnv(): DokumentyIdEngineClient {
  const baseUrl = process.env.DOKUMENTY_ID_ENGINE_BASE_URL ?? 'http://localhost:4100';
  const timeoutMs = Number(process.env.DOKUMENTY_ID_ENGINE_TIMEOUT_MS ?? 30_000);
  return new DokumentyIdEngineClient({
    baseUrl,
    apiKey: process.env.DOKUMENTY_ID_ENGINE_API_KEY,
    timeoutMs,
  });
}
