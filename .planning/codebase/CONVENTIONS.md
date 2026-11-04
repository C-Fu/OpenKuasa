---
last_mapped_commit: 81261c5c9a931a2e3e02e8abd03709e63d8f788a
last_mapped_at: 2026-11-04
---
<Coding Conventions>
**Analysis Date:** 2026-11-04

## Naming Patterns

**Files:**
- Use kebab-case for all TypeScript source, test, component, and utility files (e.g. `src/lib/auth/viewer.ts`, `src/lib/security/limits.ts`, `src/components/bento/bento.tsx`).
- Next.js special files follow framework conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `not-found.tsx`, `route.ts`, and `actions.ts`.
- Script files use kebab-case with `.mjs` extension in `scripts/` (e.g. `scripts/gen-screen-routes.mjs`, `scripts/db-migrate.mjs`).
- Test files use kebab-case with descriptive suffix:
  - Unit/offline tests: `tests/<feature>.test.ts` or `tests/<component>.test.tsx` (e.g. `tests/auth-signup.test.ts`, `tests/bento-stat-value-fits.test.tsx`).
  - Integration/RLS tests against database: `tests/<feature>.rls.test.ts` (e.g. `tests/account.rls.test.ts`, `tests/agent-configs.rls.test.ts`).
  - LLM/Agent evaluation tests: `evals/<suite>.eval.ts` (e.g. `evals/tuah.eval.ts`).

**Functions:**
- Use `camelCase` for standard utility, service, and domain functions (e.g. `initialsOf`, `requestOrigin`, `consumeRateLimits`, `setRememberCookie`).
- Next.js Server Actions use `camelCase` ending in `Action` (e.g. `signInAction`, `signUpAction`, `updateProfileAction`).
- React components use `PascalCase` for declaration and export (e.g. `BentoStat`, `ActionNotice`, `NotFoundContent`).
- Predicate functions and type guards begin with `is`, `has`, or `can` (e.g. `isLiveFile`, `hasSupabaseEnv`, `isOAuthClientToken`, `canSee`).
- Getter/derivation functions frequently use prepositional naming (e.g. `initialsOf`, `firstNameOf`, `hostOf`).

**Variables:**
- Local variables and parameters use `camelCase` (e.g. `parsed`, `remember`, `formData`, `orgName`).
- Module-level constants, configuration tables, static regex patterns, and fixed thresholds use `UPPER_SNAKE_CASE` (e.g. `SIGN_IN_PER_CLIENT`, `EVENT_KEYS`, `LIVE_NAME`, `LOCAL_HOSTS`, `REMEMBER_COOKIE`).
- Symbols use `UPPER_SNAKE_CASE` with namespaced string identifiers (e.g. `const LIVE_FLAG = Symbol.for('openkuasa.tests.live');`).

**Types:**
- Use `PascalCase` for `type` aliases and `interface` declarations (e.g. `Viewer`, `AuthState`, `FakeCall`, `FakeReply`, `ActivityCategory`, `Rule`).
- Discriminated union types use descriptive object literals with string tag properties (e.g. `op: 'select' | 'insert' | 'update' | 'delete' | 'rpc'`).
- Schema validation inference types are named matching the entity or action state.

## Code Style

**Formatting:**
- Controlled via Prettier/ESLint defaults and Tailwind CSS v4 styling rules.
- Single quotes (`'`) preferred in TypeScript/JavaScript; double quotes (`"`) used in JSON/PostCSS/HTML attributes.
- Trailing commas in multi-line lists, parameter lists, and object literals.
- Semicolons are consistently used at statement ends.
- 2-space indentation across all TypeScript, TSX, JSON, and config files.

