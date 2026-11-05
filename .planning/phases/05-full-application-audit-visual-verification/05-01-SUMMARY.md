---
phase: "05-full-application-audit-visual-verification"
plan: "01"
subsystem: "testing-and-audit-tooling"
tags:
  - testing
  - theme-engine
  - route-crawler
  - locked-modes
  - audit
dependency_graph:
  requires:
    - src/lib/theme.ts
    - scripts/nav-routes.mjs
    - scripts/smoke-routes.mjs
  provides:
    - tests/theme-locked-modes.test.ts
    - scripts/smoke-matrix.mjs
  affects:
    - .planning/phases/05-full-application-audit-visual-verification/
tech_stack:
  added: []
  patterns:
    - Vitest unit testing for state machine invariants and locked-mode pre-paint script
    - Next.js preview server lifecycle management (`OPENKUASA_PREVIEW=1`)
    - HTTP cookie-injected matrix crawling across 17 theme/mode variants
key_files:
  created:
    - tests/theme-locked-modes.test.ts
    - scripts/smoke-matrix.mjs
  modified: []
decisions:
  - "Tested and verified that all 7 hardware/retro presets enforce dark mode and prohibit light mode in DOM attributes and storage."
  - "Implemented multi-theme smoke crawler supporting --themes, --routes, and --matrix sweeps with cookie injection."
metrics:
  duration: "4m"
  completed_date: "2026-11-05"
status: complete
actuals:
  tokens: 38000
  tasks: 2
  commits: 2
plan_head_before: "eadb5c490fa9d2bce374c44933923bb6f7808605"
plan_head_after: "f9f471b6a6da270f6ea04c2b13b38e76b29573d7"
---

# Phase 05 Plan 01: Automated Testing Infrastructure & Multi-Theme Smoke Route Crawler Summary

Robust automated testing infrastructure for locked-mode theme state machines and an automated multi-theme route crawler matrix validating zero 500/404 server errors across 17 theme/mode variants.

## One-liner
Locked-mode theme state machine test suite and multi-theme smoke route crawler matrix supporting all 12 curated design presets.

## Executive Summary
Plan 05-01 established the foundational test harness and automated route crawling tooling needed to rigorously audit the OpenKuasa multi-theme system:
1. **Locked-Mode Unit Test Suite (`tests/theme-locked-modes.test.ts`)**: Built and executed 12 comprehensive Vitest unit tests asserting that all 7 hardware/retro presets (`proxmox-hypervisor`, `crt-phosphor`, `tactile-rackmount`, `irix-unix`, `scada-command`, `factory-plc`, `analog-tape`) are strictly locked to dark mode (`lockedMode === 'dark'`, `supportsLightDark === false`), that all 5 flexible presets support dual modes, that DOM attributes and fallback behavior match specs, and that `THEME_INIT_SCRIPT` enforces the lock map prior to paint.
2. **Multi-Theme Smoke Crawler Harness (`scripts/smoke-matrix.mjs`)**: Implemented a configurable HTTP route crawler that manages the Next.js preview server lifecycle (`OPENKUASA_PREVIEW=1`), injects `theme_preset` and `theme_mode` cookies, tests routes across 17 theme/mode configurations, and asserts HTTP 200/3xx statuses with zero 500/404 errors. Verified across representative module roots (`/command`, `/reach`, `/crm`, `/people`, `/hire`, `/finance`, `/account/appearance`).

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Locked-Mode Theme State Machine Test Suite | `69a469e` | `tests/theme-locked-modes.test.ts` |
| 2 | Multi-Theme Smoke Route Crawler Harness | `f9f471b` | `scripts/smoke-matrix.mjs` |

## Test & Verification Evidence

### Task 1: Locked-Mode Theme Tests
Command: `npx vitest run tests/theme-locked-modes.test.ts`
Result:
```
 ✓ tests/theme-locked-modes.test.ts (12 tests) 22ms
   ✓ Locked-Mode Theme State Machine Test Suite (D-06, D-04, FR-1) (12)
     ✓ 1. Preset Metadata & Locked-Dark Definitions (3)
       ✓ verifies all 7 hardware/retro presets have lockedMode === "dark" and supportsLightDark === false
       ✓ verifies all 5 flexible/modern presets have supportsLightDark === true and no lockedMode
       ✓ verifies total of exactly 12 presets registered with valid metadata (id, name, description)
     ✓ 2. State Machine Transitions & Effective Mode Resolution (3)
       ✓ resolves locked presets strictly to "dark" even when "light" preference is passed
       ✓ resolves flexible presets according to requested mode
       ✓ evaluates system preference via matchMedia for flexible presets when mode is "system"
     ✓ 3. Persistence & DOM Stamping Behavior (3)
       ✓ stamps data-theme and forces dark class on documentElement for locked presets
       ✓ honors light mode DOM stamping for flexible presets
       ✓ resolves fallback properly when localStorage contains invalid preset or mode
     ✓ 4. Zero-FOUC Pre-paint Inlined Script (THEME_INIT_SCRIPT) (3)
       ✓ contains lock map for all 7 retro/hardware presets
       ✓ enforces dark mode in DOM even when user mode is set to light for locked themes
       ✓ permits light mode execution for flexible themes in THEME_INIT_SCRIPT

 Test Files  1 passed (1)
      Tests  12 passed (12)
```

### Task 2: Multi-Theme Smoke Route Crawler
Command: `node scripts/smoke-matrix.mjs --themes kuasa-emerald,crt-phosphor --routes /command,/finance,/account/appearance`
Result:
```
Connected to test server at http://127.0.0.1:3175
Executing multi-theme smoke sweep (3 theme configs, 3 routes)...
OK 200 [kuasa-emerald:light] /command (318ms)
OK 200 [kuasa-emerald:light] /finance (59ms)
OK 200 [kuasa-emerald:light] /account/appearance (40ms)
OK 200 [kuasa-emerald:dark] /command (27ms)
OK 200 [kuasa-emerald:dark] /finance (36ms)
OK 200 [kuasa-emerald:dark] /account/appearance (19ms)
OK 200 [crt-phosphor:dark] /command (23ms)
OK 200 [crt-phosphor:dark] /finance (36ms)
OK 200 [crt-phosphor:dark] /account/appearance (24ms)

--- Multi-Theme Smoke Sweep Summary ---
Total checks:   9
Theme variants: 3
Routes tested:  3
Total duration: 0.58s
Failures:       0
✓ All multi-theme smoke checks passed with zero 500/404 errors.
```

Full sweep verification across all 17 theme/mode variants over 7 core module routes:
- Total checks: 119
- Theme variants: 17
- Routes tested: 7
- Total duration: 3.32s
- Failures: 0 (100% HTTP 200 responses)

## Deviations from Plan
None - plan executed exactly as specified.

## Self-Check: PASSED
- [x] `tests/theme-locked-modes.test.ts` exists on disk.
- [x] `scripts/smoke-matrix.mjs` exists on disk and is executable.
- [x] Commit `69a469e` verified in git history.
- [x] Commit `f9f471b` verified in git history.
- [x] All 12 unit tests pass.
- [x] Multi-theme smoke crawler passes with 0 errors.
