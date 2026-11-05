# Phase 3: Interactive Theme Selector Component & Header Integration - Research
**Researched:** 2026-11-05
**Domain:** React 19 Client Components, Radix UI Primitives, View Transitions (Keris Slice), Accessible Theme Switcher UX, Next.js Navigation
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Categorized Grid with Groups — Organize the 12 design systems into curated sections/tabs (e.g., 'Modern & Minimal', 'Retro & Workstation', 'Industrial & Hardware') for clean navigation.
- **D-02:** Mini Mockup Card Preview — Each theme item renders a tiny UI abstraction displaying authentic surface colors, header bar, sidebar strip, and card button matching the theme's palette.
- **D-03:** Integrated Popover with Quick Mode Toggle — Popover header includes theme search/filtering and categories; popover footer includes a quick Light/Dark toggle (badged or disabled with a tooltip for signature dark-locked themes).
- **D-04:** Trigger Button Appearance — Clean Lucide Palette icon button with active theme tooltip and subtle accent indicator dot.
- **D-05:** Popover Interaction Flow — Popover stays open upon selecting a theme so users can rapidly preview and compare multiple presets back-to-back.
- **D-06:** Unified Single Control — `ThemeSelector` completely replaces `ThemeToggle` across all headers, eliminating duplicate buttons while housing both preset switching and the light/dark toggle. — **Reversibility:** costly — (Replaces `ThemeToggle` call sites across `AppTopbar`, `MarketingHeader`, and `AccountShell`).
- **D-07:** Keris Slice Preservation — Toggling Light/Dark mode from within the ThemeSelector popover footer triggers the signature Keris slice animation.
- **D-08:** Preset Switch Transition — Selecting ANY theme preset also triggers the signature Keris slice screen transition for dramatic, seamless visual shifts.
- **D-09:** Mobile Screen Support — Keep the unified ThemeSelector icon button visible in the top header across all screen sizes (<640px and desktop) with touch-friendly 40px/44px target bounds.
- **D-10:** Mounted Surfaces — Integrates into `src/components/app/app-topbar.tsx`, `src/components/marketing/marketing-header.tsx`, and `src/components/account/account-shell.tsx`.
- **D-11:** Dedicated `/account/appearance` Route & View — Create a dedicated Appearance page and register `Appearance` in `src/config/account-nav.ts` under the first 'Account' section (alongside 'My profile', 'Security', 'Notifications') with a Palette icon.
- **D-12:** Large Interactive Theme Gallery — Full-page responsive grid of 12 rich mockup cards featuring live color chips, font specimens, archetype badges ('Retro Hardware', 'Modern Enterprise', etc.), and 1-click 'Apply Theme' actions.
- **D-13:** Dedicated Mode Card on Appearance Page — Top card on `/account/appearance` offering explicit System Default, Light, and Dark mode options with live Keris slice feedback.
- **D-14:** 1-Click Instant Apply & Persist — Clicking any theme preset immediately updates `data-theme` on `<html>`, synchronizes `localStorage` via `saveThemeState`, and triggers the Keris slice transition without requiring explicit modal confirmation.
- **D-15:** Signature Dark-Locked Theme Handling — When switching to a locked-dark theme (e.g., CRT Phosphor, IRIX Unix, SCADA Command) while in Light mode, automatically switch to Dark mode with an inline indicator notice ('This theme requires dark mode').

### the agent's Discretion
- Organization and categorisation names for the 12 themes (e.g. Modern & Minimal vs Retro Workstations vs Industrial Telemetry vs Classical Editorial).
- Visual composition of the mini mockup cards and large mockup cards (mockup layout, status dot positioning, color swatch chips).
- Component structure for Popover vs Dialog responsiveness (whether to wrap in Popover on desktop and Drawer/Sheet on tiny viewports, or responsive floating Popover).
- Search/filter logic within the theme selector dropdown.

### Deferred Ideas (OUT OF SCOPE)
- Custom user hex-color builder / custom palette generator (planned for future milestone).
- Full application component parity audits (scoped for Phase 4 & Phase 5).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| REQ-THEME-03 | Accessible dropdown/popover menu with keyboard navigation, ARIA attributes, and visual preview items | Radix Popover primitive (`radix-ui`), WAI-ARIA combobox/dialog roles, keyboard navigation, focus management. |
| REQ-UX-01 | Header mounts in `app-topbar.tsx`, `marketing-header.tsx`, and `account-shell.tsx` with mobile support | Unified `ThemeSelector` component, 44px touch targets on mobile, dropdown alignment (`align="end"`). |
| REQ-UX-02 | Theme customizer & preview gallery in Settings (`/account/appearance`) | Route `/account/appearance`, `ACCOUNT_SECTIONS` registration, interactive 12-theme mockup grid, live Keris slice transitions. |
</phase_requirements>