**Linting:**
- Tool: ESLint v9 flat config via `eslint.config.mjs` using `eslint-config-next` (`core-web-vitals` + `typescript`).
- Ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`.
- TypeScript is enforced in strict mode (`"strict": true`, `"noEmit": true` in `tsconfig.json`).
- Server boundary directive `'use server';` is explicitly declared at the top of Server Action modules.
- Guard imports: `import 'server-only';` is placed at the top of server-only utility libraries (e.g. `src/lib/security/limits.ts`).

## Import Organization

**Order:**
1. Node.js built-ins with `node:` protocol prefix (e.g. `import { fileURLToPath } from 'node:url';`, `import { mkdirSync } from 'node:fs';`).
2. Server/framework boundaries and primitives (e.g. `'use server';`, `import 'server-only';`, `import { cache } from 'react';`, `import { redirect } from 'next/navigation';`).
3. External npm packages (e.g. `import { z } from 'zod';`, `import { createClient } from '@supabase/supabase-js';`, `import { expect, test, vi } from 'vitest';`).
4. Internal absolute modules aliased to `@/*` (e.g. `import { createClient } from '@/lib/supabase/server';`, `import { BentoStat } from '@/components/bento/bento';`).
5. Relative imports within the same feature directory (e.g. `import type { OrgRole } from './current-org';`).

**Path Aliases:**
- Configured in `tsconfig.json` and mirrored in `vitest.config.mts`:
  - `@/*` points to `./src/*`
  - `server-only` in Vitest environment is mapped to `./tests/stubs/server-only.ts` to allow Node runtime test execution.

## Error Handling

**Patterns:**
- **Server Actions Return Objects, Not Exceptions:** Form actions and server mutations avoid unhandled throw statements for user validation or business errors. They return a state object containing `{ error?: string; notice?: string; values?: { ... } }` (e.g. `signInAction` and `signUpAction` in `src/app/(auth)/actions.ts`).
- **Zod Validation at Entry Points:** Untyped inputs (`FormData`, JSON payloads) are parsed with Zod schemas using `.safeParse()`:
  ```typescript
  const parsed = signInSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, values };
  }
  ```
- **Auditing and Logging Fail-Safe:** Secondary side-effects such as audit logging or rate counting do not fail primary user workflows. In `src/lib/events.ts` (`recordEvent`), calls are wrapped in try/catch and log to `console.error` without re-throwing.
- **Fail Closed for Security Gates:** In security and authorization contexts (e.g. rate limiters in `src/lib/security/limits.ts` or contacts exports), missing tokens or database failures default to blocking access.
- **Next.js Navigation:** `redirect()` is called directly without being trapped inside generic try-catch blocks (or re-thrown if caught).

## Logging

**Framework:**
- Native `console` methods (`console.error`, `console.warn`, `console.info`) are standard across server code and tests.
- Structured application events are recorded into the database via `recordEvent(supabase, event)` in `src/lib/events.ts`, invoking PostgreSQL stored procedure `public.log_event`.

**Patterns:**
- Informative and precise warning messages for missing test or environment variables (e.g. `if (!hasSupabaseEnv) console.warn(supabaseEnvSkipReason);`).
- Do not log sensitive credentials, passwords, auth tokens, or private hashes to stdout or stderr.

## Comments

**When to Comment:**
- Document rationale and architecture rules at module headers, especially around security assumptions, rate limit calculations, and database triggers.
- Explain "why" behind synchronization requirements (e.g. `KEEP IN STEP with the newest file in supabase/migrations that restates log_event`).
- Detail test harness isolation constraints (e.g. explaining `isolate: true` and network interceptors in `vitest.config.mts` and `tests/setup/no-network.ts`).

**JSDoc/TSDoc:**
- Widely used on exported types, public API functions, and configuration tables to define behavior, parameter meanings, and caller expectations.

## Function Design

**Size:**
- Single-purpose functions under 50-80 lines. Complex actions (e.g. `signUpAction`) delegate helper tasks to dedicated functions (`setRememberCookie`, `requestOrigin`, `signInLimited`).

**Parameters:**
- Functions taking more than 2-3 parameters use object destructuring with defined TypeScript interfaces or type aliases (e.g. `recordEvent(supabase, { action, category, ... })`).

**Return Values:**
- Deterministic and typed; explicitly specify return types on exported functions (e.g. `Promise<AuthState>`, `string`, `EventKey | null`).

## Module Design

**Exports:**
- Named exports are favored across utilities, libraries, and components (`export function ...`, `export const ...`).
- Default exports are restricted to Next.js route entry pages (`export default function Page()`), layouts, and configuration modules (`eslint.config.mjs`, `vitest.config.mts`).

**Barrel Files:**
- Used selectively for UI component libraries and utils (e.g. `src/lib/utils.ts` re-exporting `cn`). No massive top-level barrel files that compromise tree-shaking.

---

*Convention analysis: 2026-11-04*
