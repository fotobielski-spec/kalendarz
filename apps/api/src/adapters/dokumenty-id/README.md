# Adapter: silnik Dokumenty ID

Ten katalog zawiera **wyłącznie adapter HTTP** do istniejącego systemu Dokumenty ID.

## Zasady

- **Nie przepisujemy** logiki analizy, generacji ani impozycji 1×8.
- Adapter mapuje kontrakty zewnętrzne na typy `@dokumenty-id/shared`.
- Nowe reguły `hair_on_face` / `hair_on_eyebrows` — mapowanie w etapie 2.

## Planowany interfejs (etap 2)

```ts
interface DokumentyIdEngine {
  startAnalysis(input: { sessionId: string; imageStorageKey: string }): Promise<{ jobId: string }>;
  getAnalysisStatus(jobId: string): Promise<AnalysisResult>;
  generateElectronic(input: { sessionId: string }): Promise<{ storageKey: string }>;
  generateImposition1x8(input: { sessionId: string }): Promise<{ storageKey: string }>;
}
```

Implementacja: `engine.client.ts` + testy integracyjne z mockiem HTTP.
