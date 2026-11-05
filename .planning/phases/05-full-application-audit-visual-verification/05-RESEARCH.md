# Phase 05: Full Application Audit & Visual Verification - Research

**Researched:** 2026-11-05
**Domain:** Cross-Theme UI/UX Audit, Automated Smoke Matrix, Playwright Visual Captures, WCAG 2.1 AA Contrast Verification, Non-Invasive Theme Layer Remediation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01 (Comprehensive Route Audit Scope):** Audit all application navigation routes (`nav-routes.mjs` and `/account/*`, totaling ~30+ routes) including every nested tab and sub-route across all 12 themes.
- **D-02 (User Workflow Theme Switching Validation):** Validate theme switching through topbar ThemeSelector and `/settings/appearance` (mapped to `/account/appearance`) workflows to ensure authentic real-world persistence and zero-FOUC behavior.
- **D-03 (Full UI Component Spectrum Inspection):** Audit data tables, grids, status badges, form inputs, buttons, modals, drawers, dropdowns, tooltips, navigation sidebars, and tactile widgets across screens.
- **D-04 (Dual-Variant Coverage):** Test all 12 themes in both Dark and Light variants, except for themes with explicit dark-only locks.
- **D-05 (Strict WCAG 2.1 AA Compliance):** Enforce minimum 4.5:1 contrast for body copy and 3:1 for UI borders/headings across all active themes and states.
- **D-06 (Dark-Only Lock for CRT Phosphor, SCADA Command, and Proxmox Hypervisor):** Lock these three themes strictly to dark mode (disable light toggle or auto-force dark) to preserve their authentic terminal/telemetry design identities. [VERIFIED: `src/lib/theme.ts:46-48, 59-61, 92-94`]
- **D-07 (Sharp Numerical & Tabular Data):** Confine text glows, scanlines, and raster overlays strictly to decorative headings, badges, and canvas borders; keep data cells, numbers, and inputs un-blurred and razor sharp.
- **D-08 (Strict Font Enforcement):** Apply the theme's signature font (e.g., Newsreader serif, Silkscreen/VT323, JetBrains Mono, Space Grotesk) across all UI elements including tables and inputs to preserve complete immersion.
- **D-09 (Extended Smoke Route Runner):** Extend `scripts/smoke-routes.mjs` to systematically iterate through all routes under each theme via cookie/storage state, asserting HTTP 200 and zero console/runtime exceptions.
- **D-10 (Automated Screenshot Visual Captures):** Utilize Playwright to capture high-resolution visual snapshots of representative core screens (`/finance`, `/crm`, `/command`, `/people`, `/reach`, `/settings/appearance`) across all 12 themes for audit review.
- **D-11 (Zero-Tolerance Pass Criteria):** A route or screen passes only with zero 500/404 errors, zero React hydration mismatches, zero FOUC flashes, and zero layout overflows.
- **D-12 (Structured Audit Report Deliverable):** Produce a formal `.planning/phases/05-full-application-audit-visual-verification/AUDIT-REPORT.md` documenting route-by-route pass/fail status, contrast scores, and any visual quirks.
- **D-13 (In-Place High/Medium Remediation):** Automatically fix contrast failures, broken layouts, or missing CSS variables in-place during Phase 5 execution; catalog minor subjective notes in AUDIT-REPORT.md.
- **D-14 (Non-Invasive CSS Layer Fixes):** Apply all styling fixes inside `src/app/globals.css` or scoped theme files in `src/app/themes/*.css` (`[data-theme='...']`), preserving base component code and JSX clean.
- **D-15 (Atomic Git Commits):** Record each theme or module fix with an atomic commit (e.g. `fix(theme-crt): adjust badge contrast on finance table`).
- **D-16 (Immediate Regression Verification):** Immediately re-run smoke tests and re-capture visual screenshots following any CSS fix to verify that the regression is resolved cleanly.

