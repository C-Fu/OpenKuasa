---
last_mapped_commit: 81261c5c9a931a2e3e02e8abd03709e63d8f788a
last_mapped_at: 2026-11-04
---
<Codebase Structure>
**Analysis Date:** 2026-11-04

## Directory Layout

```
openkuasa/
├── .planning/                  # Project roadmap, state tracking, and codebase documentation
│   ├── codebase/               # System architecture, structure, stack, and convention specs
│   └── phases/                 # Completed and active engineering phases
├── content/                    # Documentation content and user guides
│   └── docs/                   # Markdown guides categorized by product (bendahara, kasturi, etc.)
├── evals/                      # AI evaluation suites and benchmark test cases
├── public/                     # Static public assets (icons, landing imagery, PWA manifests, sw.js)
├── scripts/                    # Automation and build utilities (route generator, db migrations, shots)
├── src/                        # Core application source code
│   ├── app/                    # Next.js App Router (pages, layouts, routes, API endpoints)
│   │   ├── (app)/              # Authenticated product application shell and generated screens
│   │   │   ├── [product]/      # Dynamic product fallback handlers
│   │   │   ├── crm/            # Generated CRM (Kasturi) screens
│   │   │   ├── finance/        # Generated Finance (Bendahara) screens
│   │   │   ├── hire/           # Generated Hire (Lekir) screens
│   │   │   ├── people/         # Generated People (Lekiu) screens
│   │   │   ├── reach/          # Generated Reach (Jebat) screens
│   │   │   └── command/        # Command (Tuah) screen
│   │   ├── (auth)/             # Authentication flows (login, onboarding, password reset)
│   │   ├── account/            # Workspace and user account settings screens
│   │   ├── api/                # Backend API endpoints (chat, agents, mcp, finance, hr, etc.)
│   │   ├── docs/               # Interactive documentation and user manual routes
│   │   ├── f/                  # Public lead form routes
│   │   ├── p/                  # Public marketing and landing page renderer routes
│   │   └── u/                  # Unsubscribe / public link endpoints
│   ├── components/             # Reusable React UI components
│   │   ├── ui/                 # Shadcn/Radix-based design primitives (buttons, dialogs, inputs)
│   │   ├── app/                # App shell, navigation sidebar, viewer context
│   │   ├── brand/              # OpenKuasa brand assets, logos, and identity components
│   │   ├── chat/               # Conversational AI interface components
│   │   ├── crm/                # CRM-specific UI cards, boards, and dialogs
│   │   ├── finance/            # Finance vouchers, invoice tables, and charts
│   │   ├── hire/               # Candidate pipeline and interview UI elements
│   │   ├── marketing/          # Public landing page components
│   │   ├── people/             # HR employee cards, timesheets, and rosters
│   │   └── reach/              # Ad studio and campaign builder components
│   ├── config/                 # Static application configuration and navigation maps
│   ├── lib/                    # Shared core business logic, clients, and services
│   │   ├── agents/             # Autonomous agent framework (runner, definitions, proposals)
│   │   ├── ai/                 # OpenRouter LLM tools, chat requests, and permission gates
│   │   ├── auth/               # Viewer resolution, roles, permissions, session management
│   │   ├── crm/                # Kasturi domain services and data queries
│   │   ├── finance/            # Bendahara ledger, invoices, SST calculations, FX rates
│   │   ├── hire/               # Lekir talent sourcing, candidate, and interview logic
│   │   ├── mcp/                # Model Context Protocol server, tools, and token dispatch
│   │   ├── people/             # Lekiu HR, payroll formulas, attendance, and shift logic
│   │   ├── reach/              # Jebat marketing campaign and creative bank logic
│   │   ├── security/           # CSP, security headers, cryptographic nonces, rate limits
│   │   └── supabase/           # Supabase SSR clients, middleware helpers, and service tokens
│   ├── proxy.ts                # Next.js custom edge proxy (nonce injection, CSP, session refresh)
│   └── screens/                # Concrete screen views mapped by screen registry
│       ├── crm/                # Kasturi screen views
│       ├── finance/            # Bendahara screen views
│       ├── hire/               # Lekir screen views
│       ├── people/             # Lekiu screen views
│       ├── reach/              # Jebat screen views
│       └── registry.ts         # Central catalog mapping URL slugs to screen implementations
├── supabase/                   # Supabase local environment and migration files
│   └── migrations/             # Sequential SQL migration files
├── tests/                      # Automated unit, integration, and RLS tests
├── next.config.ts              # Next.js 16 build configuration, headers, and optimization rules
├── package.json                # Project dependencies, scripts, and package manager details
└── vitest.config.mts           # Vitest configuration for unit and integration suites
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js 16 App Router tree defining application routes, server actions, and HTTP API handlers.
- Contains: Layouts (`layout.tsx`), route handlers (`page.tsx`), API endpoints (`route.ts`), route groups `(app)` and `(auth)`.
- Key files: [`src/app/layout.tsx`](file:///root/OpenKuasa/src/app/layout.tsx), [`src/app/(app)/layout.tsx`](file:///root/OpenKuasa/src/app/(app)/layout.tsx), [`src/app/api/chat/route.ts`](file:///root/OpenKuasa/src/app/api/chat/route.ts), [`src/app/api/mcp/route.ts`](file:///root/OpenKuasa/src/app/api/mcp/route.ts).

**`src/screens/`:**
- Purpose: Presentation layer for all core product features, decoupled from routing.
- Contains: Full-page screen components, sub-views, and forms for each business domain.
- Key files: [`src/screens/registry.ts`](file:///root/OpenKuasa/src/screens/registry.ts), [`src/screens/finance/invoices.tsx`](file:///root/OpenKuasa/src/screens/finance/invoices.tsx), [`src/screens/crm/deals.tsx`](file:///root/OpenKuasa/src/screens/crm/deals.tsx).

**`src/lib/`:**
- Purpose: Application backend logic, domain calculations, database clients, security utilities, and AI orchestration.
- Contains: Pure business logic functions, database queries, LLM tool definitions, authentication helpers.
- Key files: [`src/lib/auth/viewer.ts`](file:///root/OpenKuasa/src/lib/auth/viewer.ts), [`src/lib/supabase/server.ts`](file:///root/OpenKuasa/src/lib/supabase/server.ts), [`src/lib/agents/runner.ts`](file:///root/OpenKuasa/src/lib/agents/runner.ts), [`src/lib/mcp/server.ts`](file:///root/OpenKuasa/src/lib/mcp/server.ts).

**`src/components/`:**
- Purpose: UI building blocks, shared layouts, navigation elements, and reusable design components.
- Contains: Primitive components (`components/ui`), app shell frames, chart visualizers, and domain-specific UI cards.
- Key files: [`src/components/app/app-shell.tsx`](file:///root/OpenKuasa/src/components/app/app-shell.tsx), [`src/components/app/sidebar.tsx`](file:///root/OpenKuasa/src/components/app/sidebar.tsx).

**`src/config/`:**
- Purpose: Static application metadata, navigation items, permission matrices, and regional configurations.
- Contains: TypeScript configuration maps.
- Key files: [`src/config/nav.ts`](file:///root/OpenKuasa/src/config/nav.ts), [`src/config/account-nav.ts`](file:///root/OpenKuasa/src/config/account-nav.ts), [`src/config/countries.ts`](file:///root/OpenKuasa/src/config/countries.ts).

**`scripts/`:**
- Purpose: Build automation, development tooling, screen route generation, database seeding, and screenshot capture.
- Contains: Node.js automation scripts (`.mjs`).
- Key files: [`scripts/gen-screen-routes.mjs`](file:///root/OpenKuasa/scripts/gen-screen-routes.mjs), [`scripts/db-migrate.mjs`](file:///root/OpenKuasa/scripts/db-migrate.mjs), [`scripts/smoke-routes.mjs`](file:///root/OpenKuasa/scripts/smoke-routes.mjs).

**`supabase/migrations/`:**
- Purpose: Versioned SQL migrations governing database tables, views, functions, triggers, and Row-Level Security policies.
- Contains: Timestamped SQL files.
- Key files: Sequential migration files defining tables for profiles, finance, crm, hire, and hr.

## Key File Locations

**Entry Points:**
- `src/proxy.ts`: Edge security proxy, CSP nonce provider, session cookie refresh, and MCP bearer bypass.
- `src/app/layout.tsx`: Root HTML layout, font declarations, theme provider, and global service worker registrations.
- `src/app/(app)/layout.tsx`: Authenticated app frame, tenancy validation, and navigation badge aggregation.
- `src/app/api/mcp/route.ts`: Model Context Protocol server entry point.
- `src/app/api/chat/route.ts`: Tuah copilot streaming AI chat endpoint.

**Configuration:**
- `next.config.ts`: Next.js compiler settings, security headers, asset caching rules, and standalone build toggles.
- `src/config/nav.ts`: Application navigation structure, icons, roles, and product grouping definitions.
- `src/screens/registry.ts`: Single source of truth linking URL screen keys to screen view components.

**Core Logic:**
- `src/lib/auth/viewer.ts`: Current user, active workspace identity, and session authentication parser.
- `src/lib/agents/runner.ts`: Autonomous agent cycle executor, schedule parsing, and audit persistence.
- `src/lib/finance/`: Bendahara financial calculations, SST tax logic, and ledger operations.
- `src/lib/people/`: Lekiu payroll calculations, leave accruals, and shift scheduling.
- `src/lib/ai/chat-request.ts`: Copilot query handler, tool orchestration, and model invocation.

**Testing:**
- `vitest.config.mts`: Test runner configuration for unit and integration tests.
- `vitest.evals.config.mts`: Configuration for AI agent evaluation harness (`evals/tuah.eval.ts`).
- `tests/`: End-to-end and unit test suites across all business domains.

## Naming Conventions

**Files:**
- React components and screens: `kebab-case.tsx` (e.g., `deal-board.tsx`, `invoices.tsx`, `app-shell.tsx`).
- Business logic, utilities, and libraries: `kebab-case.ts` (e.g., `current-org.ts`, `finance-tools.ts`, `viewer.ts`).
- Route pages and API endpoints: Standard Next.js conventions (`page.tsx`, `layout.tsx`, `route.ts`).
- Tests: `[feature].test.ts` or `[feature].test.tsx`, with domain sub-types like `[feature].rls.test.ts`.

**Directories:**
- Product modules and feature folders: `kebab-case` (e.g., `connected-apps`, `payment-methods`, `ad-studio`).
- Route groups: Next.js parentheses pattern (e.g., `(app)`, `(auth)`).

## Where to Add New Code

**New Feature Screen:**
- Implementation: Create screen component in `src/screens/<product>/<feature-name>.tsx`.
- Registration: Register the screen key and import in [`src/screens/registry.ts`](file:///root/OpenKuasa/src/screens/registry.ts).
- Navigation: Add nav entry to [`src/config/nav.ts`](file:///root/OpenKuasa/src/config/nav.ts).
- Route Generation: Run `pnpm gen:routes` to generate `src/app/(app)/<product>/<feature-name>/page.tsx`.
- Tests: Add test in `tests/<product>-<feature-name>.test.tsx`.

**New Backend Domain Service / Query:**
- Implementation: Add helper in `src/lib/<product>/<feature-name>.ts`.
- Tests: Add unit tests in `tests/<product>-<feature-name>.test.ts`.

**New AI Copilot / MCP Tool:**
- AI Copilot: Define tool schema and resolver in `src/lib/ai/<product>-tools.ts` and link in `src/lib/ai/tools.ts`.
- MCP Server: Register tool in `src/lib/mcp/dispatch.ts` and implement handler in `src/lib/mcp/server.ts`.
- Security Gate: Add ID/permission validation gate under `src/lib/ai/<product>-id-gate.ts`.

**Shared UI Primitive:**
- Implementation: Place in `src/components/ui/<component-name>.tsx` using Radix UI primitives and `cn()` utility.

## Special Directories

**`.planning/`:**
- Purpose: Contains GSD workflow metadata, engineering phases, architectural maps, and execution logs.
- Generated: Partially generated/maintained by autonomous planning agents.
- Committed: Yes.

**`src/app/(app)/<product>/<item>/page.tsx`:**
- Purpose: Route entry points generated by `scripts/gen-screen-routes.mjs` to ensure optimal code-splitting per screen.
- Generated: Yes (indicated by `// Generated by scripts/gen-screen-routes.mjs`).
- Committed: Yes (enforced by `predev` and `prebuild` scripts).

**`supabase/migrations/`:**
- Purpose: Deterministic database migration history for PostgreSQL schemas and RLS policies.
- Generated: No (hand-crafted or CLI-generated SQL migrations).
- Committed: Yes.

---

*Structure analysis: 2026-11-04*
