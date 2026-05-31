# Dokumenty ID Web

**Niezależny sklep internetowy** do zdjęć biometrycznych: przeglądarka → capture → analiza i generacja (własny moduł `packages/processing`) → płatność Stripe → dostawa e-mail / wysyłka wydruku.

Model produktu: [docs/PRODUCT_MODEL.md](docs/PRODUCT_MODEL.md)  
Niezależna aplikacja (bez integracji z innymi programami): [docs/STANDALONE.md](docs/STANDALONE.md)

## Monorepo

| Pakiet | Opis |
|--------|------|
| `apps/web` | Sklep www — frontend klienta (Next.js, port 3000) |
| `apps/api` | REST API sklepu (Fastify, port 4000) |
| `apps/admin` | Panel admin (Next.js, port 3001) |
| `packages/shared` | Typy sklepu (Zod) |
| `packages/processing` | Analiza + generacja zdjęć (wewnętrzna logika) |

Szczegóły architektury: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)  
Plan etapów 0–5: [docs/DEPLOYMENT_PLAN.md](docs/DEPLOYMENT_PLAN.md)

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
pnpm --filter @dokumenty-id/processing build
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

**ETAP 0** — plan + struktura monorepo (bieżący).  
Następny krok po akceptacji: **ETAP 1 — MVP Capture**.

## Licencja

Proprietary — Dokumenty ID Web.