## Summary

Phase 3 transitions OpenKuasa's multi-theme engine (Phase 1) and CSS token specifications (Phase 2) into an interactive, user-facing experience. Users will be able to discover, preview, and apply all 12 curated design systems seamlessly from any top navigation header (`AppTopbar`, `MarketingHeader`, `AccountShell`) and via a dedicated, immersive theme gallery at `/account/appearance`.

The primary technical challenge involves unifying theme preset switching and light/dark mode toggling into a single cohesive control (`ThemeSelector`) that preserves the signature canvas-based **Keris slice** View Transition animation (`sliceTheme`) while maintaining high accessibility (WCAG 2.1 AA, keyboard arrow navigation, screen reader labels) and mobile responsiveness.

**Primary recommendation:** Build a dedicated `Popover` UI primitive (`src/components/ui/popover.tsx` wrapping `radix-ui`), implement `ThemeSelector` (`src/components/theme/theme-selector.tsx`) featuring category tabs (`Modern`, `Retro & Unix`, `Industrial`, `Editorial`), live mini mockup previews, and an integrated footer mode toggle. Mount it across the 3 headers, wire `/account/appearance` with rich interactive cards, and update `tests/account-nav.test.ts` to ensure 100% test suite health.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Theme State & Persistence | Client Browser (`localStorage`, `<html>` attributes) | Pre-paint script (`<head>`) | [VERIFIED: src/lib/theme.ts:1-262] Immediate zero-FOUC synchronization without server roundtrip. |
| Popover & Menu Trigger | Browser / Client Component (`ThemeSelector`) | — | Interactive floating menu requires client-side DOM positioning, focus trapping, and click-outside listeners. |
| Keris Slice View Transition | Browser / Client (`document.startViewTransition`) | Canvas / Fallback | [VERIFIED: src/components/theme/keris-slice.ts:59-71] Screen wipe transition runs entirely in client browser with reduced-motion fallback. |
| Account Navigation (`ACCOUNT_SECTIONS`) | Shared Config (`src/config/account-nav.ts`) | Server & Client | Consumed by Server Components (`AccountSidebar`), Client search (`nav-search-entries.tsx`), and tests. |
| Appearance Settings Page | Frontend Server SSR + Client Gallery | Client Component | `/account/appearance/page.tsx` renders SSR shell (`AccountShell`), client component handles live gallery selection. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `radix-ui` | ^1.7.0 | Accessible Popover, Tooltip, Tabs primitives | [VERIFIED: package.json:54] Consolidated Radix UI package already installed in repo; provides W3C WAI-ARIA compliant floating portals. |
| `lucide-react` | ^1.16.0 | System icons (`Palette`, `Sun`, `Moon`, `Monitor`, `Check`, `Sparkles`) | [VERIFIED: package.json:52] Project standard iconography. |
| `useTheme` | Internal (`@/lib/use-theme`) | Theme state hook (`preset`, `mode`, `isDark`, `setPreset`, `setMode`) | [VERIFIED: src/lib/use-theme.ts:19-49] React 19 Client Component hook using `useSyncExternalStore`. |
| `sliceTheme` | Internal (`@/components/theme/keris-slice`) | Canvas & View Transition keris slice animation | [VERIFIED: src/components/theme/keris-slice.ts:59-158] Signature Malay dagger cut screen transition. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `cn` | Internal (`@/lib/utils` or `cn`) | Tailwind class merger (`clsx` + `tailwind-merge`) | Combining conditional styles on mockup cards and buttons. |
| `class-variance-authority` | ^0.7.1 | Component variants | Defining variant styles for preview cards or buttons. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `Popover` | `DropdownMenu` | DropdownMenu automatically closes on item click and expects menuitem semantics; Popover supports persistent multi-step interactions (D-05) and custom tabs/grids. |
| Inline SVG Mockups | Static PNG/WebP images | PNGs fail to adapt to live mode shifts and require extra asset downloads; CSS-driven mini DOM mockups dynamically reflect theme variables with 0KB network payload. |

## Package Legitimacy Audit

