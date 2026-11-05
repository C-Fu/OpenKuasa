---
phase: "04-curated-themes-implementation-sample-parity"
plan: "01"
subsystem: "ui/theme-engine"
tags:
  - themes
  - typography
  - google-fonts
  - skeuomorphism
  - textures
status: complete
requires:
  - "02-01"
  - "02-02"
provides:
  - "Google Fonts integration in root layout"
  - "Authentic typography variable mapping across 12 curated themes"
  - "Scoped skeuomorphic CSS bevels, scanlines, and grids"
affects:
  - "src/app/layout.tsx"
  - "src/app/globals.css"
  - "src/app/themes/*.css"
tech-stack:
  added:
    - "next/font/google"
  patterns:
    - "Scoped skeuomorphic CSS overrides using [data-theme='...']"
    - "Zero-FOUC self-hosted webfont variable cascade"
    - "GPU-accelerated pure CSS textures with pointer-events: none"
key-files:
  created:
    - "tests/theme-fonts.test.ts"
  modified:
    - "src/app/layout.tsx"
    - "src/app/globals.css"
    - "src/app/themes/kuasa-emerald.css"
    - "src/app/themes/proxmox-hypervisor.css"
    - "src/app/themes/swiss-monochrome.css"
    - "src/app/themes/crt-phosphor.css"
    - "src/app/themes/executive-editorial.css"
    - "src/app/themes/tactile-rackmount.css"
    - "src/app/themes/blueprint-cad.css"
    - "src/app/themes/irix-unix.css"
    - "src/app/themes/scada-command.css"
    - "src/app/themes/factory-plc.css"
    - "src/app/themes/brutalist-ledger.css"
    - "src/app/themes/analog-tape.css"
decisions:
  - "D-05/D-06: Preloaded 10 deduplicated Google Fonts in src/app/layout.tsx with official next/font/google, specifying weight: '400' on fixed-weight VT323 and Share_Tech_Mono."
  - "D-01/D-03: Scoped 3D outset chisel bevels, active depressions, and sunken input fields in irix-unix.css without mutating shadcn JSX."
  - "D-02/D-11: Implemented pure CSS scanlines on CRT Phosphor and SCADA Command consoles using pointer-events: none and contrast protection (text-shadow: none on tables, inputs, codes)."
  - "D-04/D-11: Implemented dual-gradient CAD coordinate drafting grids in blueprint-cad.css and strict zero-radius with ledger row striping in brutalist-ledger.css."
metrics:
  duration: "11m"
  completed: "2026-11-05"
actuals:
  tokens: 45000
  tasks: 2
  commits: 2
plan_head_before: "e36623e"
plan_head_after: "9b2be96"
---

# Phase 04 Plan 01: Typography Pipeline & Scoped Skeuomorphic Theming Summary

Implemented the Next.js `next/font/google` typography pipeline in the root layout and established authentic scoped skeuomorphic styling, directional 3D chisel bevels, pure CSS scanlines, phosphor glows, and CAD coordinate grids across all 12 curated themes in `src/app/themes/*.css`.

## Overview

1. **Wave 0 Test Verification (`tests/theme-fonts.test.ts`):** Created a Vitest test suite that validates font declarations in `src/app/layout.tsx`, checks fixed-weight configurations (`weight: '400'`), and verifies that all 12 theme presets reference the appropriate font tokens (`--font-sans`, `--font-mono`, `--font-heading`).
2. **Typography Pipeline (`src/app/layout.tsx`):** Instantiated all 10 deduplicated Google Fonts (`Lexend`, `Inter`, `Space_Grotesk`, `Newsreader`, `IBM_Plex_Sans`, `IBM_Plex_Mono`, `JetBrains_Mono`, `Chivo_Mono`, `Share_Tech_Mono`, `VT323`) along with `Geist_Mono` via Next.js built-in font optimization and bound their variables directly to `<html>`.
3. **Theme Presets Typography (`src/app/themes/*.css`):** Mapped `--font-sans`, `--font-mono`, and `--font-heading` to their respective Google Font variables across all 12 presets without FOUC.
4. **Scoped Skeuomorphic Personality & Textures:**
   - **IRIX 4Dwm:** SGI desktop stipple background, 3D outset chisel borders on cards and buttons, active depression transforms (`translate(1px, 1px)`), and sunken form inputs.
   - **Tactile Rackmount:** Recessed chassis panel gradients, stamped metallic button borders, and `.hex-screw` / `.screw-head` radial hardware indicator utilities.
   - **CRT Phosphor & SCADA Command:** Repeating scanline overlay with `pointer-events: none` and `z-index: 50`, ambient green/amber text glow on headings and badges, and sharp contrast protection (`text-shadow: none`) on tables, inputs, and code elements.
   - **Blueprint CAD:** Dual cyanotype coordinate drafting grids (100px major, 20px minor) and technical hairline precision card borders.
   - **Brutalist Ledger:** Strict zero-radius enforcement (`--radius: 0px !important`), heavy 2px structural borders, and alternating accounting ledger row striping.
   - **Analog Tape & Factory PLC:** Warm brushed aluminum chassis textures and rugged industrial panel outlines.
5. **Global Utilities (`src/app/globals.css`):** Registered reusable utility classes `.scanline-overlay`, `.cad-grid-bg`, and `.phosphor-glow` under `@layer utilities`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] TypeScript regex flag compatibility in test file**
- **Found during:** Verification step (`npx tsc --noEmit`)
- **Issue:** The `/s` regular expression flag in `tests/theme-fonts.test.ts` triggered TS1501 because the tsconfig target is earlier than es2018.
- **Fix:** Refactored regex patterns to use `[\s\S]*?` instead of `[^}]*` with the `/s` flag.
- **Files modified:** `tests/theme-fonts.test.ts`
- **Commit:** `9b2be96`

## Verification Results

- `npx vitest run tests/theme-fonts.test.ts` — 5/5 passed (100%)
- `npx vitest run tests/theme.test.ts` — 17/17 passed (100%)
- `npx tsc --noEmit` — Clean (0 errors)

## Commits

- `dd249d0`: feat(04-01): end-to-end typography pipeline and google fonts integration
- `9b2be96`: feat(04-01): scoped skeuomorphic styling, bevels, scanlines, and grid textures

## Self-Check: PASSED
- FOUND: tests/theme-fonts.test.ts
- FOUND: src/app/layout.tsx
- FOUND: src/app/globals.css
- FOUND: src/app/themes/irix-unix.css
- FOUND: src/app/themes/crt-phosphor.css
- FOUND: src/app/themes/scada-command.css
- FOUND: src/app/themes/blueprint-cad.css
- FOUND: src/app/themes/tactile-rackmount.css
- FOUND: src/app/themes/brutalist-ledger.css
- FOUND: src/app/themes/analog-tape.css
- FOUND: commit dd249d0
- FOUND: commit 9b2be96
