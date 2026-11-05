# Phase 5: Full Application Audit & Visual Verification - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-11-05
**Phase:** 5-Full Application Audit & Visual Verification
**Areas discussed:** Audit Scope & Module Priority, Contrast & Extreme Themes, Inspection Strategy, Remediation Policy

---

## Audit Scope & Module Priority

| Option | Description | Selected |
|--------|-------------|----------|
| 5 Core Modules + Appearance | Focus primarily on Finance, People, CRM, Reach, Command, Settings/Appearance | |
| All Nav-Routes (~30+ routes) | Audit all nav-routes including every nested tab and sub-route | ✓ |
| Representative High-Density Sample | Test Finance Ledger, CRM Pipeline, Appearance Gallery only | |

**User's choice:** All Nav-Routes (~30+ routes) including every nested tab and sub-route.
**Notes:** User also decided to audit the full component spectrum (tables, forms, buttons, modals, dropdowns, navigation sidebars) using topbar selector and appearance workflows, covering both dark and light variants across all 12 themes (with dark locks respected).

---

## Contrast, Readability & Dark/Light Edge Cases

| Option | Description | Selected |
|--------|-------------|----------|
| Strict WCAG 2.1 AA | 4.5:1 body copy, 3:1 UI boundaries/headings across all supported states | ✓ |
| Relaxed for glows/drafting lines | Ambiance takes precedence over strict contrast | |
| WCAG AAA (7:1) | Required for high-density tabular modules | |

**User's choice:** Strict WCAG 2.1 AA.
**Notes:** User chose to lock CRT Phosphor, SCADA Command, and Proxmox Hypervisor strictly to dark mode. Confine glow effects/scanlines strictly to decorative headers/borders, and enforce theme primary fonts everywhere including tables/inputs.

---

## Automated vs Visual/Manual Inspection Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Extend scripts/smoke-routes.mjs | Sweep all routes under multiple themes via cookie/query headers, asserting 200 OK + no console errors | ✓ |
| Dedicated vitest test file | tests/theme-audit.test.ts evaluating tokens and contrast | |
| Run both | Automated smoke sweep + vitest token test | |

**User's choice:** Extend scripts/smoke-routes.mjs to sweep all routes under multiple themes via cookie/query headers, asserting 200 OK + no console errors.
**Notes:** Playwright screenshot capture across representative routes for visual inspection. Zero tolerance for 500/404, hydration mismatches, FOUC, or overflow. Produce structured AUDIT-REPORT.md.

---

## Handling Theme-Specific Anomalies & Remediation Policy

| Option | Description | Selected |
|--------|-------------|----------|
| In-place fix for high/medium bugs | Fix contrast failures, broken layout, missing variables in-place; catalog minor quirks in report | ✓ |
| Pure audit only | Log all issues without touching code | |
| Fix all issues in-place | Fix everything regardless of severity | |

**User's choice:** In-place fix for high/medium severity bugs.
**Notes:** Fixes must be applied non-invasively in CSS variable / theme style layers (`globals.css` or `themes/*.css`). Use atomic git commits per fix, and immediately verify regressions with re-runs and re-snapshots.

---

## the agent's Discretion

- Minor subjective visual polish and non-contrast quirks cataloged in AUDIT-REPORT.md.
- Choice of representative snapshot viewport sizes for Playwright captures.

## Deferred Ideas

- None — all topics discussed were directly within the Phase 5 verification boundary.
