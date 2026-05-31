import type { AnalysisResult } from '@dokumenty-id/shared';

/** Wejście analizy — obraz już w S3 (ścieżka wewnętrzna aplikacji). */
export type AnalysisInput = {
  sessionId: string;
  storageKey: string;
  bucket: string;
};

export type GenerateInput = {
  sessionId: string;
  sourceStorageKey: string;
  bucket: string;
};

export type GeneratedOutputFile = {
  type: 'electronic' | 'imposition_1x8_10x15';
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
};

export type GenerateOutput = {
  sessionId: string;
  files: GeneratedOutputFile[];
};

/** Kontrakt modułu przetwarzania — implementacja w tym repozytorium, bez zewnętrznych systemów. */
export interface BiometricProcessor {
  readonly version: string;
  analyze(input: AnalysisInput): Promise<AnalysisResult>;
  generate(input: GenerateInput): Promise<GenerateOutput>;
}
