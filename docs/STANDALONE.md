# Niezależna aplikacja — bez integracji z innymi programami

## Założenie

**Dokumenty ID Web** to samodzielny produkt. Nie integruje się ze starym programem desktop „Dokumenty ID” ani z żadnym zewnętrznym silnikiem przez HTTP.

Cała logika należy do tego monorepo:

| Warstwa | Odpowiedzialność |
|---------|------------------|
| `apps/web` | Sklep www, capture, koszyk, płatność |
| `apps/api` | API, sesje, S3, kolejki, Stripe, e-mail |
| `packages/processing` | **Analiza biometryczna + generacja plików** (własna implementacja) |
| `packages/shared` | Kontrakty i typy |
| `apps/admin` | Panel operacyjny |

## Gdzie powstaje logika biometryczna

```text
apps/api/src/services/processing/
        ↓ używa
packages/processing/     ← reguły, scoring, generacja JPEG, impozycja 1×8
```

Docelowo w `packages/processing/src/`:

- `analysis/rules/` — reguły (w tym `hair_on_face`, `hair_on_eyebrows`)
- `analysis/scoring.ts` — compliance 0–100%
- `generate/electronic.ts`
- `generate/imposition-1x8.ts`

Na etapie rozwoju: `PROCESSING_MODE=mock` (domyślnie).

## Czego nie ma w projekcie

- Adapterów do zewnętrznego API
- `DOKUMENTY_ID_ENGINE_*` w konfiguracji
- Osobnej usługi `apps/engine`
- Portowania kodu z backupu desktop

Inspiracja biznesowa ze starego programu jest OK; **kod i deployment są wyłącznie tutaj**.

## Kolejność implementacji

1. Etap 1 — capture + S3 + sesje  
2. Etap 2 — `packages/processing` (prawdziwa analiza, nie mock)  
3. Etap 3 — generacja + podgląd + kolejka BullMQ w API  
4. Etap 4–5 — płatność, admin  