No new external packages need to be installed for Phase 3.
The project already includes `radix-ui` (`^1.7.0`), `lucide-react` (`^1.16.0`), `clsx`, and `tailwind-merge`.

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `radix-ui` | npm | 3+ yrs | ~15M/wk | github.com/radix-ui/primitives | [OK] | Already installed [VERIFIED: package.json:54] |
| `lucide-react` | npm | 3+ yrs | ~12M/wk | github.com/lucide-icons/lucide | [OK] | Already installed [VERIFIED: package.json:52] |

## Architecture Patterns

### System Architecture Diagram

```
User Action (Click Header Palette Button)
               │
               ▼
      [ThemeSelector Trigger] (Button + Tooltip + Active dot)
               │
               ▼ opens
     ┌────────────────────────────────────────────────────────┐
     │ ThemeSelector Popover (radix-ui PopoverContent)        │
     │ ┌────────────────────────────────────────────────────┐ │
     │ │ Header: Title + Search Filter + Category Tabs      │ │
     │ ├────────────────────────────────────────────────────┤ │
     │ │ Scrollable Grid (12 Theme Mini-Mockup Cards)       │ │
     │ │  - Surface background & border                     │ │
     │ │  - Header strip, sidebar bar, button chip          │ │
     │ │  - Active checkmark badge                          │ │
     │ │  - Locked-dark badge (if applicable)               │ │
     │ ├────────────────────────────────────────────────────┤ │
     │ │ Footer: Mode Switcher (System / Light / Dark)      │ │
     │ │  - Quick toggle button group                       │ │
     │ │  - Disabled/locked notice for signature themes     │ │
     │ └────────────────────────────────────────────────────┘ │
     └────────────────────────────────────────────────────────┘
               │ Click Theme Card or Mode Toggle
               ▼
     [sliceTheme Animation Callback]
               │
               ├─► saves to localStorage via saveThemeState()
               ├─► sets data-theme="..." on <html>
               ├─► sets class="dark" / removes from <html>
               └─► notifies useSyncExternalStore listeners
```

### Component Structure
```
src/
├── components/
│   ├── ui/
│   │   └── popover.tsx                 # NEW: Radix Popover primitive wrapper
│   └── theme/
│       ├── theme-selector.tsx          # NEW: Unified ThemeSelector popover component
│       ├── theme-mockup-card.tsx       # NEW: Mini & large authentic UI mockup preview
│       ├── theme-toggle.tsx            # Kept for backward compatibility or internal use
│       └── keris-slice.ts              # Existing View Transition animation
├── app/
│   └── account/
│       └── appearance/
│           ├── page.tsx                # NEW: Dedicated Appearance settings page
│           └── appearance-client.tsx   # NEW: Interactive gallery & mode selector card
└── config/
    └── account-nav.ts                  # Register Appearance under Account section
```

### Categorization of the 12 Design Systems
To satisfy D-01 ("Categorized Grid with Groups"), the 12 themes can be grouped into 4 distinct, cohesive categories:

1. **Modern & Minimal**
   - `kuasa-emerald` (Emerald Kuasa — Malaysian Enterprise Baseline) [supports dual-mode]
   - `swiss-monochrome` (Swiss Monochrome — Stark Hairline Minimalist) [supports dual-mode]
   - `executive-editorial` (Executive Editorial — Parchment & Midnight Teal) [supports dual-mode]
2. **Datacenter & Hypervisor**
   - `proxmox-hypervisor` (Enterprise Hypervisor — Proxmox Neutral-950 & Amber) [locked dark]
   - `tactile-rackmount` (Hardware Rackmount — Chassis Steel & Cyan LED) [locked dark]
3. **Engineering & Technical**
   - `blueprint-cad` (Blueprint CAD — Cyanotype Drafting Schematic) [supports dual-mode]
   - `brutalist-ledger` (Brutalist Financial Ledger — Anti-Design Monospace Grid) [supports dual-mode]
   - `factory-plc` (Factory HMI Automation — Gray-Green & Caution Yellow) [locked dark]
4. **Retro & Workstation**
   - `crt-phosphor` (Industrial CRT Phosphor — Carbon Black & Green Glow) [locked dark]
   - `irix-unix` (IRIX Unix Workstation — Silicon Graphics 4Dwm Motif) [locked dark]
   - `scada-command` (SCADA Command Console — Tactical Defense & DEFCON Amber) [locked dark]
   - `analog-tape` (Mastering Tape Deck — Champagne Aluminum & Amber VU) [locked dark]

