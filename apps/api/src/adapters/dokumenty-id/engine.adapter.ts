import type { AnalysisResult } from '@dokumenty-id/shared';
import type { ImageSource, StartGenerateRequest } from '@dokumenty-id/engine-contract';
import { DokumentyIdEngineClient } from './engine.client.js';
import { mapEngineAnalysisToShared } from './engine.mapper.js';

/**
 * Fasada adaptera — jedyne miejsce w API wołające przebudowany silnik Dokumenty ID.
 */
export class DokumentyIdEngineAdapter {
  constructor(private readonly client: DokumentyIdEngineClient) {}

  async startAnalysis(sessionId: string, image: ImageSource): Promise<{ jobId: string }> {
    return this.client.startAnalysis({ sessionId, image });
  }

  async getAnalysisResult(jobId: string): Promise<AnalysisResult> {
    const raw = await this.client.getAnalysis(jobId);
    return mapEngineAnalysisToShared(raw);
  }

  async startGenerate(input: StartGenerateRequest): Promise<{ jobId: string }> {
    return this.client.startGenerate(input);
  }

  async getGenerateResult(jobId: string) {
    return this.client.getGenerate(jobId);
  }
}
