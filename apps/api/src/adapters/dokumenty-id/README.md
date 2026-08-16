# Adapter: silnik Dokumenty ID (FOTOWAY ID jako baza)

Ten katalog zawiera **wyłącznie adapter HTTP** do istniejącego systemu Dokumenty ID.
W praktyce bazujemy na obecnym backendzie `FOTOWAY ID` (FastAPI), a nowa aplikacja
`apps/web + apps/api` działa jako warstwa online i sprzedażowa.

## Zasady

- **Nie przepisujemy** logiki analizy, generacji ani impozycji 1×8.
- Adapter mapuje kontrakty zewnętrzne na typy `@dokumenty-id/shared`.
- Nowe reguły `hair_on_face` / `hair_on_eyebrows` — mapowanie w etapie 2.

## Dostępny interfejs (start migracji)

Plik: `fotoway-client.ts`

- `createLegacySession(documentProfileId?)`
- `uploadPhotoToLegacy(sessionId, file, filename)`
- `analyzePhoto(photoId)`
- `generateImposition1x8(sessionId, photoId)`

To pozwala od razu wykorzystywać obecny silnik analizy/impozycji bez przepisywania logiki.

## Planowany interfejs docelowy (etap 2+)

```ts
interface DokumentyIdEngine {
  startAnalysis(input: { sessionId: string; imageStorageKey: string }): Promise<{ jobId: string }>;
  getAnalysisStatus(jobId: string): Promise<AnalysisResult>;
  generateElectronic(input: { sessionId: string }): Promise<{ storageKey: string }>;
  generateImposition1x8(input: { sessionId: string }): Promise<{ storageKey: string }>;
}
```

Implementacja: `engine.client.ts` + testy integracyjne z mockiem HTTP.
