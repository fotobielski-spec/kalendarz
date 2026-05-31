# Adapter: przebudowany silnik Dokumenty ID

## Architektura

```text
apps/web  →  apps/api  →  [ten adapter]  →  apps/engine (HTTP)
                              ↓
                    @dokumenty-id/shared (AnalysisResult)
```

- **Logika biometryczna** żyje w `apps/engine/src/core/` (port z desktopu).
- Ten katalog: **tylko HTTP + mapowanie** — `engine.client.ts`, `engine.mapper.ts`, `engine.adapter.ts`.

## Pliki

| Plik | Rola |
|------|------|
| `engine.client.ts` | Klient REST `/v1/jobs/*` |
| `engine.mapper.ts` | Engine JSON → `AnalysisResult` + komunikaty PL |
| `engine.adapter.ts` | Fasada używana przez route’y API |

Kontrakt HTTP: `packages/engine-contract` · plan portu: `docs/ENGINE_REBUILD.md`
