---
last_mapped_commit: 81261c5c9a931a2e3e02e8abd03709e63d8f788a
last_mapped_at: 2026-11-04
---
# Codebase Concerns

**Analysis Date:** 2026-11-04

## Tech Debt

**Giant AI Tool Definition Modules:**
- Issue: Agent tool definitions and execution handlers are consolidated into massive files (`people-tools.ts` has 3,261 lines; `hire-tools.ts` has 1,021 lines; `crm-tools.ts` has 823 lines; `finance-tools.ts` has 814 lines).
- Files: `src/lib/ai/people-tools.ts`, `src/lib/ai/hire-tools.ts`, `src/lib/ai/crm-tools.ts`, `src/lib/ai/finance-tools.ts`
- Impact: High cognitive overhead during edits, risk of merge conflicts in multi-developer workstreams, difficult unit isolation when testing specific AI tool schemas.
- Fix approach: Decompose tools into domain subfolders (e.g., `src/lib/ai/tools/people/*`) where each tool definition, parameter schema, and executor is isolated in its own file and indexed via an aggregator.

**Massive Action & UI View Files:**
- Issue: Monolithic action handlers and presentation views exceed 1,000 lines (e.g. `finance/actions.ts` at 1,408 lines, `sari-conversation.tsx` at 1,368 lines, `lead-forms-view.tsx` at 1,121 lines).
- Files: `src/app/(app)/finance/actions.ts`, `src/components/command/sari-conversation.tsx`, `src/components/reach/lead-forms-view.tsx`, `src/screens/hire/interview-dialog.tsx`
- Impact: Difficult maintenance, high re-render surface area, and higher chance of regression when tweaking specific action flows.
- Fix approach: Split `finance/actions.ts` into sub-action files (`bills-actions.ts`, `vouchers-actions.ts`, `contras-actions.ts`) matching their underlying library modules. Break large view components into smaller atomic subcomponents.

**Hardcoded Calendar Expirations:**
- Issue: The festive greeting calendar hardcodes Malaysian public holiday dates up to 2027 and includes an explicit TODO comment indicating it will fall silent in 2028.
- Files: `src/lib/greeting/festive.ts`
- Impact: Greeter functionality quietly degrades / becomes empty once 2028 arrives without an update.
- Fix approach: Shift fixed dates into configurable database tables or integrate a holiday API / annual configuration file with warning alerts prior to expiry.

## Known Bugs

**Landing Page and Table Column Drift in Migrations:**
- Issue: Recent commits (`bug-437-kasturi-check-column-guard`, `bug-434-landing-page-status-column`) addressed missing columns or column mismatch guards when schema changes run against active databases.
- Files: `src/lib/crm/public-landing-pages.ts`, `supabase/migrations/`
- Trigger: Running public landing page forms or Kasturi agent checks across disparate migration stages or partial database updates.
- Workaround: Guard checks were placed directly in code, but ongoing migration additions run the risk of desynchronization unless migrations are run strictly in linear order via `db:migrate`.

**UI Text / Chip Overflow in KPI and Metric Cards:**
- Issue: Tightly constrained card containers experienced layout clipping or overflow on narrow viewports or varying localized string lengths (addressed in commits `bug-400`, `bug-399`).
- Files: `src/components/people/kpi-tile.tsx`, `src/components/people/deductions-chip.tsx`
- Trigger: Longer currency amounts or localized names in Malaysian Ringgit (MYR) format.
- Workaround: Defensive CSS truncation and overflow wrapping.

## Security Considerations

**Service Role Escalation Boundaries:**
- Issue: `serviceClient()` bypasses Row Level Security (RLS) completely. It is used across 45+ locations including background jobs, public form submissions, cleanup routes, and chat workspace key decryptions.
- Files: `src/lib/supabase/service.ts`, `src/lib/ai/gate.ts`, `src/app/api/agents/run/route.ts`, `src/app/careers/[orgId]/[jobId]/actions.ts`, `src/lib/crm/public-landing-pages.ts`
- Current mitigation: Strictly imported with `import 'server-only'` to prevent leaking to client bundles; route handlers check secret bearer tokens or session org membership before invoking service functions.
- Recommendations: Keep RPC functions with tight `SECURITY DEFINER` constraints rather than arbitrary table modifications via serviceClient. Periodically audit all new callers of `serviceClient()`.

**Decryption and Injection of Workspace AI Provider Keys:**
- Issue: Workspaces can bring their own OpenRouter keys (`BYOK`), which are decrypted via `serviceClient()` and passed to the model provider runtime.
- Files: `src/lib/ai/gate.ts`, `src/lib/ai/workspace-key.ts`
- Current mitigation: Keys are encrypted in Postgres via `pgcrypto` vault/functions; callers must possess verified session credentials for the organization.
- Recommendations: Enforce rate limits on key read RPCs and ensure that decryption errors or provider response payloads do not log raw authorization headers.

## Performance Bottlenecks