### Pattern 1: Mini Mockup Card Rendering (Authentic CSS Palette)
**What:** Each mini mockup card renders a self-contained miniature representation of the application layout using exact theme colors.
**When to use:** In both the `ThemeSelector` popover grid (compact size ~130px × 80px) and `/account/appearance` gallery (rich size ~280px × 170px).
**Implementation Details:**
Theme preview swatches must use discrete verified color values from `src/app/themes/*.css` so they look accurate regardless of whether the parent document is currently rendered in another theme.

| Theme ID | Primary Brand | Surface Canvas | Accent / Detail | Mode Support |
|----------|---------------|----------------|-----------------|--------------|
| `kuasa-emerald` | `#059669` (Emerald) | `#030712` (dark) / `#ffffff` (light) | Jade accent | Dual-mode |
| `proxmox-hypervisor` | `#f59e0b` (Amber) | `#0a0a0a` (Pitch black) | `#141414` panel | Locked dark |
| `swiss-monochrome` | `#000000` / `#ffffff` | `#ffffff` / `#000000` | Hairline border | Dual-mode |
| `crt-phosphor` | `#00ff66` (Phosphor) | `#050806` (Carbon) | CRT green glow | Locked dark |
| `executive-editorial` | `#c29b38` (Brass) | `#f8f6f0` (Parchment) / `#0f1418` | Serif typography | Dual-mode |
| `tactile-rackmount` | `#00e5ff` (Cyan LED) | `#121417` (Steel) | Rocker orange | Locked dark |
| `blueprint-cad` | `#0284c7` (Drafting) | `#070e1c` (Cyanotype) / `#f0f7ff` | Drafting grid | Dual-mode |
| `irix-unix` | `#ffd54f` (SGI Gold) | `#1c2b36` (SGI Teal) | Motif indigo | Locked dark |
| `scada-command` | `#f59e0b` (DEFCON Amber)| `#05090f` (Defense) | Radar emerald | Locked dark |
| `factory-plc` | `#eab308` (Caution) | `#191e1b` (PLC Green) | E-stop red | Locked dark |
| `brutalist-ledger` | `#0f172a` (Ink) | `#fdfdfd` / `#0f172a` | 2px black rules | Dual-mode |
| `analog-tape` | `#ffaa33` (VU Amber) | `#1c1815` (Walnut/Chassis) | Champagne panel | Locked dark |

### Pattern 2: Unified Popover with Persistent Interaction Flow (D-05)
Unlike standard action menus, the popover must stay open after a theme selection is made (`onSelect` does not call `setOpen(false)`). This allows the user to click between 3 or 4 themes consecutively and watch the screen transform in real-time under the Keris slice effect before dismissing the popover by clicking outside or pressing Escape.

### Pattern 3: Locked Mode Resolution & Auto-Switching (D-15)
When a user currently in `light` mode clicks a locked-dark theme (such as `crt-phosphor` or `proxmox-hypervisor`), the selector:
1. Detects `meta.lockedMode === 'dark'`.
2. Automatically calls `saveThemeState(preset, 'dark')` inside `sliceTheme()`.
3. Informs the user with an inline badge or status pill indicating that dark mode is enforced for this signature hardware preset.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Popover positioning & focus trap | Custom absolute positioned `<div>` with window scroll listeners | `radix-ui` `Popover` primitive | Handles collision detection, viewport overflow flips, focus restoration, escape key dismissal, and ARIA attributes out of the box. |
| Tooltip trigger | Manual `onMouseEnter` state | `radix-ui` `Tooltip` (`src/components/ui/tooltip.tsx`) | Prevents tooltip stuck states and handles delay timers properly. |
| View transition animation | Custom CSS canvas overlay | `sliceTheme()` from `src/components/theme/keris-slice.ts` | [VERIFIED: src/components/theme/keris-slice.ts:59-158] Already built, tested, and respects `prefers-reduced-motion`. |
| Theme storage & state sync | Direct `localStorage.setItem` | `saveThemeState` from `src/lib/theme.ts` | [VERIFIED: src/lib/theme.ts:180-218] Updates DOM attributes synchronously and broadcasts via `CustomEvent` to `useSyncExternalStore`. |

## Common Pitfalls

### Pitfall 1: Breaking Radix Popover Inside Other Dropdown/Header Contexts
**What goes wrong:** Nesting popovers or placing popovers in headers with `overflow-hidden` can cause clipping or z-index wars.
**Why it happens:** Headers like `MarketingHeader` use `sticky top-0 z-50` and mobile navigation menus use drawers.
**How to avoid:** Use `PopoverPortal` so the popover content mounts directly into `document.body`, escaping any overflow constraints. Set `sideOffset={8}` and `align="end"`.

