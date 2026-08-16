# Dokumenty ID Web

Aplikacja webowa do procesu zdjęć biometrycznych: kiosk (QR) → mobile capture → analiza (zewnętrzny silnik Dokumenty ID) → generacja → płatność → dostawa.

## Monorepo

| Pakiet | Opis |
|--------|------|
| `apps/web` | Frontend klienta (Next.js, port 3000) |
| `apps/api` | REST API (Fastify, port 4000) |
| `apps/admin` | Panel admin (Next.js, port 3001) |
| `packages/shared` | Wspólne typy i schematy Zod |

Szczegóły architektury: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)  
Plan etapów 0–5: [docs/DEPLOYMENT_PLAN.md](docs/DEPLOYMENT_PLAN.md)
Migracja z bazy FOTOWAY ID: [docs/FOTOWAY_BASE_MIGRATION.md](docs/FOTOWAY_BASE_MIGRATION.md)

## Wymagania

- Node.js ≥ 20.11
- pnpm ≥ 9
- Docker & Docker Compose (Postgres, Redis, MinIO)

## Uruchomienie lokalne

```bash
# 1. Zależności
corepack enable
pnpm install

# 2. Infrastruktura
cp .env.example .env
docker compose up -d

# 3. Baza (po etapie 1 — migracje)
pnpm db:generate
pnpm db:migrate

# 4. Build pakietu shared (wymagany przez api/web)
pnpm --filter @dokumenty-id/shared build

# 5. Dev — wszystkie aplikacje równolegle
pnpm dev
```

Aplikacje:

- Web: http://localhost:3000  
- API: http://localhost:4000/api/v1/health  
- Admin: http://localhost:3001  
- MinIO console: http://localhost:9001  

### Testy

```bash
pnpm --filter @dokumenty-id/shared test
pnpm --filter @dokumenty-id/api test
pnpm --filter @dokumenty-id/api test:e2e
```

## Uruchomienie w chmurze (szkielet)

### Opcja A — Vercel + managed backend

| Komponent | Usługa |
|-----------|--------|
| `apps/web`, `apps/admin` | Vercel (region EU) |
| `apps/api` | Fly.io / Railway / AWS ECS Fargate (EU) |
| PostgreSQL | Neon / Supabase / RDS (eu-central-1) |
| Redis | Upstash / ElastiCache |
| S3 | Cloudflare R2 / AWS S3 eu-central-1 |
| Secrets | Vercel Env + platform secrets |

```bash
# Przykład: build w CI
pnpm install --frozen-lockfile
pnpm build
# Deploy web/admin: vercel --prod
# Deploy api: fly deploy / railway up
```

### Opcja B — jeden klaster (Kubernetes)

- Helm chart (osobny repo lub `infra/` w przyszłości)
- Ingress: `app.`, `api.`, `admin.` subdomeny
- External Secrets Operator → AWS Secrets Manager / GCP Secret Manager

Zmienne środowiskowe: skopiuj z `.env.example` do secret store — **nigdy nie commituj `.env`**.

## Status projektu

**ETAP 3** — mobile-first bez QR + generowanie 2 assetów (electronic + imposition 1x8), tokenizowany podgląd i secure download (bieżący).  
Następny krok: **ETAP 4 — koszyk, płatność i dostarczenie e-mail**.

## Licencja

Proprietary — Dokumenty ID Web.
