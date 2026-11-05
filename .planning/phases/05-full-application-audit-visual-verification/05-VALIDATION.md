---
phase: "05"
slug: "full-application-audit-visual-verification"
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-11-05"
---

# Phase 05 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 5.0.3 + Playwright 1.64.1 (playwright-core with Chromium Headless Shell) |
| **Config file** | `vitest.config.mts` |
| **Quick run command** | `pnpm vitest run tests/theme.test.ts tests/theme-fonts.test.ts tests/theme-widgets.test.ts` |
| **Full suite command** | `pnpm vitest run && node scripts/smoke-routes.mjs && node scripts/audit-matrix.mjs` |
| **Estimated runtime** | ~15-30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run tests/theme.test.ts`
- **After every plan wave:** Run `pnpm vitest run && node scripts/smoke-routes.mjs`
- **Before `/gsd-verify-work`:** Full suite must be green, visual audit reports and screenshots generated
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | FR-1, FR-2 | T-05-01 | Locked themes prevent dark-mode bypass | unit / integration | `pnpm vitest run tests/theme-locked-modes.test.ts` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 1 | FR-3, NFR-1 | T-05-02 | Cookie injection validation across all 107 routes | smoke matrix | `node scripts/smoke-matrix.mjs` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 2 | NFR-2, NFR-3 | T-05-03 | Playwright headless snapshot capture across 17 variants | visual e2e | `node scripts/capture-visual-audit.mjs` | ❌ W0 | ⬜ pending |
| 05-02-02 | 02 | 2 | NFR-3 | T-05-04 | WCAG 2.1 AA luminance contrast assertions ($\ge 4.5:1$) | contrast audit | `node scripts/audit-contrast.mjs` | ❌ W0 | ⬜ pending |
| 05-03-01 | 03 | 3 | FR-3, NFR-2, NFR-3 | T-05-05 | In-place CSS remediation & regression verification | full regression | `node scripts/audit-contrast.mjs && node scripts/smoke-matrix.mjs && npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/theme-locked-modes.test.ts` — Tests verifying lockedMode definitions and theme state machine constraints
- [ ] `scripts/smoke-matrix.mjs` — Multi-theme matrix route crawler verifying HTTP 200/302 and zero exceptions
- [ ] `scripts/capture-visual-audit.mjs` — Automated Playwright script capturing core application screens
- [ ] `scripts/audit-contrast.mjs` — Automated WCAG contrast calculator and audit reporter

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Immersive feel and subjective styling aesthetics | FR-3, NFR-2 | Human visual design appraisal | Inspect captured screenshots in `.planning/phases/05-full-application-audit-visual-verification/screenshots/` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
