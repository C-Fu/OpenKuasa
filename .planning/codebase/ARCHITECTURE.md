---
last_mapped_commit: 81261c5c9a931a2e3e02e8abd03709e63d8f788a
last_mapped_at: 2026-11-04
---
<!-- refreshed: 2026-11-04 -->
<Architecture>
**Analysis Date:** 2026-11-04

## System Overview

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Client / Browser & Agents                              │
│       PWA / Next.js React 19 Frontend  │  MCP External Clients (Claude/Cursor)         │
└─────────────────────────────────┬──────────────────────────────────┬───────────────────┘
                                  │ HTTP / SSE / Actions             │ Bearer Token
                                  ▼                                  ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                Edge / Proxy & Gateway Layer                            │
│                       `src/proxy.ts` (Nonce, CSP, Supabase Session)                    │
│                 `src/middleware.ts` & Bearer Bypasses (`/api/mcp`)                     │
└─────────────────────────────────┬──────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                Application / Route Layer                               │
│  App Shell (`src/app/(app)/layout.tsx`)  │ API Routes (`src/app/api/*`)               │
│  Generated Screen Routes                 │ MCP Endpoint (`src/app/api/mcp/route.ts`)   │
│  (`scripts/gen-screen-routes.mjs`)       │ AI Chat & Streaming (`src/app/api/chat/*`)  │
└──────────────────┬───────────────────────┴──────────────────────────┬──────────────────┘
                   │                                                  │
                   ▼                                                  ▼
┌───────────────────────────────────────────────┐  ┌─────────────────────────────────────┐
│          Modular Screen & UI Components       │  │        Domain & Agent Framework     │
│  • Reach (Marketing / Lead Forms)             │  │  • Autonomous Agents (`lib/agents`) │
│  • CRM (Kasturi: Deals, Contacts, Chatbot)    │  │    (Jebat, Kasturi, Bendahara,      │
│  • Finance (Bendahara: Invoices, Ledger, FX)  │  │     Lekir, Lekiu)                   │
│  • People (Lekiu: HR, Payroll, Shifts)        │  │  • AI Tools & Gates (`lib/ai/*`)    │
│  • Hire (Lekir: Jobs, Talent, Candidates)     │  │  • MCP Dispatcher (`lib/mcp/*`)     │
│  • Command (Tuah: Multi-product Copilot)      │  │                                     │
│  `src/screens/*` & `src/components/*`         │  │  `src/lib/*`                        │
└──────────────────┬────────────────────────────┘  └──────────────────┬──────────────────┘
                   │                                                  │
                   └──────────────────────┬───────────────────────────┘
                                          │
                                          ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               Data & Tenancy Access Layer                              │
│         `src/lib/supabase/server.ts` (SSR with workspace RLS isolation)                │
│         `src/lib/supabase/service.ts` (Elevated service role background jobs)          │
│         `src/lib/auth/viewer.ts` & `src/lib/auth/permissions.ts`                       │
└─────────────────────────────────────────┬──────────────────────────────────────────────┘
                                          │
                                          ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Storage & Database Engines                             │