### Pitfall 2: `account-nav.test.ts` Assertion Failure on Navigation Change
**What goes wrong:** Adding `Appearance` to `ACCOUNT_SECTIONS` causes `tests/account-nav.test.ts` to fail because it asserts `expect(all).toHaveLength(15)`.
**Why it happens:** [VERIFIED: tests/account-nav.test.ts:25-27]
```typescript
it('offers an owner every account screen', () => {
  const all = ACCOUNT_SECTIONS.flatMap((section) => section.items.map((item) => item.href));
  expect(all).toHaveLength(15);
  expect(searchHrefs('owner')).toEqual(all);
});
```
**How to avoid:** When registering `{ label: 'Appearance', href: '/account/appearance', icon: Palette }` in `src/config/account-nav.ts`, also update `tests/account-nav.test.ts` to expect length 16.

### Pitfall 3: Double Theme Slice Animation Conflict
**What goes wrong:** If a user clicks a theme card rapidly while the keris slice transition (700ms) is already in progress, `document.startViewTransition` can throw or abort with an unexpected DOM state.
**Why it happens:** Browsers only permit one active View Transition at a time.
**How to avoid:** Guard theme switching with a transient transition lock (or catch transition rejection as `sliceTheme` already does via `.catch(() => {})`).

### Pitfall 4: Mobile Header Space Contention
**What goes wrong:** Replacing `ThemeToggle` with `ThemeSelector` might break responsive layouts on 320px screens if the button is bulky.
**Why it happens:** `AppTopbar` has `CircleHelp`, `NotificationsMenu`, and `UserMenu`.
**How to avoid:** Match the exact footprint of `ThemeToggle`: `size="icon"`, variant `ghost`, 44px on mobile (`max-md:size-11`), rendering the sleek Lucide `Palette` icon.

## Code Examples

### Popover Primitive (`src/components/ui/popover.tsx`)
```typescript
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Popover as PopoverPrimitive } from 'radix-ui';

export function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

export function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

export function PopoverPortal({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Portal>) {
  return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />;
}

export function PopoverContent({
  className,
  align = 'end',
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(
          'z-50 w-84 rounded-xl border bg-popover p-3 text-popover-foreground shadow-xl outline-none ring-1 ring-foreground/10 duration-150 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
```

### Theme Selector Trigger & Application (`src/components/theme/theme-selector.tsx`)
```typescript
'use client';

import { useTheme } from '@/lib/use-theme';
import { sliceTheme, preloadKeris } from '@/components/theme/keris-slice';
import { THEME_PRESETS, type ThemePreset, type ThemeMode } from '@/lib/theme';
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemeSelector({ className }: { className?: string }) {
  const { preset, mode, effectiveMode, setPreset, setMode } = useTheme();

  const handleSelectPreset = (nextPreset: ThemePreset) => {
    if (nextPreset === preset) return;
    const meta = THEME_PRESETS[nextPreset];
    const targetMode = meta.lockedMode ?? mode;
    
    void sliceTheme(() => {
      setPreset(nextPreset);
      if (meta.lockedMode && mode !== meta.lockedMode) {
        setMode(meta.lockedMode);
      }
    });
  };

  const handleToggleMode = (nextMode: ThemeMode) => {
    void sliceTheme(() => setMode(nextMode));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Customize theme & appearance"
          className={cn('relative max-md:size-11', className)}
        >
          <Palette className="size-5" />
          <span className="sr-only">Change theme</span>
          {/* Subtle accent dot indicating active customization */}
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-88 p-3" align="end">
        {/* Header & Tabs */}
        {/* 12-Card Grid */}
        {/* Footer Mode Switcher */}
      </PopoverContent>
    </Popover>
  );
}
```

