# Phase 1: Multi-Theme Engine & Storage Architecture — Context & Decisions

## Overview & Scope
Phase 1 establishes the client-side architecture and runtime engine for OpenKuasa's Multi-Theme System. It upgrades the existing binary theme switcher (`src/lib/theme.ts`) into an extensible engine supporting curated design systems, zero-flicker hydration, and reactive state synchronization across all application surfaces.

## Key Decisions

### 1. Preset vs. Mode Orthogonality (Hybrid Model)
- **Hybrid Presentation**:
  - Baseline themes (e.g. `kuasa-emerald`, `swiss-monochrome`, `executive-editorial`) support both **Light** and **Dark** variants with purpose-crafted color palettes for each mode.
  - Dedicated retro, industrial, and hardware simulation themes (e.g. `crt-phosphor`, `irix-unix`, `scada-command`, `tactile-rackmount`) feature their own signature presentation (predominantly high-contrast dark/phosphor/chiseled) where toggling light/dark retains the theme's core structural aesthetic or locks to its signature mode.
- **Attributes on `<html>`**:
  - `data-theme="<theme-id>"` (e.g. `kuasa-emerald`, `proxmox-hypervisor`, `crt-phosphor`, etc.)
  - `class="dark"` (present when in dark mode, absent when in light mode)

### 2. Hydration & Storage Strategy
- **Storage**:
  - Primary preset stored in `localStorage` under `theme_preset` (default: `kuasa-emerald`).
  - Mode stored under `theme_mode` (default: system preference / `dark` fallback).
- **Zero-FOUC Inlined Script (`THEME_INIT_SCRIPT`)**:
  - Runs in `<head>` before first paint.
  - Synchronously reads `localStorage` and stamps `document.documentElement.setAttribute('data-theme', preset)` and toggles `.dark`.
  - Ensures instantaneous paint without color flashes or hydration mismatches.
- **React State Store**:
  - Managed via `useSyncExternalStore` observing `MutationObserver` on `document.documentElement` attributes (`data-theme` and `class`).
  - Exposes `useTheme()` hook returning `{ theme, mode, setTheme, setMode, isDark }`.

### 3. Module Scope & Theme Dominance
- **Strict Theme Dominance**:
  - The active theme controls ALL colors, surfaces, typography, and borders across the system.
  - When a curated theme is active, it takes precedence over default module accents (`[data-product="..."]`), ensuring a fully immersive, cohesive design experience that completely transforms the entire interface without disjointed legacy color leakage.
- **Keris Slice View Transitions**:
  - Retain the signature keris slice animation for light/dark mode transitions, smoothly animating theme attribute mutations when the View Transitions API is supported.

## Interfaces & Contracts

### `src/lib/theme.ts`
```typescript
export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemePreset =
  | 'kuasa-emerald'
  | 'proxmox-hypervisor'
  | 'swiss-monochrome'
  | 'crt-phosphor'
  | 'executive-editorial'
  | 'tactile-rackmount'
  | 'blueprint-cad'
  | 'irix-unix'
  | 'scada-command'
  | 'factory-plc'
  | 'brutalist-ledger'
  | 'analog-tape';

export interface ThemeConfig {
  id: ThemePreset;
  name: string;
  description: string;
  supportsLightDark: boolean;
  defaultMode?: 'light' | 'dark';
}
```

## Deferred Ideas (Out of Scope for Phase 1)
- Rich UI selector dropdown popover (Phase 3).
- Individual CSS token definitions and sample HTML porting for all 11 themes (Phase 2 & Phase 4).
- User custom arbitrary hex-code palette creator (deferred to future roadmap).