│                  Supabase PostgreSQL (Multi-tenant RLS Policies)                       │
│                     Supabase Storage (Documents, Attachments, CVs)                     │
│                     OpenRouter AI Models (Claude, DeepSeek, etc.)                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| **Security Proxy** | Applies CSP headers, generates per-request cryptographically secure nonce, maintains Supabase SSR cookies, handles MCP bearer exemptions | [`src/proxy.ts`](file:///root/OpenKuasa/src/proxy.ts) |
| **Route Generator** | Prebuild code generation linking screens in `registry.ts` and URLs in `nav.ts` into isolated Next.js page modules for optimal code-splitting | [`scripts/gen-screen-routes.mjs`](file:///root/OpenKuasa/scripts/gen-screen-routes.mjs) |
| **Screen Registry** | Central map defining product/screen component mappings across Reach, CRM, Finance, Hire, and People | [`src/screens/registry.ts`](file:///root/OpenKuasa/src/screens/registry.ts) |
| **App Shell & Layout** | Authenticated shell layout, organization tenancy context, navigation badges aggregation, and proposal counts | [`src/app/(app)/layout.tsx`](file:///root/OpenKuasa/src/app/(app)/layout.tsx) |
| **Viewer & Auth Context** | Resolves user profile, active organization/workspace tenancy, role capabilities (`owner`, `admin`, `member`, `accountant`) | [`src/lib/auth/viewer.ts`](file:///root/OpenKuasa/src/lib/auth/viewer.ts) |
| **Autonomous Agent System** | Autonomous background agents (Jebat, Kasturi, Bendahara, Lekir, Lekiu) proposing and executing actions with audit trails | [`src/lib/agents/runner.ts`](file:///root/OpenKuasa/src/lib/agents/runner.ts) |
| **Agent Registry** | Static composition root binding domain agent definitions to their respective operational keys without dynamic import hazards | [`src/lib/agents/registry.ts`](file:///root/OpenKuasa/src/lib/agents/registry.ts) |
| **MCP Server & Dispatch** | Model Context Protocol server exposing OpenKuasa business tools to external IDEs/assistants over JSON-RPC / SSE | [`src/lib/mcp/server.ts`](file:///root/OpenKuasa/src/lib/mcp/server.ts) |
| **AI Copilot & Gatekeeper** | Tool calling orchestrator for Tuah (system-wide assistant) with permission gates and schema validations | [`src/lib/ai/chat-request.ts`](file:///root/OpenKuasa/src/lib/ai/chat-request.ts) |
| **Supabase Client Factories** | Context-safe Supabase client initializers for SSR cookies, service role operations, and anonymous flows | [`src/lib/supabase/server.ts`](file:///root/OpenKuasa/src/lib/supabase/server.ts) |

## Pattern Overview

**Overall:** Modular Monolith with App-Router Next.js 16 + Server-Driven Screen Registry + Autonomous Agent Propose/Approve Architecture.

**Key Characteristics:**
- **Product Domain Isolation:** Business domains are partitioned into dedicated sub-suites named after the legendary Hang Tuah five warriors:
  - **Command (Tuah):** Unified cross-domain conversational intelligence and executive dashboard.
  - **CRM (Kasturi):** Deals, pipelines, contacts, chatbot builder, and customer broadcasts.
  - **Finance (Bendahara):** Invoicing, double-entry ledger, cash book, bank reconciliations, SST reporting, and foreign exchange (BNM rate integrations).
  - **Hire (Lekir):** Talent pool, candidate tracking, career portal, and interview evaluation loops.
  - **People (Lekiu):** HR management, biometric/clock attendance, payroll, leave, claims, overtime, and shift rostering.
  - **Reach (Jebat):** Ad studio, lead collection forms, campaign analytics, and creative bank.
- **Code-Splitting via Screen Registry Generation:** Rather than bundling all screen views into dynamic catch-all route branches, `scripts/gen-screen-routes.mjs` generates concrete route files under `src/app/(app)/[product]/[item]/page.tsx` directly from `src/screens/registry.ts`.
- **Propose-Then-Approve Human-in-the-Loop Agents:** AI agents run autonomously or scheduled, but non-read operations generate `agent_proposals` requiring user review unless explicitly auto-approved by organization policy.
- **Strict Row-Level Security (RLS) Tenancy:** Database access relies on Supabase RLS using authenticated user sessions and workspace/organization scoping (`org_id`).

## Layers

**Edge & Security Layer:**
- Purpose: Enforce strict CSP policies with inline script nonces, maintain session auth cookies, route bearer tokens for MCP integrations.
- Location: `src/proxy.ts`, `src/lib/security/`
- Contains: Proxy middleware, CSP configuration, security headers, rate limiting.
- Depends on: `@supabase/ssr`, `crypto`.
- Used by: All incoming HTTP requests.

**Routing & Presentation Layer:**
- Purpose: Next.js 16 App Router pages, screen layouts, client components, and interactive forms.
- Location: `src/app/`, `src/screens/`, `src/components/`
- Contains: React Server Components (RSC), Client Components (`'use client'`), Radix UI primitives, Lucide icons, Tailwind CSS styling.
- Depends on: Domain libraries (`src/lib/*`), Viewer context, Supabase SSR client.
- Used by: Browser clients, mobile PWA users.

**Domain & Business Logic Layer:**
- Purpose: Encapsulate business rules, workflows, validations, calculations, and integrations for each product.
- Location: `src/lib/crm/`, `src/lib/finance/`, `src/lib/hire/`, `src/lib/people/`, `src/lib/reach/`
- Contains: Calculation functions (e.g., SST taxes, payroll deductions, FX revaluations), database query helpers, service modules.
- Depends on: `src/lib/supabase/`, Zod schemas.
- Used by: Server components, API endpoints, AI agent tool callers.

**Agentic & AI Orchestration Layer:**
- Purpose: Autonomous agents, MCP tool execution, and interactive natural-language assistance.
- Location: `src/lib/agents/`, `src/lib/ai/`, `src/lib/mcp/`
- Contains: AI SDK providers (`ai`, `@openrouter/ai-sdk-provider`), agent runner schedules, tool definitions, permission gates.
- Depends on: Domain logic, OpenRouter API, Supabase service client.
- Used by: `/api/chat`, `/api/agents`, `/api/mcp`, and scheduled cron triggers.

**Data Persistence & Tenancy Layer:**
- Purpose: Supabase client instantiations, PostgreSQL migrations, schema types, and storage adapters.
- Location: `src/lib/supabase/`, `supabase/migrations/`
- Contains: SSR cookie readers/writers, service client, migration SQL scripts.
- Depends on: `@supabase/ssr`, `@supabase/supabase-js`.
- Used by: All server-side data fetching and mutations.

## Data Flow

### Primary Request Path (Authenticated Screen Request)

1. **Proxy Interception:** Request hits [`src/proxy.ts`](file:///root/OpenKuasa/src/proxy.ts). A cryptographic nonce is generated and injected into request headers alongside CSP headers. Session cookies are checked via `updateSession()`.
2. **App Layout Resolution:** Next.js matches the route to [`src/app/(app)/layout.tsx`](file:///root/OpenKuasa/src/app/(app)/layout.tsx), which resolves the authenticated caller using `getViewer()` in [`src/lib/auth/viewer.ts`](file:///root/OpenKuasa/src/lib/auth/viewer.ts) and fetches badge counts.
3. **Screen Execution:** The generated route page (e.g. `src/app/(app)/finance/invoices/page.tsx`) renders the designated screen module from `src/screens/finance/invoices.tsx`.
4. **Data Hydration:** Server component or client data fetcher calls `createClient()` from [`src/lib/supabase/server.ts`](file:///root/OpenKuasa/src/lib/supabase/server.ts), issuing queries filtered through Postgres RLS by the user's active `org_id`.
5. **DOM Streaming:** Next.js streams the rendered React components to the client, utilizing dynamic router caching configured in [`next.config.ts`](file:///root/OpenKuasa/next.config.ts).

### Autonomous Agent Run & Human-in-the-Loop Flow

1. **Agent Trigger:** Cron job or manual trigger hits `/api/agents/run` with authorization verified via [`src/lib/agents/trigger-auth.ts`](file:///root/OpenKuasa/src/lib/agents/trigger-auth.ts).
2. **Execution & Context Assembly:** `runAgent()` in [`src/lib/agents/run-agent.ts`](file:///root/OpenKuasa/src/lib/agents/run-agent.ts) loads agent configuration and queries unhandled proposals or domain status via OpenRouter.
3. **Proposal Creation:** When mutation actions are necessary, agents formulate proposals stored in `agent_proposals` using [`src/lib/agents/proposals.ts`](file:///root/OpenKuasa/src/lib/agents/proposals.ts).
4. **Human Review / Decision:** Organization administrators review pending proposals in `/agents` or product screens; approval triggers [`src/lib/agents/apply-proposal.ts`](file:///root/OpenKuasa/src/lib/agents/apply-proposal.ts) to execute the guarded database mutations.

### External MCP Client Connection Flow

1. **Bearer Authentication:** External client connects to `/api/mcp` with an organization API token; `src/proxy.ts` detects the bearer path and bypasses cookie session refreshes.
2. **Token Verification:** [`src/lib/mcp/caller.ts`](file:///root/OpenKuasa/src/lib/mcp/caller.ts) resolves the bearer token against active workspace MCP bindings.
3. **Tool Dispatch:** The MCP server receives JSON-RPC requests in [`src/lib/mcp/server.ts`](file:///root/OpenKuasa/src/lib/mcp/server.ts), routes to domain tool definitions in [`src/lib/mcp/dispatch.ts`](file:///root/OpenKuasa/src/lib/mcp/dispatch.ts), and logs caller activity in [`src/lib/mcp/activity.ts`](file:///root/OpenKuasa/src/lib/mcp/activity.ts).

**State Management:**
- **Server State:** Supabase PostgreSQL is the canonical store, partitioned by `org_id`.
- **Session State:** HTTP-only cookies managed via `@supabase/ssr` and refreshed in `src/proxy.ts`.
- **Client UI State:** React 19 hooks (`useState`, `useActionState`, `useOptimistic`), React Context for Viewer, Nav Badges, and Theme.

## Key Abstractions

**Viewer & Workspace Tenancy:**
- Purpose: Represents the authenticated caller, their selected organization, role, and granted feature privileges.
- Examples: [`src/lib/auth/viewer.ts`](file:///root/OpenKuasa/src/lib/auth/viewer.ts), [`src/lib/auth/permissions.ts`](file:///root/OpenKuasa/src/lib/auth/permissions.ts).
- Pattern: Ambient context passed via React Server Context & Server Components.

**Screen Registry Entry:**
- Purpose: Maps canonical URI slugs (`product/item`) to React screen components, decoupling routes from implementation and enabling ahead-of-time code generation.
- Examples: [`src/screens/registry.ts`](file:///root/OpenKuasa/src/screens/registry.ts), [`src/config/nav.ts`](file:///root/OpenKuasa/src/config/nav.ts).
- Pattern: Registry & Build-time Code Generation.

**Autonomous Agent Definition:**
- Purpose: Standard contract for product-aligned AI agents (prompt design, allowed actions, cost allocation, schedules).
- Examples: [`src/lib/agents/definition.ts`](file:///root/OpenKuasa/src/lib/agents/definition.ts), [`src/lib/agents/reach-agent.ts`](file:///root/OpenKuasa/src/lib/agents/reach-agent.ts).
- Pattern: Strategy / Specification Pattern.

**Guarded Tool Calling Gates:**
- Purpose: Validates IDs, access constraints, and state transitions before AI tool execution modifies core database entities.
- Examples: [`src/lib/ai/finance-id-gate.ts`](file:///root/OpenKuasa/src/lib/ai/finance-id-gate.ts), [`src/lib/ai/hire-interview-gate.ts`](file:///root/OpenKuasa/src/lib/ai/hire-interview-gate.ts), [`src/lib/ai/roster-id-gate.ts`](file:///root/OpenKuasa/src/lib/ai/roster-id-gate.ts).
- Pattern: Interceptor / Guard Gate.

## Entry Points

**Web Browser Application:**
- Location: [`src/proxy.ts`](file:///root/OpenKuasa/src/proxy.ts) and [`src/app/layout.tsx`](file:///root/OpenKuasa/src/app/layout.tsx).
- Triggers: User HTTP navigation.
- Responsibilities: Security header injection, session refresh, font hydration, theme context setup.

**AI Copilot Stream Endpoint:**
- Location: [`src/app/api/chat/route.ts`](file:///root/OpenKuasa/src/app/api/chat/route.ts).
- Triggers: Frontend conversational chat submissions.
- Responsibilities: Verifies viewer permissions, constructs model prompt with domain tools, streams AI responses.

**MCP Model Context Protocol Gateway:**
- Location: [`src/app/api/mcp/route.ts`](file:///root/OpenKuasa/src/app/api/mcp/route.ts).
- Triggers: External developer assistants (Claude Desktop, Cursor, AI agents).
- Responsibilities: Bearer auth parsing, tool discovery, RPC protocol framing, tool execution.

**Agent Execution Poller:**
- Location: [`src/app/api/agents/run/route.ts`](file:///root/OpenKuasa/src/app/api/agents/run/route.ts).
- Triggers: Vercel Cron or scheduled external HTTP triggers.
- Responsibilities: Agent schedule matching, autonomous proposal generation, execution logging.

## Architectural Constraints

- **Threading & Execution Model:** Single-threaded asynchronous Node.js 22 runtime. Long-running tasks must run as background agent runs or asynchronous database routines.
- **Global State:** No shared in-memory mutable state across requests to ensure compatibility with serverless and containerized deployment (`NEXT_OUTPUT=standalone`).
- **Circular Imports:** Avoided through centralized registry files ([`src/screens/registry.ts`](file:///root/OpenKuasa/src/screens/registry.ts) and [`src/lib/agents/registry.ts`](file:///root/OpenKuasa/src/lib/agents/registry.ts)) that aggregate modules without circular cross-references.
- **Tenancy Boundary:** Every database query touching organization data MUST include or be scoped by `org_id`, enforced both in application logic and PostgreSQL Row-Level Security.

## Anti-Patterns

### Hand-Writing Generated Screen Routes

**What happens:** Developers manually create `src/app/(app)/[product]/[screen]/page.tsx` with customized code without registering it in `src/screens/registry.ts`.
**Why it's wrong:** Breaks the build-time generation pipeline (`scripts/gen-screen-routes.mjs`), causing route collision or orphan errors during prebuild checks.
**Do this instead:** Register the screen in [`src/screens/registry.ts`](file:///root/OpenKuasa/src/screens/registry.ts) and `src/config/nav.ts`, then run `pnpm gen:routes`.

### Bypassing Agent Proposal Audits for Mutations

**What happens:** AI agents executing database `UPDATE` or `DELETE` commands directly on core records without user confirmation or proposal record.
**Why it's wrong:** Violates human-in-the-loop integrity and risks catastrophic automated data alterations in critical financial or payroll tables.
**Do this instead:** Create a proposal using [`src/lib/agents/proposals.ts`](file:///root/OpenKuasa/src/lib/agents/proposals.ts) and require explicit user approval via `apply-proposal.ts`.

## Error Handling

**Strategy:** Layered defensive error boundaries, contextual fallback values, and structured logging.

**Patterns:**
- **Navigation Badge Fail-Safe:** App shell queries in [`src/app/(app)/layout.tsx`](file:///root/OpenKuasa/src/app/(app)/layout.tsx) are wrapped in `catch()` blocks defaulting to zero so that database hiccups in sub-modules never crash the main application navigation.
- **API Response Formatting:** API routes return structured JSON responses with explicit error messages and HTTP status codes (400 for bad input, 401 for unauthorized, 403 for permission denied, 500 for unhandled exceptions).
- **Zod Schema Validation:** External payloads in API routes and AI tool invocations are validated through strict Zod schemas before hitting business logic.

## Cross-Cutting Concerns

**Logging:** Console logging with request-level anonymization; personal data suppression configured in `next.config.ts` (`logging: { serverFunctions: false }`). Agent actions logged to `agent_runs` table.
**Validation:** Zod schemas across API handlers, form actions, and agent tool definitions.
**Authentication:** Supabase Auth via SSR cookie exchange, MFA recovery codes, and custom Bearer token resolution for MCP integrations.

---

*Architecture analysis: 2026-11-04*
