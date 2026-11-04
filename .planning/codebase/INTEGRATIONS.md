---
last_mapped_commit: 81261c5c9a931a2e3e02e8abd03709e63d8f788a
last_mapped_at: 2026-11-04
---
# External Integrations

**Analysis Date:** 2026-11-04

## APIs & External Services

**AI & LLM Services:**
- OpenRouter - Multi-model AI completion and generation proxy
  - SDK/Client: `@openrouter/ai-sdk-provider`, `ai`
  - Auth: `OPENROUTER_API_KEY` (or per-organization bring-your-own-key via `src/lib/ai/key-crypto.ts`)
  - Endpoints: `https://openrouter.ai/api/v1` (or custom gateway via `AI_GATEWAY_BASE_URL`), `/videos` endpoint for media generation (`src/lib/agents/openrouter-media.ts`)
- Anthropic / Direct Models (Optional)
  - Auth: `ANTHROPIC_API_KEY` or workspace BYOK
- Cloudflare AI Gateway (Optional)
  - Intermediary proxy: Configurable through `AI_GATEWAY_BASE_URL`

**Email Delivery:**
- Resend - Transactional and broadcast email provider
  - Client: Native `fetch` wrapper in `src/lib/crm/email-provider.ts`
  - Auth: Per-organization encrypted API key stored in database (`src/lib/crm/email-key.ts`), checked via `https://api.resend.com/domains`
  - Endpoints: `https://api.resend.com/emails/batch`

**Financial & Market Data:**
- Bank Negara Malaysia (BNM) - Central bank foreign exchange rates
  - Client: Native `fetch` client in `src/lib/finance/bnm-client.ts`
  - Auth: None (public government API)
  - Endpoints: `https://api.bnm.gov.my/public/exchange-rate` (`src/lib/finance/fx-bnm.ts`)

**Weather Services:**
- Open-Meteo - Geocoding and weather forecasts for user greetings
  - Client: Native `fetch` client in `src/lib/greeting/weather-source.ts`
  - Auth: None (free/open weather API)
  - Endpoints: `https://api.open-meteo.com/v1/forecast`, `https://geocoding-api.open-meteo.com/v1/search`

**Push Notifications:**
- Web Push Service (Browser Vendors: Google FCM, Apple Push Notification Service, Mozilla Autopush)
  - SDK/Client: `web-push`
  - Auth: VAPID protocol with ECDSA keys (`NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`) (`src/lib/push/config.ts`)

**Model Context Protocol (MCP):**
- MCP Protocol Endpoints for external AI agents (e.g. Claude Desktop, Cursor)
  - SDK/Client: `@modelcontextprotocol/sdk`
  - Integration: Route handler at `src/app/api/mcp/route.ts` with API key and OAuth token authentication (`src/lib/mcp/`)

## Data Storage

**Databases:**
- PostgreSQL (Supabase managed or self-hosted container)
  - Connection: `DATABASE_URL` (direct pgpool/session pooler) and HTTP REST / GraphQL APIs
  - Client: `@supabase/supabase-js`, `@supabase/ssr`, and `pg` for database migrations (`scripts/db-migrate.mjs`)
  - Schemas: Public tenancy tables (`orgs`, `memberships`), auth (`auth.users`), private schemas, RLS security policies

**File Storage:**
- Supabase Storage - Cloud bucket file storage for user avatars, document attachments, and candidate CVs
  - Client: `@supabase/supabase-js` storage API (`supabase.storage.from(...)`)
  - Buckets: `avatars`, `chat-attachments`, `resumes` / CV uploads

**Caching:**
- In-memory Node.js process caching (LRU/TTL maps for weather data in `src/lib/greeting/weather-source.ts`)
- Client-side Next.js App Router cache configured via `staleTimes` (`dynamic: 30`, `static: 180`) in `next.config.ts`

## Authentication & Identity

**Auth Provider:**
- Supabase Auth (GoTrue)
  - Implementation: Cookie-based SSR session management (`@supabase/ssr`) with custom persistent session handling (`src/lib/supabase/remember.ts`)
  - Factors: Email passwordless magic links, passwords, Multi-Factor Authentication (TOTP / recovery codes in `supabase/migrations/*_mfa_recovery_codes.sql`)
  - Anonymous Guest Auth: Enabled for demo mode via `NEXT_PUBLIC_DEMO_ENABLED` (`src/lib/supabase/anonymous.ts`)
  - MCP Auth: Bearer token verification using hashed API keys and Supabase OAuth bindings (`src/lib/mcp/keys.ts`)

## Monitoring & Observability

**Error Tracking:**
- None detected (in-app error boundary handlers and safe error classification via `src/lib/greeting/weather-source.ts` and Next.js error pages)

**Logs:**
- Console-based structured output (`console.error`, `console.log`) with security filtering
- Server functions argument logging disabled in `next.config.ts` (`logging: { serverFunctions: false }`) to avoid leaking PII

## CI/CD & Deployment

**Hosting:**
- Containerized Docker on Linux platforms (`linux/amd64`, `linux/arm64`), deployable to any Docker host, VPS, or PaaS (Railway / self-hosted compose)
- Multi-container architecture via `docker-compose.yml` (App, PostgreSQL, Kong Gateway, GoTrue Auth, PostgREST, Supabase Storage, and Init container)

**CI Pipeline:**
- GitHub Actions (`.github/workflows/image.yml`)
  - Multi-platform container build using Docker Buildx on `ubuntu-latest` and `ubuntu-24.04-arm`
  - Automated publishing to GitHub Packages (`ghcr.io/openkuasa/openkuasa:latest`)

## Environment Configuration

**Required env vars:**
- Database & Backend: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Cryptographic Secrets: `AUTH_COOKIE_SECRET`, `AI_KEYS_ENCRYPTION_SECRET`, `RATE_LIMIT_PEPPER`, `CRON_SECRET`
- AI Model Service: `OPENROUTER_API_KEY` (required unless workspace brings their own key)

**Secrets location:**
- Stored in server environment or `.env.local` (local development), or injected by the Docker entrypoint secrets manager (`docker/with-secrets.sh`)
- User/Workspace API keys (Resend, OpenRouter) are encrypted with AES-256-GCM via `AI_KEYS_ENCRYPTION_SECRET` before persisting to database

## Webhooks & Callbacks

**Incoming:**
- Scheduled Triggers / Cron endpoints: `src/app/api/agents/poll/route.ts`, `src/app/api/agents/run/route.ts`, `src/app/api/maintenance/sweep-files/route.ts` authenticated via `CRON_SECRET` bearer header

**Outgoing:**
- PostgreSQL `pg_net` database hooks: Triggers configured to dispatch HTTP requests on database table mutation events (`docker/supabase/db/webhooks.sql`)
- Resend transactional dispatch: Batch email triggers (`src/lib/crm/email-provider.ts`)
- Web Push Service Dispatch: VAPID signed HTTP POST requests to browser push service endpoints (`src/lib/push/client.ts`)

---

*Integration audit: 2026-11-04*
