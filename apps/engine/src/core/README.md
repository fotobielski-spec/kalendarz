# Core — logika przeniesiona z programu Dokumenty ID (desktop)

## Status

| Moduł | Status |
|-------|--------|
| `analysis/rules/*` (legacy) | Do portu z backupu |
| `analysis/rules/hair-on-face` | TODO — mock zwraca `passed: true` |
| `analysis/rules/hair-on-eyebrows` | TODO — mock zwraca `passed: true` |
| `generate/electronic` | Do portu z backupu |
| `generate/imposition-1x8-10x15` | Do portu z backupu |

## Integracja legacy (E2)

Wybór zależy od stacku starego programu:

- **.NET** — sidecar ASP.NET Core wołany lokalnie lub osobny kontener
- **Delphi / native** — proces potomny + JSON na stdin/stdout
- **Python** — subprocess lub przepisanie modułów do `core/`

`ENGINE_MODE=legacy` włącza most (implementacja po dostarczeniu backupu).
