---
phase: "04"
slug: "curated-themes-implementation-sample-parity"
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-11-05"
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 5.0.3 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run tests/theme.test.ts` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run tests/theme*.test.ts`
- **After every plan wave:** Run `npm test -- --run && npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | REQ-THEME-FONTS | T-04-01 / — | Fonts loaded via official `next/font/google` | unit | `npx vitest run tests/theme-fonts.test.ts` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | REQ-THEME-CURATED | — | Scoped theme CSS rules, bevels, textures | unit / lint | `npx vitest run tests/theme.test.ts` | ✅ | ⬜ pending |
| 04-02-01 | 02 | 2 | REQ-THEME-PARITY | T-04-02 / — | ARIA attributes and sanitization on widgets | component | `npx vitest run tests/theme-widgets.test.ts` | ❌ W0 | ⬜ pending |
| 04-02-02 | 02 | 2 | REQ-THEME-PARITY | — | Interactive appearance gallery showcases widgets | build | `npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/theme-fonts.test.ts` — verifies font CSS variable resolution across all 12 themes
- [ ] `tests/theme-widgets.test.ts` — verifies unit functionality, variants, and ARIA accessibility of `src/components/theme-widgets/*`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| CRT Phosphor scanline & glow aesthetics | REQ-THEME-CURATED | Visual aesthetic rendering check in browser | Switch to CRT Phosphor in UI, verify subtle scanlines and ambient text glow |
| SGI IRIX 4Dwm window title & button bevels | REQ-THEME-CURATED | Tactile visual check | Switch to IRIX UNIX in UI, verify chisel 3D bevels and button depression |
| Blueprint CAD drafting registration marks & grid | REQ-THEME-CURATED | Visual aesthetic rendering check | Switch to Blueprint CAD, verify hairline coordinate grid and card crosshairs |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
