---
phase: "03"
slug: "interactive-theme-selector-component-header-integration"
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-11-05"
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 5.0.3 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run tests/theme.test.ts tests/theme-css.test.ts tests/account-nav.test.ts` |
| **Full suite command** | `npx vitest run tests/theme.test.ts tests/theme-css.test.ts tests/account-nav.test.ts tests/theme-selector.test.ts` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run tests/theme.test.ts tests/theme-css.test.ts tests/account-nav.test.ts`
- **After every plan wave:** Run `npx vitest run && pnpm build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | REQ-THEME-03 | T-03-01 | Strict whitelist validation via `isValidPreset` | unit | `npx vitest run tests/theme-selector.test.ts` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | REQ-THEME-03 | T-03-02 | Accessible ARIA attributes on popover trigger | component | `npx vitest run tests/theme-selector.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | REQ-UX-01 | — | Clean mount in AppTopbar, MarketingHeader, AccountShell | component | `npx vitest run tests/headers.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | REQ-UX-02 | — | Account navigation item registration | unit | `npx vitest run tests/account-nav.test.ts` | ✅ | ⬜ pending |
| 03-02-03 | 02 | 2 | REQ-UX-02 | — | Appearance route rendering with 12 theme gallery | smoke | `pnpm build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/theme-selector.test.ts` — Unit/Component tests for ThemeSelector rendering, category filtering, locked mode handling, and ARIA roles.
- [ ] `tests/account-nav.test.ts` — Update item count assertion from 15 to 16 for `Appearance` item.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Keris Slice View Transition | REQ-UX-01 | Canvas & View Transitions API animation verification | Click theme preset or mode switch in browser and observe directional keris slash animation across screen. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-11-05