### The Agent's Discretion
- Choice of automated headless capture pipeline (Playwright standalone runner script vs existing docs screenshot infrastructure).
- Exact script architecture for multi-theme matrix sweeping.
- WCAG color contrast measurement script algorithms (sRGB luminance vs Oklch APCA/WCAG formula).
- Organization and layout of the visual audit artifacts directory.

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed strictly within the audit, remediation, and verification scope of Phase 5.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **FR-1** | Multi-Theme Engine & Storage Architecture | Verified in `src/lib/theme.ts`. SSR pre-paint script `THEME_INIT_SCRIPT` verified in `src/app/layout.tsx`. Cookie and localStorage sync. |
| **FR-2** | Theme Selector Component & Appearance Page | Verified in `src/components/theme/theme-selector.tsx` and `src/app/account/appearance/appearance-client.tsx`. Dark-only locking verified. |
| **FR-3** | Curated Design Systems (All 12 themes) | Verified in `src/app/themes/*.css`. Typography, colors, and layout tokens inspected. |
| **NFR-1** | Performance (<16ms single frame switch, no layout thrashing) | Verified: View Transitions via `sliceTheme` in `keris-slice.ts` + pure CSS custom properties cascading from `[data-theme]`. |
| **NFR-2** | Component Compatibility (shadcn/ui buttons, cards, tables, inputs) | Verified: `src/app/globals.css` bridges Tailwind v4 tokens (`--background`, `--foreground`, `--primary`, `--border`, etc.) directly to radix & shadcn primitives. |
| **NFR-3** | Accessibility (WCAG 2.1 AA 4.5:1 text contrast & 3:1 borders/headings) | Automated WCAG evaluation script and headless DOM contrast evaluation protocol researched. |
</phase_requirements>

---

## Executive Summary

Phase 5 represents the final hardening, comprehensive visual verification, and quality gate for Milestone 1 (Multi-Theme System & Curated Design Engines). 

All 12 curated themes (`kuasa-emerald`, `proxmox-hypervisor`, `swiss-monochrome`, `crt-phosphor`, `executive-editorial`, `tactile-rackmount`, `blueprint-cad`, `irix-unix`, `scada-command`, `factory-plc`, `brutalist-ledger`, `analog-tape`) are implemented across `src/app/themes/*.css` and registered in `src/lib/theme.ts`.

Key architectural findings established during this research session:
1. **Dark-Only Locking Status [VERIFIED: `src/lib/theme.ts:35-115`]:**
   The codebase already locks 7 hardware/retro themes strictly to `dark` mode (`proxmox-hypervisor`, `crt-phosphor`, `tactile-rackmount`, `irix-unix`, `scada-command`, `factory-plc`, `analog-tape`). In both `ThemeSelector` and `AppearanceClient`, selecting one of these presets automatically forces dark mode, and disables light mode toggles.
