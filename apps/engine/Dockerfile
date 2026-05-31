FROM node:20-alpine
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/engine-contract ./packages/engine-contract
COPY apps/engine ./apps/engine

RUN pnpm install --filter @dokumenty-id/engine...
RUN pnpm --filter @dokumenty-id/engine-contract build && pnpm --filter @dokumenty-id/engine build

WORKDIR /app/apps/engine
ENV NODE_ENV=production
EXPOSE 4100
CMD ["node", "dist/index.js"]
