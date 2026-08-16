# FOTOWAY ID jako baza nowej aplikacji

Ten dokument definiuje, jak nowy projekt webowy korzysta z istniejącego systemu `FOTOWAY ID`
bez przepisywania sprawdzonej logiki analizy i impozycji.

## Co już przejęliśmy jako bazę

- Silnik legacy wskazany jako źródło prawdy (`FOTOWAY_LEGACY_BASE_URL`).
- Adapter HTTP w `apps/api/src/adapters/dokumenty-id/fotoway-client.ts`.
- Maska selfie zaczerpnięta z reguł biometrycznych FOTOWAY:
  `apps/web/src/components/BiometricGuideMask.tsx`.

## Mapowanie modułów FOTOWAY -> nowa aplikacja

| FOTOWAY ID (legacy) | Nowa aplikacja |
|---|---|
| `backend/app/services/photo_analysis_service.py` | `apps/api` adapter + etap 2 (analiza online) |
| `backend/app/services/imposition_service.py` | etap 3 (generacja 1x8 10x15) |
| `backend/app/constants/analysis_messages.py` | `packages/shared` (mapa komunikatow PL) |
| `frontend/src/components/BiometricOverlay.tsx` | `apps/web/src/components/BiometricGuideMask.tsx` |

## Docelowy przeplyw hybrydowy

1. `apps/web` tworzy sesje QR i zbiera zdjecie klienta.
2. `apps/api` przyjmuje upload i deleguje analize do `FOTOWAY ID` przez adapter.
3. Po pozytywnej analizie `apps/api` zleca generacje impozycji i wersji elektronicznej.
4. Nowy frontend/panel admin obsluguje platnosc, e-mail i workflow zamowien online.

## Zasady migracji

- Nie ruszamy kodu legacy, dopoki nowa warstwa nie odtwarza 1:1 kluczowych wynikow.
- Każde przejecie funkcji z FOTOWAY ma test porownawczy wyjscia.
- Integracje biznesowe (platnosci, porzucone koszyki, zamowienia) sa budowane tylko w nowej warstwie.