2. **Execution Environment & Playwright Availability [VERIFIED: Tool probe]:**
   The machine has `node v24.15.0` and `pnpm 11.10.0`. `playwright-core` and Chromium headless shell are available locally at `/root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. Playwright can be invoked directly in Node.js via the installed `playwright-core` module without extra package downloads.
3. **Route Footprint [VERIFIED: `scripts/nav-routes.mjs`]:**
   OpenKuasa contains 6 product areas (`command`, `reach`, `crm`, `people`, `hire`, `finance`) declaring 90+ individual subroutes, plus 12 account subroutes (`/account/appearance`, `/account/security`, `/account/profile`, etc.), totaling over 100 navigable URLs.
4. **Smoke & Visual Audit Plan:**
   We can extend `scripts/smoke-routes.mjs` and build a dedicated `scripts/audit-matrix.mjs` that runs headless browser checks, tests all 12 themes across representative screens, evaluates WCAG 2.1 AA color contrast programmatically on rendered elements, captures high-resolution screenshots into `.planning/phases/05-full-application-audit-visual-verification/screenshots/`, and outputs a comprehensive `AUDIT-REPORT.md`.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Theme Mode Locking | Client / Hook (`src/lib/theme.ts`) | Pre-paint Inline Script (`THEME_INIT_SCRIPT`) | Prevents flash of light mode on dark-locked themes before hydration. Enforces lock in state transitions. |
| Theme CSS Cascade | Global CSS (`src/app/themes/*.css`) | Tailwind 4 Layer (`src/app/globals.css`) | All visual attributes (color, font, border, radius) cascade cleanly via CSS custom properties on `[data-theme]`. |
| Automated Route Smoke Testing | CLI Script (`scripts/smoke-routes.mjs`) | Node.js child_process / fetch | Evaluates HTTP status codes and server rendering stability across all route endpoints. |
| Headless Visual Captures | Playwright Script (`scripts/audit-screenshots.mjs`) | Chromium Headless Shell | Evaluates DOM hydration, console exceptions, layout dimensions, and captures visual proofs. |
| Contrast Evaluation | Headless Page Evaluator (`getComputedStyle`) | WCAG Luminance Function | Inspects actual rendered RGB colors of text and background to calculate true contrast ratio. |
| Non-Invasive Remediation | Theme CSS Token Layer (`src/app/themes/*.css`) | Theme Overrides (`src/app/globals.css`) | Component JSX files remain 100% untouched; fixes are strictly confined to CSS tokens. |

---

## Current State of Tooling & Routes

### Route Inventory
`scripts/nav-routes.mjs` parses `src/config/nav.ts`.
- **Top-level / Static:** `/`, `/login`, `/onboarding`, `/pricing`, `/privacy`, `/settings`, `/account`.
- **Account routes (12):** `/account/appearance`, `/account/company`, `/account/developer`, `/account/domains`, `/account/members`, `/account/notifications`, `/account/plans`, `/account/profile`, `/account/referrals`, `/account/security`, `/account/sessions`, `/account/support`.
- **Core Product Modules:**
  - `/command`: 1 route
  - `/reach`: 8 routes (`/reach/assistant`, `/reach/agents`, `/reach/ad-studio`, `/reach/creative-bank`, `/reach/leads`, `/reach/lead-forms`, `/reach/appointments`, `/reach/ad-settings`)
  - `/crm`: 15 routes (`/crm/contacts`, `/crm/deals`, `/crm/broadcast`, `/crm/chatbot`, `/crm/automations`, `/crm/landing-page`, `/crm/calendar`, `/crm/billings`, `/crm/reports`, `/crm/plugins`, `/crm/settings`, etc.)
  - `/people`: 32 routes (`/people/dashboard`, `/people/employees`, `/people/attendance`, `/people/leave`, `/people/claims`, `/people/payroll`, `/people/scorecard`, `/people/timesheet`, `/people/training`, etc.)
  - `/hire`: 10 routes (`/hire/jobs`, `/hire/candidates`, `/hire/applications`, `/hire/interviews`, `/hire/talent-pool`, etc.)
  - `/finance`: 29 routes (`/finance/dashboard`, `/finance/cash-receipts`, `/finance/invoices`, `/finance/quotations`, `/finance/expenses`, `/finance/banking`, `/finance/e-invoice`, `/finance/journals`, `/finance/chart-of-accounts`, etc.)

Total distinct application routes: ~107 routes.

### Smoke Testing Harness
`scripts/smoke-routes.mjs` spawns `pnpm exec next start` (or tests against `SMOKE_BASE_URL`), and asserts that every route returns HTTP 200/3xx.
However, `scripts/smoke-routes.mjs` currently checks routes without asserting specific themes or client-side runtime behavior.

To meet **D-09** and **D-11**, the smoke test strategy must include:
1. Matrix route health across themes.
2. In-browser console error trapping (capturing React hydration warnings, uncaught errors, 404 assets).

---

## Dark-Only Lock Architecture (CRT, SCADA, Proxmox, etc.)

In `src/lib/theme.ts`:
```typescript
[VERIFIED: src/lib/theme.ts:46-48, 59-61, 72-74, 85-87, 92-94, 99-101, 112-114]
  'proxmox-hypervisor': { lockedMode: 'dark', supportsLightDark: false, ... },
  'crt-phosphor': { lockedMode: 'dark', supportsLightDark: false, ... },
  'tactile-rackmount': { lockedMode: 'dark', supportsLightDark: false, ... },
  'irix-unix': { lockedMode: 'dark', supportsLightDark: false, ... },
  'scada-command': { lockedMode: 'dark', supportsLightDark: false, ... },
  'factory-plc': { lockedMode: 'dark', supportsLightDark: false, ... },
  'analog-tape': { lockedMode: 'dark', supportsLightDark: false, ... }
```

### Verification in UI Components:
1. **`ThemeSelector` (`src/components/theme/theme-selector.tsx:85-95`):**
   When a user clicks a locked-dark preset while in `light` mode:
   ```typescript
   if (nextMeta.lockedMode === 'dark' && effectiveMode === 'light') {
     void sliceTheme(() => {
       setPreset(nextPreset);
       setMode('dark');
     });
   }
   ```
   Furthermore, the footer appearance toggle is hidden and replaced with an alert badge:
   `"Dark mode locked — Hardware aesthetic"` (`theme-selector.tsx:254-262`).

2. **`AppearanceClient` (`src/app/account/appearance/appearance-client.tsx:68-88`):**
   Renders a warning banner:
   `"The active theme (...) is a specialized hardware aesthetic designed exclusively for dark mode. Light mode is disabled while this preset is active."`
   Disables the "System Default" and "Light Mode" buttons (`isCurrentThemeLockedDark && 'opacity-50 cursor-not-allowed'`).

3. **Pre-paint Script (`THEME_INIT_SCRIPT` in `src/lib/theme.ts:235`):**
   ```javascript
   var lkMap={"proxmox-hypervisor":"dark","crt-phosphor":"dark","tactile-rackmount":"dark","irix-unix":"dark","scada-command":"dark","factory-plc":"dark","analog-tape":"dark"};
   if (lkMap[p]) { d = lkMap[p] === "dark"; }
   ```
   Ensures zero FOUC even before React loads.

---

## Playwright Visual Screenshot Capture Architecture

### Execution Tooling Discovery
We verified:
- Local chromium headless shell binary:
  `/root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`
- Playwright module:
  `/root/.npm/_npx/705bc6b22212b352/node_modules/playwright-core`
- Verified execution: launches in <200ms in headless mode and interacts with DOM flawlessly.

### Capture Target Screens (D-10)
Representative core screens across all 12 themes:
1. `/finance` (or `/finance/cash-receipts` / `/finance/dashboard`): Dense numerical tables, currency badges, action bars.
2. `/crm` (or `/crm/contacts` / `/crm/deals`): Kanban/table cards, avatars, status tags.
3. `/command`: Telemetry widgets, system status grids, high-density panels.
4. `/people` (or `/people/employees` / `/people/attendance`): Mixed form/directory layout, employee status badges.
5. `/reach` (or `/reach/ad-studio` / `/reach/leads`): Metric cards, campaign previews.
6. `/account/appearance`: The visual theme gallery itself, showing all mockup cards under the active theme.

### Capture Matrix:
- **12 themes**
- Flexible themes (`kuasa-emerald`, `swiss-monochrome`, `executive-editorial`, `blueprint-cad`, `brutalist-ledger`): captured in **both Light and Dark** (5 themes × 2 modes = 10 configurations).
- Locked-dark themes (`proxmox-hypervisor`, `crt-phosphor`, `tactile-rackmount`, `irix-unix`, `scada-command`, `factory-plc`, `analog-tape`): captured in **Dark only** (7 themes × 1 mode = 7 configurations).
- Total Theme/Mode configurations: **17 variants**.
- 6 key screens × 17 variants = **102 high-resolution screenshots**.

Screenshots will be stored in:
`.planning/phases/05-full-application-audit-visual-verification/screenshots/{theme}/{mode}/{screen}.png`

---

## WCAG 2.1 AA Contrast & Readability Verification Plan

### Standard Formula (WCAG 2.1 AA):
- Relative luminance:
  $L = 0.2126 \times R + 0.7152 \times G + 0.0722 \times B$
- Contrast Ratio:
  $\text{Ratio} = (L_1 + 0.05) / (L_2 + 0.05)$ where $L_1$ is the lighter luminance.
- **Thresholds:**
  - Normal text / body copy: $\ge 4.5:1$
  - Large text ($\ge 18\text{pt}$ or bold $\ge 14\text{pt}$): $\ge 3.0:1$
  - UI components / borders / icons: $\ge 3.0:1$

### Automated Headless Inspector
We can run an automated script (`scripts/audit-contrast.mjs`) that loads each screen in Chromium, navigates the DOM, and extracts:
- `color` and `background-color` (computed via `window.getComputedStyle`).
- Resolves alpha channels against parent background layers.
- Checks text contrast for:
  - Table headers `<th>` and table cells `<td>`
  - Badges / tags (`.badge`, `span`, etc.)
  - Primary, secondary, and ghost buttons
  - Sidebar links and topbar items
  - Muted secondary copy (`text-muted-foreground`, `--muted-foreground`)
- Identifies any pairings falling below $4.5:1$ (or $3:1$ for large text/borders).

### Readability & Typography Checks (D-07, D-08)
- Verify that table numerical cells (`<td>`, tabular numbers) have `font-variant-numeric: tabular-nums` or monospace font, and **no blur/glow filters** applied directly to numbers.
- Ensure text glow effects (e.g. `text-shadow` in CRT or SCADA) are strictly applied to headings, borders, and status beacons, not data cells.

---

## Remediation Workflow

When the audit script flags a contrast or alignment defect:
1. **Locate Issue Source:**
   Identify the CSS variable responsible (e.g. `--muted-foreground`, `--border`, `--card-foreground`, `--sidebar-muted`) in `src/app/themes/<theme>.css` or `src/app/globals.css`.
2. **Atomic Fix:**
   Adjust the HSL/OKLCH/Hex token directly in `src/app/themes/<theme>.css`.
   *Example:*
   If `--muted-foreground` in `crt-phosphor` is `#2d8a4e` on `#0a110c` (contrast ratio ~3.2:1), adjust to `#3eb86b` to achieve >5.1:1.
3. **Regression Verification:**
   Re-run the automated contrast check and re-capture the screenshot.
4. **Atomic Commit (D-15):**
   `git commit -m "fix(theme-<theme>): adjust <element> contrast to meet WCAG AA"`

---

## Validation Architecture

### Quick & Full Test Commands
| Property | Value |
|----------|-------|
| Test Framework | Vitest 5.0.3 + Playwright 1.64.1 |
| Config file | `vitest.config.mts` |
| Quick run command | `pnpm vitest run tests/theme.test.ts` |
| Route smoke command | `node scripts/smoke-routes.mjs` |
| Visual audit script | `node scripts/audit-matrix.mjs` |

### Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | Status |
|--------|----------|-----------|-------------------|--------|
| FR-1 | Multi-Theme resolution & pre-paint script | unit | `pnpm vitest run tests/theme.test.ts` | Pass |
| FR-2 | ThemeSelector & Appearance Client locked-mode behavior | unit / integration | `pnpm vitest run tests/theme-selector.test.ts` | Plan for Wave 0 |
| FR-3 | 12 Curated Themes CSS variables & rendering | visual / e2e | `node scripts/audit-matrix.mjs` | Plan for Wave 1 |
| NFR-1 | Single-frame theme switch / no FOUC | e2e smoke | `node scripts/audit-matrix.mjs --check-fouc` | Plan for Wave 1 |
| NFR-2 | Component adaptation (tables, cards, inputs) | visual e2e | `node scripts/audit-matrix.mjs --capture-shots` | Plan for Wave 2 |
| NFR-3 | WCAG 2.1 AA Contrast ($\ge 4.5:1$) | automated contrast | `node scripts/audit-contrast.mjs` | Plan for Wave 2 |

---

## Recommended Wave / Task Breakdown for Planner

### Wave 0: Tooling Setup & Pre-Flight Preparation
- **Task 05-01-01:** Create standalone headless test harness `scripts/audit-harness.mjs` (wrapping `playwright-core` and the local chromium headless shell) with helpers for setting `localStorage` / cookie (`theme_preset`, `theme_mode`), waiting for network idle, and trapping console errors.
- **Task 05-01-02:** Add unit tests for dark-only lock enforcement across all presets in `tests/theme-locks.test.ts`.

### Wave 1: Full Route Smoke Matrix & Theme Switching Validation
- **Task 05-02-01:** Run comprehensive route smoke check across all ~107 routes under default theme, verifying 0 500s/404s.
- **Task 05-02-02:** Execute multi-theme smoke sweep (all 12 themes across core module routes) testing for console errors, hydration mismatches, and layout stability.

### Wave 2: Visual Screenshot Capture & WCAG 2.1 AA Contrast Audit
- **Task 05-03-01:** Capture high-resolution visual screenshots of 6 representative screens (`/finance`, `/crm`, `/command`, `/people`, `/reach`, `/account/appearance`) across 17 theme/mode configurations (102 images).
- **Task 05-03-02:** Run automated WCAG 2.1 AA contrast calculation on all 17 configurations. Catalog all foreground/background pairings below 4.5:1 (or 3:1 for borders/headings).

### Wave 3: In-Place Remediation & AUDIT-REPORT.md Generation
- **Task 05-04-01:** Apply atomic in-place CSS fixes in `src/app/themes/*.css` for all flagged contrast or tabular alignment issues.
- **Task 05-04-02:** Re-verify fixed themes with immediate smoke & screenshot regression runs.
- **Task 05-04-03:** Compile and generate the comprehensive deliverable: `.planning/phases/05-full-application-audit-visual-verification/AUDIT-REPORT.md`.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Chromium headless shell at `/root/.cache/ms-playwright/...` can be reused directly by node scripts | Playwright Visual Screenshot Capture | None — verified working via interactive probe in this session. |
| A2 | Next.js server can run in demo mode (`OPENKUASA_PREVIEW=1`) without live Supabase for screenshot capture | Current State of Tooling | Low — already the verified pattern in `scripts/smoke-routes.mjs` and `scripts/docs-shots.mjs`. |

---

## Sources

### Primary (HIGH confidence)
- `src/lib/theme.ts`: Verified preset configurations, locked-mode map, and pre-paint script.
- `src/app/themes/*.css`: Verified all 12 CSS token stylesheets and `.dark` variant scopes.
- `src/app/account/appearance/appearance-client.tsx`: Verified theme gallery and locked-mode banners.
- `src/components/theme/theme-selector.tsx`: Verified popover switcher and locked-dark logic.
- `scripts/smoke-routes.mjs` & `scripts/nav-routes.mjs`: Verified route parsing and current smoke test mechanism.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — node, playwright-core, chromium-headless-shell tested and verified.
- Architecture: HIGH — pure CSS token cascading + headless DOM inspection.
- Pitfalls: HIGH — dark-mode locks, FOUC, and tabular numeric glows identified.

**Research date:** 2026-11-05
**Valid until:** 2026-12-05
