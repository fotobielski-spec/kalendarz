import { createProcessor, type BiometricProcessor } from '@dokumenty-id/processing';
import type { AnalysisResult } from '@dokumenty-id/shared';
import type { AnalysisInput, GenerateInput, GenerateOutput } from '@dokumenty-id/processing';

/** Warstwa serwisowa API — przetwarzanie biometryczne w tej samej aplikacji. */
export class ProcessingService {
  private readonly processor: BiometricProcessor;

  constructor(processor?: BiometricProcessor) {
    this.processor = processor ?? createProcessor();
  }

  get version(): string {
    return this.processor.version;
  }

  analyze(input: AnalysisInput): Promise<AnalysisResult> {
    return this.processor.analyze(input);
  }

  generate(input: GenerateInput): Promise<GenerateOutput> {
    return this.processor.generate(input);
  }
}
