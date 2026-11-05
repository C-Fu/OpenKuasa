# Plan: Phase 1 — Multi-Theme Engine & Storage Architecture

## Phase Goal
Build the foundation for multi-theme switching without FOUC, extending `src/lib/theme.ts` to support both theme presets and light/dark modes while preserving complete backward compatibility with existing toggles, layouts, and animations.

## Context & Inputs
- **Context:** `.planning/phases/01-multi-theme-engine-storage-architecture/01-CONTEXT.md`
- **Research:** `.planning/phases/01-multi-theme-engine-storage-architecture/01-RESEARCH.md`
- **Existing Implementation:** `src/lib/theme.ts`, `src/components/theme/theme-toggle.tsx`, `src/app/layout.tsx`

---

## Tasks

### Task 1: Extend Theme Types, Constants & Core Resolution Utilities
**Files to modify:** `src/lib/theme.ts`
- Define `ThemePreset` union covering all 12 presets (`kuasa-emerald`, `proxmox-hypervisor`, `swiss-monochrome`, `crt-phosphor`, `executive-editorial`, `tactile-rackmount`, `blueprint-cad`, `irix-unix`, `scada-command`, `factory-plc`, `brutalist-ledger`, `analog-tape`).
- Define `ThemeMode` (`'light' | 'dark' | 'system'`).
- Define `THEME_PRESET_KEY = 'theme_preset'` and `THEME_MODE_KEY = 'theme_mode'`, retaining `THEME_KEY = 'theme'` as backward-compatible fallback.
- Define `THEME_PRESETS` registry with metadata (name, description, mode locking / hybrid support).
- Implement resolution functions: `resolveThemePreset()`, `resolveThemeMode()`, `resolveEffectiveMode()`.
- Implement DOM stamping: `applyThemeState(preset, mode)` which updates `data-theme` attribute and toggles `.dark` class.
- Preserve legacy `Theme`, `resolveTheme()`, `applyTheme()`, `saveTheme()`, `subscribeTheme()`, `isDarkSnapshot()` as drop-in backwards-compatible wrappers.

### Task 2: Implement Reactive Store & Zero-FOUC Inlined Script
**Files to modify:** `src/lib/theme.ts`, `src/app/layout.tsx`
- Update `THEME_INIT_SCRIPT` string to synchronously read `localStorage` (`theme_preset`, `theme_mode`, fallback `theme`), evaluate `prefers-color-scheme`, stamp `document.documentElement.setAttribute('data-theme', preset)` and toggle `classList.toggle('dark', isDark)`.
- Implement `useTheme()` hook using React 19 `useSyncExternalStore` observing `document.documentElement` (`attributeFilter: ['class', 'data-theme']`) and system media query changes.
- Ensure `<head>` in `src/app/layout.tsx` continues rendering `THEME_INIT_SCRIPT` with proper nonce.

### Task 3: Unit Testing Suite & Vitest Verification
**Files to create:** `tests/theme.test.ts`
- Mock `localStorage`, `window.matchMedia`, and `MutationObserver`.
- Test default fallback behavior (returns `kuasa-emerald` and system dark/light).
- Test storage reads and writes for preset and mode.
- Test signature locked themes (e.g. `crt-phosphor` resolving effective mode to `dark`).
- Test eval of `THEME_INIT_SCRIPT` in simulated DOM to ensure zero-FOUC attribute stamping works identically to the TS implementation.
- Run `pnpm test` (or `vitest run tests/theme.test.ts`) to ensure 100% test pass.

---

## Verification Criteria
- [ ] `src/lib/theme.ts` exports `useTheme`, `THEME_PRESETS`, `resolveThemePreset`, `resolveThemeMode`, and all legacy functions.
- [ ] `THEME_INIT_SCRIPT` correctly stamps `data-theme` and `dark` class without errors in `<head>`.
- [ ] `tests/theme.test.ts` passes with full coverage over resolution, storage, and legacy compatibility.
- [ ] `pnpm build` succeeds without TypeScript errors.
