# Przebudowa programu „Dokumenty ID” pod sklep webowy

## Cel

Istniejący program desktopowy (analiza, generacja, impozycja 1×8) ma zostać **przebudowany na usługę HTTP** (`apps/engine`), której używa sklep **`apps/web` + `apps/api`**. Logika biometryczna **migruje z UI**, nie jest pisana od zera w Node — o ile źródło legacy da się wyodrębnić.

## Zasada: strangler, nie big-bang

```text
[Faza A] Legacy desktop (obecny)     ──┐
                                      ├── wspólne moduły core (docelowo)
[Faza B] apps/engine (HTTP, mock)  ──┘
         ▲
         │ adapter HTTP
[Faza C] apps/api + apps/web (sklep online)
```

1. **Faza A** — zmapuj moduły w starym programie (lista poniżej).  
2. **Faza B** — uruchom `apps/engine` z mockiem; podłącz `apps/api` adapter.  
3. **Faza C** — przenoś kolejno: analiza → generacja elektroniczna → impozycja.  
4. **Faza D** — wyłącz desktop dla ścieżki klienta końcowego; zostaw tylko admin/dev jeśli potrzeba.

## Mapowanie modułów legacy → nowa struktura

| Moduł w starym programie | Docelowa lokalizacja | Uwagi |
|--------------------------|----------------------|--------|
| Wczytanie / normalizacja JPEG | `apps/engine/src/core/image-io/` | Wejście: signed URL lub stream z S3 |
| Reguły biometryczne (istniejące) | `apps/engine/src/core/analysis/rules/` | Bez zmiany semantyki kodów błędów |
| **hair_on_face** (nowe) | `.../rules/hair-on-face.*` | Zwracane w JSON jak w `AnalysisResult` |
| **hair_on_eyebrows** (nowe) | `.../rules/hair-on-eyebrows.*` | j.w. |
| Skoring / compliance % | `.../analysis/scoring.*` | 100% = trigger generacji w API |
| Generacja pliku elektronicznego | `apps/engine/src/core/generate/electronic.*` | Bez UI |
| Impozycja 1×8 na 10×15 | `apps/engine/src/core/generate/imposition-1x8.*` | Bez UI |
| Zapis pliku / ścieżki | Zastąpione przez **S3** (API zapisuje wynik) | Engine zwraca bytes lub uploaduje do bucketu callbackiem |
| Formularze / okna / druk lokalny | **Usunąć** ze ścieżki web | Zastępuje `apps/web` + Stripe + e-mail / wysyłka |

## Kontrakt HTTP (źródło prawdy)

Typy i schematy: `packages/engine-contract`  
Implementacja referencyjna (mock): `apps/engine`  
Klient w sklepie: `apps/api/src/adapters/dokumenty-id/`

### Endpointy v1

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| `GET` | `/v1/health` | Healthcheck |
| `POST` | `/v1/jobs/analysis` | Start analizy (obraz z S3 / signed URL) |
| `GET` | `/v1/jobs/analysis/:jobId` | Status + wynik |
| `POST` | `/v1/jobs/generate` | Start generacji (po compliance 100%) |
| `GET` | `/v1/jobs/generate/:jobId` | Status + klucze S3 wyników |

Autoryzacja: nagłówek `Authorization: Bearer <DOKUMENTY_ID_ENGINE_API_KEY>`.

## Dostosowanie do sklepu online (PRODUCT_MODEL)

| Potrzeba web | Zmiana w silniku |
|--------------|------------------|
| Brak UI desktop | Tylko JSON in/out |
| Sesja = UUID sklepu | `sessionId` w każdym jobie (korelacja logów) |
| Asynchroniczność | Joby + polling (nie blokować HTTP 60s+) |
| Nowe reguły włosów | Rozszerzenie JSON `rules.hair_on_face`, `rules.hair_on_eyebrows` |
| Dwa pliki po sukcesie | `generate`: `electronic` + `imposition_1x8_10x15` |
| RODO | Brak logowania pikseli; tylko `sessionId`, `jobId` |
| Skala | Stateless workers; kolejka po stronie API (BullMQ) woła engine |

## Kolejność prac (techniczna)

### E1 — Szkielet (ten PR)

- [x] `packages/engine-contract`
- [x] `apps/engine` z trybem `ENGINE_MODE=mock`
- [x] Adapter HTTP w `apps/api`
- [x] Docker Compose: serwis `engine` na porcie 4100

### E2 — Port analizy z legacy

- [ ] Przenieść reguły do `core/analysis`
- [ ] Testy regresji: zestaw zdjęć referencyjnych (golden JSON)
- [ ] Podłączyć `ENGINE_MODE=legacy` (most do starego kodu: FFI, child_process, lub .NET sidecar — zależnie od stacku)

### E3 — Port generacji

- [ ] `electronic` + `imposition_1x8_10x15`
- [ ] Upload wyników do S3 (presigned PUT z API lub zwrot base64 dla małych plików — preferowany S3)

### E4 — Reguły włosów

- [ ] Implementacja w core lub TODO z jasnym `passed: false` w mock

### E5 — Produkcja

- [ ] Engine w EU (osobny kontener / VM)
- [ ] Timeouty, circuit breaker w adapterze API
- [ ] Wersjonowanie: `engineVersion` w odpowiedzi

## Co musisz dostarczyć z backupu legacy

1. **Stack** (Delphi / C# / C++ / Python?)  
2. **Lista plików** modułów analizy i generacji  
3. **10–20 zdjęć testowych** + oczekiwany wynik (JSON)  
4. Czy legacy ma już API lub tylko GUI  

Bez tego — pracujemy na **mocku** (`apps/engine`) i sklep web dochodzi do etapu 3; port core równolegle.

## Uruchomienie lokalne (mock)

```bash
docker compose up -d
pnpm install
pnpm --filter @dokumenty-id/engine-contract build
pnpm --filter @dokumenty-id/engine build
pnpm --filter @dokumenty-id/shared build
# terminal 1
pnpm --filter @dokumenty-id/engine dev
# terminal 2
pnpm --filter @dokumenty-id/api dev
```

`DOKUMENTY_ID_ENGINE_BASE_URL=http://localhost:4100`
