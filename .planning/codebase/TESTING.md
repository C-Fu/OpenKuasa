---
last_mapped_commit: 81261c5c9a931a2e3e02e8abd03709e63d8f788a
last_mapped_at: 2026-11-04
---
<Testing Patterns>
**Analysis Date:** 2026-11-04

## Test Framework

**Runner:**
- Vitest `^5.0.3`
- Config files:
  - Unit/integration tests: `vitest.config.mts`
  - Model evals / accuracy runs: `vitest.evals.config.mts`

**Assertion Library:**
- Vitest built-in assertions (`expect`, `describe`, `it`, `test`, `vi`)

**Run Commands:**
```bash
pnpm test              # Run all unit and integration tests (vitest run)
pnpm test:watch        # Vitest watch mode
pnpm eval:tuah         # Run slow model accuracy evaluations (vitest run --config vitest.evals.config.mts)
pnpm smoke:routes      # Smoke test screen routes via node script
```

## Test File Organization

**Location:**
- Separate top-level directories:
  - Tests: `tests/` contains all unit, integration, and RLS test suites.
  - Evals: `evals/` contains Tuah LLM agent accuracy checks (`evals/**/*.eval.ts`).
  - Stubs: `tests/stubs/` contains runtime shims (e.g. `tests/stubs/server-only.ts`).
  - Setup: `tests/setup/` contains harness initializers (`tests/setup/no-network.ts`, `tests/setup/fake-supabase.ts`, `tests/setup/supabase.ts`).
  - Helpers: `tests/helpers/` contains reusable live-workspace test utilities (`tests/helpers/live-workspaces.ts`, `tests/helpers/approvals.ts`).

**Naming:**
- Unit/Component tests: `tests/<feature>.test.ts` or `tests/<component>.test.tsx` (e.g. `tests/auth-signup.test.ts`, `tests/bento-stat-value-fits.test.tsx`).
- Live database / RLS tests: `tests/<feature>.rls.test.ts` or `tests/<feature>.live.test.ts` (e.g. `tests/account.rls.test.ts`, `tests/tenancy.rls.test.ts`).
- Evaluation suites: `evals/<suite>.eval.ts` (e.g. `evals/tuah.eval.ts`).

**Structure:**
```
tests/
├── setup/                  # Harness configuration and network enforcement
│   ├── no-network.ts       # Global fetch guard blocking external HTTP
│   ├── fake-supabase.ts    # In-memory Supabase client query builder mock
│   └── supabase.ts         # Live Supabase connection loader and skip flags
├── helpers/                # Test fixtures and live test workspace factories
│   ├── live-workspaces.ts  # Workspace creation and teardown helpers
│   └── approvals.ts
├── stubs/
│   └── server-only.ts      # Stub for Next.js server-only import
├── *.test.ts               # Unit & integration backend tests
└── *.test.tsx              # Component & SSR markup tests
evals/
├── tuah/                   # Cases and harnesses for AI agent testing
└── *.eval.ts               # Multi-pass model accuracy evaluations
```

## Test Structure

**Suite Organization:**
```typescript
import { beforeEach, expect, test, vi } from 'vitest';
import { signUpAction } from '@/app/(auth)/actions';

describe('BentoStat value', () => {
  it('scales the figure to its tile and wraps a long money value', () => {
    // Assertions
  });
});

test('a sign-up is counted once, per client and per address, before anything else', async () => {
  // Test body
});
```

**Patterns:**
- **Network Isolation by Default:** Every standard unit test is run under `tests/setup/no-network.ts`. Any unmocked external network call throws an error immediately and reports at `afterAll`.
- **Conditional Live Database Execution:**
  ```typescript
  import { afterAll, beforeAll, expect, test } from 'vitest';
  import { hasSupabaseEnv, supabaseEnvSkipReason } from './setup/supabase';

  const testWithSupabase = hasSupabaseEnv ? test : test.skip;
  if (!hasSupabaseEnv) console.warn(supabaseEnvSkipReason);

  testWithSupabase('a profile row is created on sign-up', async () => {
    // executes against live Supabase dev project
  });
  ```
- **Sequential Execution & Isolation:** Configured with `fileParallelism: false` and `isolate: true` in `vitest.config.mts` to prevent race conditions during workspace seeding and cleanup.

## Mocking

**Framework:**
- Vitest built-in `vi` module mocking with `vi.mock` and `vi.hoisted`.

