# Plan wdrożenia — Etapy 0–5 (+ 7 hardening)

## ETAP 0 — Fundament (ten PR)

**Zakres:** Monorepo, stack, schemat Prisma (szkielet), kontrakty shared, placeholder API/UI, Docker Compose, dokumentacja.

### Definition of Done

- [x] Struktura `apps/web`, `apps/api`, `apps/admin`, `packages/shared`
- [x] TypeScript end-to-end, pnpm + Turbo
- [x] `docker-compose` — Postgres, Redis, MinIO
- [x] API: `GET /health`, placeholder `POST /sessions`
- [x] Test jednostkowy + 1 test e2e API
- [x] `.env.example` bez sekretów
- [x] Dokumentacja ARCHITECTURE + DEPLOYMENT_PLAN

---

## ETAP 1 — MVP Capture (web, bez kiosku)

**Zakres:** Landing sklepu online + CTA, sesja wizyty, capture w przeglądarce (upload / aparat selfie), opcjonalny QR desktop→telefon, upload do S3, metadane w DB, status sesji, błędy.

### Definition of Done

- [ ] `POST /sessions` zapisuje `CaptureSession` w Postgres
- [ ] Na mobile: bezpośredni capture na `/capture` lub `/m/[token]`
- [ ] Na desktop: upload lub opcjonalny QR z `mobileUrl` (nie jest to flow kioskowy)
- [ ] `/m/[qrToken]` — wybór upload vs `getUserMedia` (front camera)
- [ ] `POST /sessions/:id/upload` → S3 + `CaptureUpload`
- [ ] Polling / SSE statusu sesji
- [ ] Testy jednostkowe serwisów + e2e: create → upload → status `uploaded`
- [ ] README z instrukcją uruchomienia

---

## ETAP 2 — Integracja silnika (apps/engine)

**Zakres:** Podłączenie API sklepu do `apps/engine` (mock lub pierwszy port legacy), polling analizy, UI wyników, `hair_on_face` / `hair_on_eyebrows`. Równolegle: port modułów do `apps/engine/src/core/` (E2 w ENGINE_REBUILD.md).

### Definition of Done

- [x] `engine-contract` + klient adaptera w API (szkielet)
- [ ] Route’y API: `POST /sessions/:id/analyze`, polling statusu
- [ ] Testy integracyjne API ↔ engine (docker compose)
- [ ] Model `AnalysisRun` + statusy w DB
- [ ] Mapa kodów błędów → komunikaty PL (UI)
- [ ] Logi techniczne bez base64/twarzy (tylko sessionId, jobId)
- [ ] TODO w adapterze jeśli silnik nie zwraca nowych reguł — kontrakt gotowy

---

## ETAP 3 — Generowanie i podgląd

**Zakres:** Po 100% — elektroniczna + impozycja 1×8; `GeneratedAsset`; miniatura watermark + signed URL; ekran podsumowania.

### Definition of Done

- [ ] BullMQ job `generate-assets` z idempotencją
- [ ] Adapter wywołuje silnik (nie duplikuje logiki)
- [ ] `GET /sessions/:id/preview` — signed URL TTL ≤ 15 min
- [ ] E2E test: upload → analyze mock 100% → preview ready

---

## ETAP 4 — Zamówienie i finalizacja (e-commerce online)

**Zakres:** Koszyk (`digital_email` / `digital_email_print_shipped`), płatność Stripe wyłącznie online, webhook, e-mail z plikami po opłaceniu, adres dostawy przy wysyłce wydruku, porzucone koszyki, audit trail.

### Definition of Done

- [ ] Modele `Order`, `Payment`, `EmailDispatch`
- [ ] Stripe webhook z weryfikacją sygnatury + idempotency
- [ ] Testy: duplikat webhooka, opóźniona płatność
- [ ] Job `abandoned-cart` (np. 24h bez płatności)
- [ ] Strona „dziękujemy” + status zamówienia

---

## ETAP 5 — Panel admin v1

**Zakres:** Listy zamówień, filtry, szczegóły (transakcja, analiza, pliki, zdarzenia), akcje admina, RBAC, KPI.

### Definition of Done

- [ ] RBAC: role w DB, middleware admin API
- [ ] Audit log: kto zmienił status / wysłał e-mail / otworzył plik
- [ ] Pliki admina tylko przez signed URL z audytem
- [ ] Dashboard: konwersja, porzucone, first-pass (szkielet metryk)

---

## ETAP 7 — Hardening & go-live (osobna wiadomość scenariusza)

**Zakres:** RODO/retencja, rate limiting, monitoring, backup, staging→prod, rollback, rejestr ryzyk.

### Definition of Done

- [ ] Checklist go-live podpisana
- [ ] Polityka retencji zautomatyzowana
- [ ] Alerty na SLO (API p95, kolejka, e-mail, płatności)
- [ ] Runbook rollback

---

## Zależności między etapami

```
0 → 1 → 2 → 3 → 4
              ↘ 5 (równolegle po 4 częściowo)
7 po 5
```
