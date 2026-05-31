# Dokumenty ID Web — architektura MVP

## Kontekst

Istniejący system **Dokumenty ID** (analiza, generacja elektroniczna, impozycja 1×8 na 10×15) jest **stabilnym komponentem zewnętrznym**. Integracja wyłącznie przez adapter HTTP w `apps/api/src/adapters/dokumenty-id/` — bez przepisywania logiki.

## Stack technologiczny MVP

| Warstwa | Technologia | Uzasadnienie |
|--------|-------------|--------------|
| **Frontend (kiosk + mobile)** | Next.js 15 (App Router), React 19, CSS modules / vanilla CSS | SSR/ISR dla landingu, routing `/m/[token]` pod mobile, jeden stack TS z adminem |
| **Panel admin** | Next.js 15 (osobna app `apps/admin`) | Izolacja powierzchni ataku, osobne domeny/cookies, współdzielone typy z `packages/shared` |
| **Backend** | Node.js 20 + **Fastify** + REST `/api/v1` | Lekki, szybki, dobra obsługa multipart (upload), niski narzut vs Nest — wystarczający na MVP |
| **ORM / DB** | **PostgreSQL 16** + **Prisma** | Relacje Order/Payment/Audit, migracje, typy TS; standard produkcyjny |
| **Storage** | **S3-compatible** (MinIO lokalnie, R2/S3 w prod, region **EU**) | Obrazy biometryczne poza DB; signed URLs; lifecycle/retencja |
| **Kolejka** | **BullMQ** + **Redis** | Analiza, generacja, e-mail — asynchronicznie, retry, idempotencja (etap 3–4) |
| **E-mail** | **Resend** (lub AWS SES) | Transakcyjne maile, webhook delivery status; prosta integracja |
| **Płatności** | **Stripe** (PLN, BLIK/karty) | Webhooks, idempotency keys, dojrzały ekosystem |
| **Auth — klient** | Token sesji powiązany z QR (bez kont użytkownika) | UX na stanowisku; krótki TTL; brak haseł |
| **Auth — admin** | JWT + refresh + **RBAC** w DB (etap 5) | Role: viewer, operator, superadmin; audit kto/co/kiedy |
| **Monitoring** | **Pino** (structured logs) + **Sentry** + **OpenTelemetry** → Grafana/Datadog | Błędy, latency API/kolejek; **redakcja** danych biometrycznych w logach |
| **IaC / deploy** | Docker Compose (dev), **Terraform** lub Pulumi (prod) | Powtarzalne środowiska; staging → prod |

### Bezpieczeństwo danych biometrycznych

- Pliki tylko w S3; dostęp przez **signed URLs** z krótkim TTL + watermark na miniaturach.
- **Retencja**: job cron usuwa surowe pliki po X dniach po dostarczeniu (konfigurowalne).
- **Audit log**: każda zmiana statusu, dostęp admina do pliku, webhook płatności.
- **RODO**: hosting UE, DPA z dostawcami, polityka usuwania na żądanie (etap 7).
- **Zero sekretów w repo** — `.env` lokalnie, secrets manager w chmurze.

## Struktura monorepo

```
dokumenty-id-web/
├── apps/
│   ├── web/          # Landing, QR, mobile capture, checkout UI
│   ├── api/          # REST API, adapter silnika, workers
│   └── admin/        # Panel administracyjny
├── packages/
│   └── shared/       # Zod schemas, typy, kody błędów PL
├── docs/
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT_PLAN.md
├── docker-compose.yml
└── turbo.json + pnpm workspaces
```

## Przepływ danych (docelowy)

```mermaid
sequenceDiagram
  participant Kiosk as apps/web
  participant API as apps/api
  participant S3 as S3 storage
  participant Engine as Dokumenty ID Engine
  participant Queue as BullMQ
  participant Stripe as Stripe

  Kiosk->>API: POST /sessions (QR)
  Kiosk->>API: POST /sessions/:id/upload
  API->>S3: raw image
  API->>Engine: startAnalysis (adapter)
  Engine-->>API: AnalysisResult
  alt compliance 100%
    API->>Queue: generate assets
    Queue->>Engine: electronic + 1x8
    Queue->>S3: outputs
  end
  Kiosk->>API: checkout
  API->>Stripe: PaymentIntent
  Stripe-->>API: webhook paid
  API->>Queue: send email (signed links)
```

## Granice modułów

| Moduł | Odpowiedzialność |
|-------|------------------|
| `apps/web` | UX capture, maska, wyniki analizy, podgląd, koszyk |
| `apps/api` | Sesje, upload, adapter, kolejki, płatności, e-mail |
| `apps/admin` | Zamówienia, pliki (ograniczony dostęp), KPI, RBAC |
| `packages/shared` | Kontrakty API, enums, mapy błędów PL |
| Adapter `dokumenty-id` | Tłumaczenie API silnika → `AnalysisResult` |