**Sequential Schedule Runner across Workspaces:**
- Issue: Background agent schedules in `/api/agents/run` process organizations sequentially or via batch loops that execute AI prompts and database mutations.
- Files: `src/app/api/agents/run/route.ts`, `src/lib/agents/run-agent.ts`
- Cause: Synchronous wait for LLM completion across multiple agents can block or exceed serverless function timeout limits (e.g., 60-120s timeouts on standard hosting).
- Improvement path: Migrate heavy scheduled agent loops to a background queue worker pattern (e.g. pg-boss or external webhook task dispatchers) with discrete retries.

**Large Single-Bundle Route Generation:**
- Issue: Script `scripts/gen-screen-routes.mjs` runs on `predev` and `prebuild` to map every screen route statically into Next.js.
- Files: `scripts/gen-screen-routes.mjs`
- Cause: As screen inventory grows across the 5 domains (HR, CRM, Finance, Hire, Reach), route metadata compilation increases cold start build times.
- Improvement path: Ensure lazy dynamic imports for secondary/administrative screen modules.

## Fragile Areas

**Dual Client Execution Pattern (Session Client vs Service Client):**
- Files: `src/app/(app)/finance/agent-actions.ts`, `src/app/(app)/hire/agent-actions.ts`, `src/app/(app)/people/agent-actions.ts`
- Why fragile: Methods accept a composite context object `{ client, service, orgId }` where some queries use session RLS while others use the service role. Accidental substitution of `service` for `client` breaks tenant isolation.
- Safe modification: Enforce distinct type signatures or separate data-access layers so service-role operations are wrapped inside private server methods.
- Test coverage: Covered by migration tests and agent read verification suites (`tests/*-agent-service-reads-migration.test.ts`), but fragile to manual code edits.

**PostgreSQL Migration Count & Ordering:**
- Files: `supabase/migrations/` (218 migration files)
- Why fragile: With over 218 incremental migrations, spinning up clean preview environments or running local setup (`scripts/local-init.mjs`) relies heavily on cumulative script execution without intermediate consolidation.
- Safe modification: Run `npm run db:migrate` and execute migration integration tests (`tests/db-migrate.test.ts`, `tests/migration-versions.test.ts`) on every PR.
- Test coverage: High migration test coverage exists in `tests/`, but squashing or pruning old baseline migrations will eventually be required.

## Scaling Limits

**Single PostgreSQL Database Connection Pool:**
- Current capacity: Dependent on target Supabase or PostgreSQL instance tier (`pg` pool settings).
- Limit: Concurrent connections from serverless Next.js functions and agent background runs can exhaust connection slots without Supavisor/PgBouncer pooling.
- Scaling path: Require Supavisor connection pooling for server actions and background route handlers.

**Storage Bucket Quotas for Receipts and CVs:**
- Current capacity: File uploads for resumes and receipts stored in Supabase storage buckets (`DOCUMENT_BUCKET`, `RECEIPT_BUCKET`, `LOGO_BUCKET`).
- Limit: Storage quota caps and accumulating unreferenced temporary files.
- Scaling path: File cleanup crons (`/api/finance/receipt-cleanup`, `/api/hire/cv-cleanup`, `scripts/sweep-document-files.mjs`) are implemented to prune orphan files.

## Dependencies at Risk

**Next.js 16 Canary/Early Adopter Stack:**
- Risk: Next.js version `16.4.1` with React `19.2.8` and Tailwind CSS `v4`.
- Impact: React 19 breaking changes and Next.js 16 server action semantics may have upstream changes or edge case bugs with third-party libraries (e.g. Radix UI or chart libraries).
- Migration plan: Keep dependency lockfile strict; review Next.js release notes closely before upgrading minor/patch releases.

**OpenRouter AI SDK Integration:**
- Risk: Relying on `@openrouter/ai-sdk-provider` and dynamic model routing. Changes in upstream rate-limiting or schema response formatting can disrupt agent tool execution.
- Impact: Agent chat turns or structured tool call failures.
- Migration plan: Implement structured retry wrappers around LLM generation steps and fallback provider options.

## Missing Critical Features

**Self-Hosted Background Job Queue:**
- Problem: Scheduled tasks rely on HTTP triggers (`/api/agents/run`, `/api/agents/poll`) rather than an integrated resilient background worker.
- Blocks: Long-running agent reasoning and multi-step batch operations across enterprise tenant volumes.

**In-App Migration Rollback Facility:**
- Problem: Schema migrations are strictly forward-applied without automated rollback down-scripts.
- Blocks: Rapid rollback during failed production deployments; requires manual SQL remediation.

## Test Coverage Gaps

**Public Landing Page & Chatbot Edge Paths:**
- What's not tested: Complex public chatbot session expiration, multi-turn escalation, and abnormal rate-limit spikes under concurrent load.
- Files: `src/lib/crm/public-chatbot.ts`, `src/app/api/p/[pageId]/chat/route.ts`
- Risk: Public endpoints could experience denial-of-service or unexpected state corruption if bots flood unauthenticated endpoints.
- Priority: High

**Live Web Push Dispatch Edge Cases:**
- What's not tested: Push subscription revocation handling when browser endpoints return 410 Gone concurrently during broadcast runs.
- Files: `src/app/api/push/send/route.ts`, `src/lib/notifications/web-push.ts`
- Risk: Push queue could become clogged or report inflated delivery failures.
- Priority: Medium

---

*Concerns audit: 2026-11-04*