**Patterns:**
```typescript
// Hoisted mock declaration for Next.js and Supabase dependencies
const { createClient, recordEvent, cookieStore, consumeRateLimits } = vi.hoisted(() => ({
  createClient: vi.fn(),
  recordEvent: vi.fn(),
  cookieStore: { set: vi.fn(), get: vi.fn(), delete: vi.fn() },
  consumeRateLimits: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({ createClient }));
vi.mock('@/lib/security/rate-limit', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/security/rate-limit')>()),
  consumeRateLimits,
}));
vi.mock('@/lib/events', () => ({ recordEvent }));
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => new Headers({ origin: 'https://app.example' }),
}));
vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`REDIRECT ${path}`);
  },
}));
```

**What to Mock:**
- Next.js server context: `next/headers` (`cookies()`, `headers()`), `next/navigation` (`redirect()`).
- Database clients for unit tests: use `fakeSupabase()` (`tests/setup/fake-supabase.ts`) or mock `createClient`.
- External rate-limiting counters (`consumeRateLimits`) to avoid exhausting rate limits during offline testing.

**What NOT to Mock:**
- Domain logic, schemas, and rule definitions: keep `@/lib/security/limits` and Zod schemas real.
- In `*.rls.test.ts` suites, do not mock Supabase or PostgreSQL: test real Row Level Security and database constraints against a local or development instance.
- Component rendering: use `renderToStaticMarkup` from `react-dom/server` rather than mocking React component trees.

## Fixtures and Factories

**Test Data:**
```typescript
// tests/setup/fake-supabase.ts
import { fakeSupabase } from './setup/fake-supabase';

const { client, calls } = fakeSupabase({
  'profiles.select': { data: [{ id: 'u1', full_name: 'Ahmad' }] },
  'rpc.log_event': { data: null, error: null },
});
```
```typescript
// tests/helpers/live-workspaces.ts
import { createOrg, joinDemo, signInAnon, signInOwner } from './helpers/live-workspaces';

const owner = await anonUser(signInOwner);
const { data: orgId } = await createOrg(owner.c, 'Account Test Sdn Bhd');
```

**Location:**
- In-memory query fake: `tests/setup/fake-supabase.ts`
- Live workspace fixtures and authentication helpers: `tests/helpers/live-workspaces.ts`
- Domain-specific helpers: `tests/helpers/approvals.ts`, `tests/helpers/bill-rows.ts`, `tests/helpers/invoice-rows.ts`

## Coverage

**Requirements:**
- None strictly enforced via vitest thresholds in `vitest.config.mts`, but comprehensive coverage across RLS policies, Server Actions, permissions, and UI components is maintained via 119+ test files.

**View Coverage:**
```bash
pnpm vitest run --coverage
```

## Test Types

**Unit Tests:**
- Test individual library functions, utility parsers, security limits, and formatters without I/O or network access.
- Examples: `tests/safe-path.test.ts`, `tests/recovery-marker.test.ts`, `tests/agent-definition.test.ts`.

**Server Action Tests:**
- Validate Next.js Server Actions with mocked cookies, headers, and Supabase client responses.
- Examples: `tests/auth-signup.test.ts`, `tests/auth-confirm-route.test.ts`, `tests/account-logo-actions.test.ts`.

**Component / SSR Markup Tests:**
- Test React components by rendering with `renderToStaticMarkup` (`react-dom/server`) and asserting class names, DOM hierarchy, and Tailwind CSS responsive containers.
- Examples: `tests/bento-stat-value-fits.test.tsx`, `tests/chart-style.test.tsx`, `tests/crm-deals-open.test.tsx`.

**Integration / RLS Tests:**
- Real tests executed against a Supabase backend to ensure Row Level Security policies, multi-tenancy boundaries, stored procedures, and role checks hold true.
- Examples: `tests/account.rls.test.ts`, `tests/tenancy.rls.test.ts`, `tests/bendahara-foundation.rls.test.ts`.

**Model Evaluation Checks (Evals):**
- Real LLM evaluation test runs against OpenRouter/models validating Tuah AI responses and tool invocations.
- Run through `pnpm eval:tuah` configured in `vitest.evals.config.mts` and `evals/tuah.eval.ts`.

## Common Patterns

**Async Testing:**
```typescript
test('verifies async server action result', async () => {
  const result = await signUpAction(undefined, formData);
  expect(result?.error).toBeUndefined();
});
```

**Error Testing:**
```typescript
test('aborts with redirect exception', async () => {
  await expect(signInAction(undefined, validFormData)).rejects.toThrow('REDIRECT /command');
});
```

---

*Testing analysis: 2026-11-04*
