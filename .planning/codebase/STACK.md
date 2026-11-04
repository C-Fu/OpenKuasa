---
last_mapped_commit: 81261c5c9a931a2e3e02e8abd03709e63d8f788a
last_mapped_at: 2026-11-04
---
# Technology Stack

**Analysis Date:** 2026-11-04

## Languages

**Primary:**
- TypeScript 5.x (`^5`) - Full codebase, Next.js application, server actions, route handlers, utility libraries (`src/**/*.ts`, `src/**/*.tsx`, `next.config.ts`)
- SQL (PostgreSQL dialect) - Database migrations, RLS policies, triggers, and functions (`supabase/migrations/*.sql`, `docker/supabase/db/*.sql`)

**Secondary:**
- JavaScript (Node.js ESM / .mjs) - Build scripts and tooling (`scripts/gen-screen-routes.mjs`, `scripts/smoke-routes.mjs`, `scripts/db-migrate.mjs`, `scripts/docs-shots.mjs`, `eslint.config.mjs`, `postcss.config.mjs`)
- Bash / Shell - Docker container entrypoints and secret handling (`docker/Dockerfile`, `docker/app-entrypoint.sh`, `docker/with-secrets.sh`, `docker/supabase/api/kong-entrypoint.sh`)
- HTML - Email notification templates (`supabase/email-templates/*.html`)

## Runtime

**Environment:**
- Node.js `>=22` (specified in `package.json` engines)
- Docker / Linux multi-platform container runtime (`linux/amd64`, `linux/arm64`)

**Package Manager:**
- `pnpm` 11.10.0 (specified in `package.json` packageManager)
- Lockfile: `pnpm-lock.yaml` present

## Frameworks

**Core:**
- Next.js 16.4.1 (App Router, Server Actions, Standalone output support) - Full-stack React web application (`next.config.ts`, `src/app/`)
- React 19.2.8 & React DOM 19.2.8 - Component rendering engine
- Tailwind CSS 4.x (`@tailwindcss/postcss` 4.x) - Utility-first styling framework (`src/app/globals.css`, `postcss.config.mjs`)
- Radix UI (`radix-ui` `^1.7.0`) - Headless accessible UI primitives (`next.config.ts`, `src/components/ui/`)

**Testing:**
- Vitest 5.0.3 (`vitest`) - Unit and integration test runner (`vitest.config.mts`, `vitest.evals.config.mts`, `tests/`)

**Build/Dev:**
- TypeScript 5.x (`typescript`) - Type checking and compilation (`tsconfig.json`)
- ESLint 9.x (`eslint`, `eslint-config-next` 16.4.1) - Linting (`eslint.config.mjs`)
- PostCSS (`@tailwindcss/postcss`) - CSS processing
- Docker Buildx - Multi-arch container image builder (`.github/workflows/image.yml`, `docker/Dockerfile`)

## Key Dependencies

**Critical:**
- `@supabase/ssr` `^0.12.7` & `@supabase/supabase-js` `^2.117.2` - Supabase client, multi-tenant session management, server/browser cookies (`src/lib/supabase/`)
- `ai` `^7.0.133` & `@ai-sdk/react` `^4.0.136` - Vercel AI SDK for unified LLM streaming, tools, and UI integration (`src/lib/ai/`, `src/app/api/chat/`)
- `@openrouter/ai-sdk-provider` `^3.1.0` - Model provider for OpenRouter API routing (`src/lib/ai/provider.ts`)
- `@modelcontextprotocol/sdk` `1.32.1` - MCP (Model Context Protocol) server implementation (`src/app/api/mcp/route.ts`, `src/lib/mcp/`)
- `zod` `^4.6.5` - Schema validation for forms, API inputs, and MCP payloads
- `pg` `8.23.1` - PostgreSQL direct client for database migration scripts (`scripts/db-migrate.mjs`)

**Infrastructure:**
- `web-push` `^3.6.7` & `@types/web-push` `^3.6.4` - Web Push API payload delivery using VAPID keys (`src/lib/push/client.ts`, `src/lib/push/config.ts`)
- `recharts` `^3.10.1` - Data visualization and analytics charts (`src/components/analytics/`)
- `animejs` `^4.5.0` & `tw-animate-css` `^1.4.0` & `class-variance-authority` `^0.7.1` - UI animations and variant styling
- `lucide-react` `^1.52.0` & `@animateicons/react` `^0.12.0` - Icon systems
- `unified` `^11.0.5`, `remark-parse` `^11.0.0`, `remark-gfm` `^4.0.1`, `react-markdown` `^10.1.0`, `mdast-util-to-string` `^4.0.0` - Markdown documentation parser and viewer (`content/docs/`)
- `read-excel-file` `^9.3.12` - Spreadsheet parsing for batch uploads (`src/lib/crm/`, `src/components/finance/`)
- `heic-to` `1.6.6` - Client-side image conversion for uploaded receipts (`src/components/finance/receipt-upload.ts`)
- `dotenv` `^18.0.6` - Environment loading in CLI scripts

## Configuration

**Environment:**
- Managed via `.env` (Docker local setup), `.env.local` (local development), and `.env.example` template
- Key runtime configurations:
  - Database & Backend: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `JWT_SECRET`, `POSTGRES_PASSWORD`
  - AI Configuration: `OPENROUTER_API_KEY`, `OPENKUASA_MODEL_ORCHESTRATOR`, `OPENKUASA_MODEL_WORKER`, `OPENKUASA_MODEL_RECEIPTS`, `AI_GATEWAY_BASE_URL`
  - Security Secrets: `AUTH_COOKIE_SECRET`, `AI_KEYS_ENCRYPTION_SECRET`, `RATE_LIMIT_PEPPER`, `CRON_SECRET`
  - Push Notifications: `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`
  - Feature Flags: `NEXT_PUBLIC_DEMO_ENABLED`, `MCP_SIGN_IN_ENABLED`, `CRON_ALLOW_LEGACY_KEY`

**Build:**
- `next.config.ts` - Standalone output mode option (`NEXT_OUTPUT=standalone`), security headers, package optimization (`radix-ui`, `zod`, `ai`, `@ai-sdk/react`), static routing redirects
- `tsconfig.json` - Strict TypeScript compiler settings targeting ES2017 with module bundler resolution and `@/*` path mapping to `./src/*`
- `postcss.config.mjs` - PostCSS runner configured with `@tailwindcss/postcss`
- `eslint.config.mjs` - ESLint 9 flat config extending `eslint-config-next`

## Platform Requirements

**Development:**
- Node.js 22+ with `pnpm` 11+
- Local Supabase instance via Docker Compose (`docker-compose.yml`) or access to hosted Supabase project

**Production:**
- Standalone Node.js Docker container deployment (`ghcr.io/openkuasa/openkuasa:latest`) or PaaS hosting (e.g. Railway, self-hosted Docker Compose)
- PostgreSQL with extensions `pg_net` and Supabase auth/storage services

---

*Stack analysis: 2026-11-04*
