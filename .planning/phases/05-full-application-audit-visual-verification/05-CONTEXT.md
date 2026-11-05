# Phase 5: Full Application Audit & Visual Verification - Context

**Gathered:** 2026-11-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Rigorously audit, smoke test, and visually verify all core OpenKuasa modules and application routes across all 12 curated themes in both dark and light modes (with dark-mode locks respected for dedicated terminal/telemetry themes). Catalog all regressions, execute in-place atomic fixes for high/medium contrast or layout issues in theme CSS layers, and produce a comprehensive AUDIT-REPORT.md with representative Playwright screenshots.

</domain>

<decisions>
## Implementation Decisions

### Audit Scope & Module Priority
- **D-01:** Comprehensive Route Audit Scope — Audit all application navigation routes (`nav-routes.mjs` and `/account/*`, totaling ~30+ routes) including every nested tab and sub-route across all 12 themes.
- **D-02:** User Workflow Theme Switching Validation — Validate theme switching through topbar ThemeSelector and `/settings/appearance` workflows to ensure authentic real-world persistence and zero-FOUC behavior.
- **D-03:** Full UI Component Spectrum Inspection — Audit data tables, grids, status badges, form inputs, buttons, modals, drawers, dropdowns, tooltips, navigation sidebars, and tactile widgets across screens.
- **D-04:** Dual-Variant Coverage — Test all 12 themes in both Dark and Light variants, except for themes with explicit dark-only locks.

### Contrast, Readability & Dark/Light Edge Cases
- **D-05:** Strict WCAG 2.1 AA Compliance — Enforce minimum 4.5:1 contrast for body copy and 3:1 for UI borders/headings across all active themes and states.
- **D-06:** Dark-Only Lock for CRT Phosphor, SCADA Command, and Proxmox Hypervisor — Lock these three themes strictly to dark mode (disable light toggle or auto-force dark) to preserve their authentic terminal/telemetry design identities. — **Reversibility:** costly — (Touches `src/lib/theme.ts` preset definitions and appearance toggle UI).
- **D-07:** Sharp Numerical & Tabular Data — Confine text glows, scanlines, and raster overlays strictly to decorative headings, badges, and canvas borders; keep data cells, numbers, and inputs un-blurred and razor sharp.
- **D-08:** Strict Font Enforcement — Apply the theme's signature font (e.g., Newsreader serif, Silkscreen/VT323, JetBrains Mono, Space Grotesk) across all UI elements including tables and inputs to preserve complete immersion.

### Automated vs Visual/Manual Inspection Strategy
- **D-09:** Extended Smoke Route Runner — Extend `scripts/smoke-routes.mjs` to systematically iterate through all routes under each theme via cookie/storage state, asserting HTTP 200 and zero console/runtime exceptions.
- **D-10:** Automated Screenshot Visual Captures — Utilize Playwright to capture high-resolution visual snapshots of representative core screens (`/finance`, `/crm`, `/command`, `/people`, `/reach`, `/settings/appearance`) across all 12 themes for audit review.
- **D-11:** Zero-Tolerance Pass Criteria — A route or screen passes only with zero 500/404 errors, zero React hydration mismatches, zero FOUC flashes, and zero layout overflows.
- **D-12:** Structured Audit Report Deliverable — Produce a formal `.planning/phases/05-full-application-audit-visual-verification/AUDIT-REPORT.md` documenting route-by-route pass/fail status, contrast scores, and any visual quirks.

### Handling Theme-Specific Anomalies & Remediation Policy
- **D-13:** In-Place High/Medium Remediation — Automatically fix contrast failures, broken layouts, or missing CSS variables in-place during Phase 5 execution; catalog minor subjective notes in AUDIT-REPORT.md.
- **D-14:** Non-Invasive CSS Layer Fixes — Apply all styling fixes inside `src/app/globals.css` or scoped theme files in `src/app/themes/*.css` (`[data-theme='...']`), preserving base component code and JSX clean.
- **D-15:** Atomic Git Commits — Record each theme or module fix with an atomic commit (e.g. `fix(theme-crt): adjust badge contrast on finance table`).
- **D-16:** Immediate Regression Verification — Immediately re-run smoke tests and re-capture visual screenshots following any CSS fix to verify that the regression is resolved cleanly.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Standards & Architecture
- `.planning/ROADMAP.md` — Phase 5 goal, scope, and milestones.
- `.planning/REQUIREMENTS.md` §FR-1, §FR-2, §FR-3, §NFR-1, §NFR-2, §NFR-3 — Requirements for multi-theme engine, selector, curated themes, and WCAG AA contrast standards.
- `.planning/THEMES_LIST.md` — Master specification for all 12 curated themes, typography, colors, and personalities.
- `DESIGN.md` & `.impeccable/design.json` — OpenKuasa design system guidelines and tokens.

### Theme & Route Implementations
- `src/lib/theme.ts` — Theme preset constants, storage, and theme script logic.
- `src/app/globals.css` — Global CSS variables and Tailwind 4 theme bridge.
- `src/app/themes/*.css` — Modular CSS token files per theme preset.
- `scripts/nav-routes.mjs` — Navigation route enumeration for all OpenKuasa products.
- `scripts/smoke-routes.mjs` — Automated route health verification harness.
- `sample_themes/` — 10 reference HTML prototypes for visual parity verification.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/smoke-routes.mjs`: Node.js smoke test script testing live server routes against status codes 200/3xx. Can be extended to inject theme cookies (`theme_preset`) and run matrix sweeps.
- `scripts/nav-routes.mjs`: Utility exporting `navEntries()` for all product modules and account sub-routes.
- `src/lib/theme.ts`: `THEME_PRESETS`, `THEME_PRESET_KEY`, and `getResolvedTheme()` helpers.
- `src/components/theme/theme-selector.tsx`: Interactive theme popover with visual swatches.
- `src/app/(app)/settings/appearance/page.tsx`: Full appearance gallery and theme customizer.

### Established Patterns
- `data-theme="<theme-id>"` on `<html>` element controls styling cascading to CSS variables.
- Pure CSS layer separation: individual theme rules live in `src/app/themes/*.css` and `src/app/globals.css` without polluting JSX component files.

### Integration Points
- Playwright screenshot test script integration targeting running Next.js instance on port 3000/3100.
- Extended `scripts/smoke-routes.mjs` adding multi-theme cookie iteration.
- Output destination: `.planning/phases/05-full-application-audit-visual-verification/AUDIT-REPORT.md`.

</code_context>

<specifics>
## Specific Ideas

- Focus screenshot comparisons on dense data pages like Finance Cash Book (`/finance/cash-book`), CRM Leads (`/crm/leads`), and Appearance Gallery (`/settings/appearance`).
- Lock CRT Phosphor, SCADA Command, and Proxmox Hypervisor to dark mode by preventing light-mode toggles when those presets are active.

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed strictly within the audit and verification scope of Phase 5.

</deferred>

---

*Phase: 5-Full Application Audit & Visual Verification*
*Context gathered: 2026-11-05*