### Account Appearance Page (`src/app/account/appearance/page.tsx`)
```typescript
import { Metadata } from 'next';
import { AppearanceClient } from './appearance-client';

export const metadata: Metadata = {
  title: 'Appearance & Themes · OpenKuasa',
  description: 'Customize your workspace aesthetics, color palettes, and display modes.',
};

export default function AppearancePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Appearance</h1>
        <p className="text-sm text-muted-foreground">
          Choose a curated design system and display mode for your workspace.
        </p>
      </div>

      <AppearanceClient />
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Standalone `ThemeToggle` (only light/dark) | Unified `ThemeSelector` (presets + light/dark) | Phase 3 | Eliminates header clutter while unlocking the full 12 design systems. |
| In-memory or modal theme switchers | 1-click instant live preview with View Transition (`sliceTheme`) | Phase 1 & 3 | Zero-FOUC, instant DOM feedback, high engagement. |
| Text-only `<select>` dropdown | Miniature & rich visual mockup cards with real palette colors | Phase 3 | Immediate visual comprehension of what the theme feels like before clicking. |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Popover primitive should be created at `src/components/ui/popover.tsx` using `radix-ui` | Standard Stack | Zero risk — `radix-ui` is already in `package.json` and exports `Popover`. |
| A2 | `Appearance` nav item in `src/config/account-nav.ts` increases item count from 15 to 16 | Common Pitfalls | Low risk — test update is simple and verified. |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Runtime | ✓ | v24.15.0 | — |
| npm / pnpm | Package management | ✓ | 11.12.1 | — |
| `radix-ui` | UI primitives | ✓ | 1.7.0 | — |
| `vitest` | Unit testing | ✓ | 5.0.3 | — |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 5.0.3 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run tests/theme.test.ts tests/theme-css.test.ts tests/account-nav.test.ts` |
| Full suite command | `npx vitest run tests/theme.test.ts tests/theme-css.test.ts tests/account-nav.test.ts tests/theme-selector.test.ts` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| REQ-THEME-03 | ThemeSelector popover renders trigger, preset grid, and mode toggles | Unit / Component | `npx vitest run tests/theme-selector.test.ts` | ❌ Wave 0 |
| REQ-UX-01 | Header integrations mount `ThemeSelector` without regressions | Component / Integration | `npx vitest run tests/headers.test.ts` | ❌ Wave 0 |
| REQ-UX-02 | `/account/appearance` route & `account-nav.ts` registration | Unit / Smoke | `npx vitest run tests/account-nav.test.ts` | ✅ (needs +1 count) |

### Sampling Rate
- **Per task commit:** `npx vitest run tests/theme.test.ts tests/theme-css.test.ts tests/account-nav.test.ts`
- **Per wave merge:** Full test run + `pnpm build`
- **Phase gate:** All unit tests green and build passing before `/gsd-verify-work`.

### Wave 0 Gaps
- [ ] `tests/theme-selector.test.ts` — Tests for `ThemeSelector` component rendering, locked-mode switching, and ARIA attributes.
- [ ] Update `tests/account-nav.test.ts` — Update count from 15 to 16 for `Appearance` in `ACCOUNT_SECTIONS`.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | yes | Validate preset ID against `isValidPreset()` and mode against `isValidMode()` before writing to `localStorage` or DOM. |
| V14 Configuration | yes | Ensure pre-paint script handles malformed or untrusted `localStorage` values without XSS. |

### Known Threat Patterns for Frontend Theming

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| CSS injection via attribute | Tampering | `isValidPreset(name)` restricts DOM `data-theme` attribute to strictly enumerated whitelist strings. |
| DOM clobbering / Prototype pollution | Tampering | `localStorage.getItem` wrapped in try/catch and checked with `isValidPreset`. |

## Sources

### Primary (HIGH confidence)
- `src/lib/theme.ts` — [VERIFIED: lines 1-262] Theme presets, metadata, locked mode resolution, and `saveThemeState`.
- `src/lib/use-theme.ts` — [VERIFIED: lines 1-50] React 19 hook for theme subscription.
- `src/components/theme/keris-slice.ts` — [VERIFIED: lines 59-158] Canvas & View Transition keris slice implementation.
- `src/config/account-nav.ts` — [VERIFIED: lines 36-60] `ACCOUNT_SECTIONS` navigation config.
- `package.json` — [VERIFIED: lines 52-54] Installed packages `radix-ui` and `lucide-react`.
- `tests/account-nav.test.ts` — [VERIFIED: lines 24-28] Assertion checking 15 account navigation items.

### Secondary (MEDIUM confidence)
- Radix UI Popover documentation for React 19 compatibility and `PopoverPortal` positioning.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed in repo and verified.
- Architecture: HIGH — clear separation of concerns, established patterns from Phase 1 & 2.
- Pitfalls: HIGH — verified specific test assertion count in `tests/account-nav.test.ts` and portal requirements.

**Research date:** 2026-11-05
**Valid until:** 2026-12-05
