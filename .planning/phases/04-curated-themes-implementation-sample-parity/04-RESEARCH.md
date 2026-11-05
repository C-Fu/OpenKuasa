# Phase 4: Curated Themes Implementation & Sample Parity - Research
**Researched:** 2026-11-05
**Domain:** Next.js 16 Web Fonts, CSS Skeuomorphism & Texture Systems, Tactile Hardware UI Micro-Widgets, Vitest Component & Token Testing
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** CSS-driven authentic skeuomorphism — Inject custom borders, directional 3D chisel bevels, CRT phosphor text glows, and CAD drafting registration lines through scoped `[data-theme='...']` CSS rules targeting standard HTML/Tailwind elements without breaking standard shadcn component APIs.
- **D-02:** Subtle, non-intrusive scanline overlay with disable toggle — For CRT Phosphor and SCADA Command, provide faint CSS scanline patterns and gentle ambient phosphor text glows on headings and status badges, keeping data tables and numbers razor-sharp and readable.
- **D-03:** Scoped CSS button bevels — Standard shadcn `Button` elements automatically gain directional 3D borders (light top/left, dark bottom/right) and active inset depressions when `irix-unix` or `tactile-rackmount` is active.
- **D-04:** Ambient subtle CSS drafting grid — For Blueprint CAD and Brutalist Ledger, render faint coordinate grid backgrounds on layout canvases and hairline crosshairs on cards, preserving high text contrast and legibility.
- **D-05:** Next.js `next/font/google` in Root Layout — Preload fonts with CSS variable bindings mapped directly to theme `--font-sans` and `--font-mono` tokens with local caching and zero layout shift. — **Reversibility:** costly — (Touches `src/app/layout.tsx` font declarations and global CSS variable bindings).
- **D-06:** Comprehensive individual font per theme — Mirror each sample prototype's signature typography:
  - `kuasa-emerald`: Lexend
  - `proxmox-hypervisor`: JetBrains Mono & Inter
  - `swiss-monochrome`: Space Grotesk / Geist Grotesk
  - `crt-phosphor`: VT323 / Silkscreen & Chivo Mono
  - `executive-editorial`: Newsreader (Editorial Serif) & Inter
  - `tactile-rackmount`: IBM Plex Sans & Chivo Mono
  - `blueprint-cad`: Space Grotesk & JetBrains Mono
  - `irix-unix`: IBM Plex Sans & Courier/Chivo Mono
  - `scada-command`: Share Tech Mono / JetBrains Mono
  - `factory-plc`: Chivo Mono & Industry Grotesk
  - `brutalist-ledger`: IBM Plex Mono
  - `analog-tape`: Newsreader & Chivo Mono
- **D-07:** Strict webfont display fidelity — Ensure webfonts are applied with `font-display: block` or swap-ready variables without premature fallback substitution, preserving authentic visual identity.
- **D-08:** Dedicated Tactile UI Widget Library (`src/components/theme-widgets/`) — Create modular, reusable micro-widgets inspired by the `sample_themes/` prototypes:
  - `VuMeter`: Audio/telemetry level indicator (LED segments, needle dial, or minimalist strip).
  - `TelemetryBeacon`: Pulsing status radar / LED hardware beacon with multi-state health indicators.
  - `RockerSwitch`: Heavy tactile toggle rocker with authentic click feedback.
  - `CadCrosshair`: Corner registration marks and coordinate annotation chips for drafting cards.
  - `TapeReel`: Rotating tape hub / reel visual abstraction for analog consoles.
- **D-09:** Universal Fallback with Signature Skin — Tactile widgets dynamically adapt their visual presentation based on the active theme preset (e.g., `VuMeter` displays LED bars in SCADA/Proxmox, needle dial in Analog Tape, and sleek minimalist strip in Swiss Monochrome).
- **D-10:** Layered CSS Theme Extensions (`src/app/themes/*.css`) — Contain all visual rules inside theme CSS files targeting standard HTML and Tailwind classes (`[data-theme='irix-unix'] .btn`, `[data-theme='blueprint-cad'] .card`), requiring zero changes to existing page JSX.
- **D-11:** Pure CSS Texture Utilities — Implement scanlines (`.scanline-overlay`), CAD grids (`.cad-grid-bg`), and rack ears (`.rack-ears`) using lightweight GPU-accelerated CSS gradients and SVG background patterns rather than heavy Canvas/WebGL shaders or static raster images.

### the agent's Discretion
- Specific font weight selection in `next/font/google` declarations to balance build artifact sizes and typography rendering quality.
- Reusable micro-component props API for `src/components/theme-widgets/*`.
- Visual tuning of phosphor glow radius, bevel border shades, and scanline alpha parameters to ensure WCAG AA readability.

### Deferred Ideas (OUT OF SCOPE)
- Interactive audio sound effects (e.g. vintage mechanical keyboard clicks, switch clunks, tape hiss) — deferred to a future polish/audio milestone.
- Full multi-page visual regression testing across all routes — scoped for Phase 5.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| REQ-THEME-CURATED | Implement full visual personality, textures, bevels, and borders for all 12 curated themes defined in `THEMES_LIST.md` and HTML prototypes | Scoped CSS rules in `src/app/themes/*.css` applying 3D chisel bevels, scanline overlays, CAD coordinate grids, and phosphor text glows via `[data-theme='...']`. |
| REQ-THEME-PARITY | Deliver tactile micro-widgets (`VuMeter`, `TelemetryBeacon`, `RockerSwitch`, `CadCrosshair`, `TapeReel`) with theme-adaptive visual skins | Widget architecture in `src/components/theme-widgets/` supporting adaptive rendering based on active theme preset or explicit variant props. |
| REQ-THEME-FONTS | Google Fonts integration with `next/font/google` in root layout mapped directly to theme tokens | Single root layout injection of variable font bindings (`--font-lexend`, `--font-jetbrains-mono`, etc.) referenced conditionally inside each theme's CSS file without extra network waterfall. |
</phase_requirements>

## Summary

Phase 4 bridges base CSS token variables from Phase 2 and UI triggers from Phase 3 into the authentic, tactile soul of OpenKuasa's 12 design systems. Each theme shifts not just color palettes, but geometric personality, typography, physical depth, and tactile micro-interactions.

The implementation relies on two core pillars:
1. **Scoped CSS Theme Enhancements (`src/app/themes/*.css`):** Targeting standard HTML elements and Tailwind utility classes (`button`, `[data-slot='button']`, `[data-slot='card']`, `input`) inside `[data-theme='...']` selectors. This provides SGI IRIX 3D chisel bevels, CRT cathode scanlines, Blueprint CAD coordinate grids, and Brutalist ledger borders without touching application page JSX.
2. **Modular Tactile Micro-Widgets (`src/components/theme-widgets/`):** Delivering 5 self-contained, accessible, theme-adaptive widgets (`VuMeter`, `TelemetryBeacon`, `RockerSwitch`, `CadCrosshair`, `TapeReel`) that can be dropped into dashboards, cards, and the appearance settings gallery.

**Primary recommendation:** Instantiate Google Fonts via `next/font/google` in `src/app/layout.tsx` as CSS custom properties on `<html>` (e.g., `--font-space-grotesk`, `--font-vt323`, `--font-ibm-plex-sans`), and map each theme's `--font-sans`, `--font-mono`, and `--font-heading` directly to these variables in `src/app/themes/*.css`.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Font Loading & Pre-rendering | Frontend Server (SSR / Next.js) | Browser (CSS Cache) | `next/font/google` downloads and self-hosts font binaries at build time, injecting zero-layout-shift `<link rel="stylesheet">` or inline CSS variables during SSR. |
| Skeuomorphic Textures & Bevels | Browser / CSS Engine | — | Directional borders, gradients, and scanlines are pure GPU-accelerated CSS rules scoped by `[data-theme='...']`. Zero JavaScript overhead. |
| Tactile Widgets State & Motion | Browser / React Client | SSR | `RockerSwitch`, `VuMeter`, and `TapeReel` render semantic markup on SSR and manage interactive micro-states (toggle, inertia, animation) on the client. |
| Theme-Adaptive Skinning | CSS Variable Cascade | React Context (`useTheme`) | Widgets rely primarily on CSS token variables (`var(--primary)`, `var(--radius)`, `var(--border)`) with optional runtime preset checks for layout shifts (e.g., needle vs LED bar). |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next/font/google` | Next.js 16.4.1 (Built-in) | Zero-FOUC webfont self-hosting | Self-hosts Google Fonts at build time with CSS variable bindings; eliminates external Google requests and layout shift. [VERIFIED: node_modules/next/dist/compiled/@next/font/dist/google/index.d.ts:25-35] |
| `lucide-react` | 1.16.0 | Semantic icons for widgets | Standard icon system used across all shadcn primitives in OpenKuasa. |
| Tailwind CSS | 4.2.1 | Utility styling and CSS variable integration | Configured via `@theme inline` in `src/app/globals.css`. |

### Google Fonts Declaration Map

All required fonts are confirmed available in Next.js `next/font/google` [VERIFIED: node_modules/next/dist/compiled/@next/font/dist/google/index.d.ts:60-150]:

| Preset ID | Primary Sans / Heading Font | Primary Monospace / Technical Font | Font Options in `layout.tsx` |
|-----------|-----------------------------|-------------------------------------|------------------------------|
| `kuasa-emerald` | Lexend | Geist Mono (existing) | Variable font, `subsets: ['latin']` |
| `proxmox-hypervisor` | Inter | JetBrains Mono | `subsets: ['latin']` |
| `swiss-monochrome` | Space Grotesk | JetBrains Mono / Geist Mono | Variable font, `subsets: ['latin']` |
| `crt-phosphor` | VT323 & Chivo Mono | Chivo Mono | VT323 `weight: '400'`, Chivo Mono variable |
| `executive-editorial`| Newsreader | Inter / JetBrains Mono | Newsreader `subsets: ['latin']`, italic & normal |
| `tactile-rackmount` | IBM Plex Sans | Chivo Mono | `subsets: ['latin']` |
| `blueprint-cad` | Space Grotesk | JetBrains Mono | `subsets: ['latin']` |
| `irix-unix` | IBM Plex Sans | Chivo Mono / Courier New | `subsets: ['latin']` |
| `scada-command` | Share Tech Mono / Space Grotesk | Share Tech Mono | Share Tech Mono `weight: '400'` |
| `factory-plc` | IBM Plex Sans / Space Grotesk | Chivo Mono | `subsets: ['latin']` |
| `brutalist-ledger` | Space Grotesk | IBM Plex Mono | `subsets: ['latin']` |
| `analog-tape` | Newsreader / Space Grotesk | Chivo Mono | `subsets: ['latin']` |

**Deduplicated Google Font instances to declare in `src/app/layout.tsx`:**
1. `Lexend` (`--font-lexend`)
2. `Inter` (`--font-inter`)
3. `Space_Grotesk` (`--font-space-grotesk`)
4. `Newsreader` (`--font-newsreader`)
5. `IBM_Plex_Sans` (`--font-ibm-plex-sans`)
6. `IBM_Plex_Mono` (`--font-ibm-plex-mono`)
7. `JetBrains_Mono` (`--font-jetbrains-mono`)
8. `Chivo_Mono` (`--font-chivo-mono`)
9. `Share_Tech_Mono` (`--font-share-tech-mono`, `weight: '400'`)
10. `VT323` (`--font-vt323`, `weight: '400'`)

## Package Legitimacy Audit

No external third-party npm packages are required for Phase 4. All fonts and icons are provided by built-in `next/font/google` and existing `lucide-react`.

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `next/font/google` | npm (Next.js internal) | 3+ yrs | High (core Next.js) | github.com/vercel/next.js | [OK] | Approved |
| `lucide-react` | npm | 3+ yrs | ~35M/wk | github.com/lucide-icons/lucide | [OK] | Existing in repo |

## Architecture Patterns

### Pattern 1: Scoped Skeuomorphic CSS Injection
**What:** Scoped theme rules in `src/app/themes/*.css` that apply authentic skeuomorphism without altering component JSX or breaking standard shadcn props.
**When to use:** In each individual theme file (e.g. `src/app/themes/irix-unix.css`, `src/app/themes/blueprint-cad.css`).

**Example: IRIX 4Dwm Directional 3D Chisel Bevels**
```css
/* Scoped SGI IRIX Motif Bevels in src/app/themes/irix-unix.css */
[data-theme='irix-unix'] {
  --sgi-bevel-light: #8ea8b3;
  --sgi-bevel-dark: #1b2f36;
  --sgi-bevel-black: #0c1619;
}

/* 3D Outset on Cards & Panels */
[data-theme='irix-unix'] [data-slot='card'],
[data-theme='irix-unix'] .card-panel {
  border-top: 2px solid var(--sgi-bevel-light) !important;
  border-left: 2px solid var(--sgi-bevel-light) !important;
  border-right: 2px solid var(--sgi-bevel-dark) !important;
  border-bottom: 2px solid var(--sgi-bevel-dark) !important;
  box-shadow: 2px 2px 0px var(--sgi-bevel-black) !important;
}

/* 3D Button Outset & Depressed Active State */
[data-theme='irix-unix'] button,
[data-theme='irix-unix'] [data-slot='button'] {
  border-top: 2px solid var(--sgi-bevel-light) !important;
  border-left: 2px solid var(--sgi-bevel-light) !important;
  border-right: 2px solid var(--sgi-bevel-dark) !important;
  border-bottom: 2px solid var(--sgi-bevel-dark) !important;
  box-shadow: 1px 1px 0px var(--sgi-bevel-black) !important;
  transition: none !important;
}

[data-theme='irix-unix'] button:active,
[data-theme='irix-unix'] [data-slot='button']:active {
  border-top: 2px solid var(--sgi-bevel-dark) !important;
  border-left: 2px solid var(--sgi-bevel-dark) !important;
  border-right: 2px solid var(--sgi-bevel-light) !important;
  border-bottom: 2px solid var(--sgi-bevel-light) !important;
  transform: translate(1px, 1px);
}

/* Sunken Inset on Form Inputs */
[data-theme='irix-unix'] input,
[data-theme='irix-unix'] textarea,
[data-theme='irix-unix'] select {
  border-top: 2px solid var(--sgi-bevel-dark) !important;
  border-left: 2px solid var(--sgi-bevel-dark) !important;
  border-right: 2px solid var(--sgi-bevel-light) !important;
  border-bottom: 2px solid var(--sgi-bevel-light) !important;
}
```

### Pattern 2: Scanline Overlay & Raster Glows with Contrast Protection
**What:** GPU-accelerated scanline background and soft phosphor heading glows for CRT and SCADA themes without degrading numeric data table legibility (Decision D-02).
**When to use:** In `src/app/themes/crt-phosphor.css` and `src/app/themes/scada-command.css`.

**Example:**
```css
/* CRT Phosphor Scanline Texture & Glow in src/app/themes/crt-phosphor.css */
[data-theme='crt-phosphor'] body::before {
  content: " ";
  display: block;
  position: fixed;
  top: 0; left: 0; bottom: 0; right: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%);
  background-size: 100% 3px;
  z-index: 999;
  pointer-events: none;
  opacity: 0.5;
}

/* Ambient phosphor glow on headings, badges, and prominent status text only */
[data-theme='crt-phosphor'] h1,
[data-theme='crt-phosphor'] h2,
[data-theme='crt-phosphor'] h3,
[data-theme='crt-phosphor'] [data-slot='badge'],
[data-theme='crt-phosphor'] .phosphor-glow {
  text-shadow: 0 0 6px rgba(0, 255, 102, 0.65), 0 0 12px rgba(0, 255, 102, 0.25);
}

/* Numeric tables and data inputs maintain crisp edges (NO blur) */
[data-theme='crt-phosphor'] table,
[data-theme='crt-phosphor'] input,
[data-theme='crt-phosphor'] code {
  text-shadow: none;
}
```

### Pattern 3: Blueprint CAD Drafting Grid & Crosshairs
**What:** Pure CSS coordinate grid background and corner registration crosshairs for Blueprint CAD (Decision D-04).
**When to use:** In `src/app/themes/blueprint-cad.css`.

**Example:**
```css
/* Blueprint CAD Grid Canvas in src/app/themes/blueprint-cad.css */
[data-theme='blueprint-cad'] body {
  background-image: 
    linear-gradient(rgba(56, 189, 248, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.12) 1px, transparent 1px),
    linear-gradient(rgba(56, 189, 248, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.04) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -1px -1px;
}
```

### Pattern 4: Tactile UI Widget Library Architecture
**Directory:** `src/components/theme-widgets/`

1. **`vu-meter.tsx` (`VuMeter`)**:
   - Multi-mode telemetry gauge:
     - `variant="needle"`: Dual or single needle with ballistic damping (Analog Tape).
     - `variant="led"`: Stacked segmented LED bars (Green -> Amber -> Red) (SCADA, CRT Phosphor, Proxmox).
     - `variant="strip"`: Minimalist hairline progression bar (Swiss Monochrome, Emerald Kuasa).
     - `variant="auto"` (default): Automatically chooses skin matching active theme preset.
2. **`telemetry-beacon.tsx` (`TelemetryBeacon`)**:
   - Status radar beacon with concentric pulsing rings (`status="healthy" | "warning" | "critical" | "offline"`).
   - In CRT/SCADA: DEFCON radar sweep and green/amber phosphor beacon.
   - In Rackmount: Machined bezel status LED with physical glass refraction.
3. **`rocker-switch.tsx` (`RockerSwitch`)**:
   - Heavy-duty two-position toggle rocker with tactile 3D paddle.
   - Visual depression angle (-12deg / +12deg), orange signal indicator, and accessible ARIA `role="switch"`.
4. **`cad-crosshair.tsx` (`CadCrosshair`)**:
   - Corner registration marks `[ + ]` and coordinate chips `[X: 104.2 Y: 89.1]`.
   - Embeddable in Card headers or floating annotations.
5. **`tape-reel.tsx` (`TapeReel`)**:
   - Rotating dual magnetic tape hub with center flanges and realistic rotational velocity.
   - Responds to play/pause state or ambient activity.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font Self-Hosting | Custom `@font-face` CSS files and static woff2 downloads | `next/font/google` in `layout.tsx` | Next.js handles font subsetting, local caching, preloading, and CSS variable injection with zero layout shift (CLS). |
| CRT / Grid Textures | Canvas 2D or WebGL shaders | Pure CSS linear/radial gradients | Canvas shaders consume heavy GPU/battery and block the main thread; CSS gradients are hardware-accelerated and responsive. |
| Ballistic Meter Physics | Heavy physics animation library (e.g. Matter.js) | CSS `transition: transform 0.22s cubic-bezier(0.18, 0.89, 0.32, 1.28)` | Provides natural physical needle bounce and inertia with zero JavaScript bundle weight. |
| Widget Accessibility | Custom non-semantic `<div>` buttons | Native `<button>` / `<input type="checkbox">` with ARIA roles | Full keyboard navigation (`Tab`, `Space`, `Enter`) and screen-reader support guaranteed out of the box. |

## Common Pitfalls

### Pitfall 1: Next.js Google Fonts Variable Font Options Error
**What goes wrong:** Next.js throws build error `VT323 does not have a variable font, you must specify a weight` or `Share_Tech_Mono does not have a variable font`.
**Why it happens:** Fonts like `VT323` and `Share_Tech_Mono` are fixed 400 weight fonts on Google Fonts; calling them without `{ weight: '400' }` causes build failure. [VERIFIED: node_modules/next/dist/compiled/@next/font/dist/google/index.d.ts:75-90]
**How to avoid:** Explicitly pass `weight: '400'` for `VT323` and `Share_Tech_Mono` in `src/app/layout.tsx`.

### Pitfall 2: High Z-Index Scanline Overlay Blocking Pointer Events
**What goes wrong:** Adding `.crt-overlay::before` or `body::before` with scanlines blocks all clicks, buttons, and inputs on the page.
**Why it happens:** Fixed position pseudo-element covers the viewport and intercepts mouse/touch clicks.
**How to avoid:** Always specify `pointer-events: none;` on scanline and texture overlays.

### Pitfall 3: Button Bevel Height Thrashing Layout
**What goes wrong:** Adding 2px borders to buttons causes layout shift when switching between flat themes (Swiss, Kuasa) and beveled themes (IRIX, Rackmount).
**Why it happens:** Flat themes use 1px border; 2px border changes outer element dimensions if `box-sizing: border-box` margins aren't balanced.
**How to avoid:** Use `border-width: 2px; margin: -1px;` or rely on `box-shadow` inset/outset chisel techniques so element bounding boxes remain identical.

## Code Examples

### Font Variable Injection in `src/app/layout.tsx`
```tsx
import {
  Lexend,
  Inter,
  Space_Grotesk,
  Newsreader,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  JetBrains_Mono,
  Chivo_Mono,
  Share_Tech_Mono,
  VT323,
  Geist_Mono,
} from "next/font/google";

const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], style: ["normal", "italic"] });
const ibmPlexSans = IBM_Plex_Sans({ variable: "--font-ibm-plex-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const ibmPlexMono = IBM_Plex_Mono({ variable: "--font-ibm-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });
const chivoMono = Chivo_Mono({ variable: "--font-chivo-mono", subsets: ["latin"] });
const shareTechMono = Share_Tech_Mono({ variable: "--font-share-tech-mono", subsets: ["latin"], weight: "400" });
const vt323 = VT323({ variable: "--font-vt323", subsets: ["latin"], weight: "400" });
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

// Joined className string injected on <html>
const fontVariables = [
  lexend.variable,
  inter.variable,
  spaceGrotesk.variable,
  newsreader.variable,
  ibmPlexSans.variable,
  ibmPlexMono.variable,
  jetbrainsMono.variable,
  chivoMono.variable,
  shareTechMono.variable,
  vt323.variable,
  geistMono.variable,
].join(" ");
```

### Mapping in Individual Theme CSS (e.g. `src/app/themes/crt-phosphor.css`)
```css
[data-theme='crt-phosphor'] {
  --font-sans: var(--font-vt323), var(--font-chivo-mono), monospace;
  --font-mono: var(--font-chivo-mono), monospace;
  --font-heading: var(--font-vt323), monospace;
  /* ... existing colors and radius ... */
}
```

### Tactile Rocker Switch Component (`src/components/theme-widgets/rocker-switch.tsx`)
```tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RockerSwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function RockerSwitch({
  checked = false,
  onCheckedChange,
  label,
  disabled,
  className,
}: RockerSwitchProps) {
  return (
    <div className={cn("inline-flex flex-col items-center gap-1.5", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "w-10 h-16 bg-[#090b0d] border-2 border-[#30363d] rounded p-1 relative cursor-pointer select-none transition shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div
          className={cn(
            "w-full h-7 rounded-sm shadow-md transition-all duration-150 ease-out",
            checked
              ? "translate-y-0 bg-gradient-to-b from-[#ff5722] to-[#d84315] border-t border-orange-300"
              : "translate-y-6 bg-gradient-to-b from-[#2d333b] to-[#1c2128] border-t border-neutral-600"
          )}
        />
      </button>
      {label && <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">{label}</span>}
    </div>
  );
}
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 5.0.3 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run tests/theme.test.ts` |
| Full suite command | `npm test -- --run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| REQ-THEME-CURATED | Theme CSS rules inject authentic tokens, bevel variables, and fonts for all 12 presets | unit / style-check | `npx vitest run tests/theme-curated.test.ts` | ❌ Wave 0 Gap |
| REQ-THEME-PARITY | Tactile UI widgets (`VuMeter`, `TelemetryBeacon`, `RockerSwitch`, `CadCrosshair`, `TapeReel`) render accessible ARIA states and adaptive variants | component unit | `npx vitest run tests/theme-widgets.test.ts` | ❌ Wave 0 Gap |
| REQ-THEME-FONTS | All 12 presets define valid `--font-sans` and `--font-mono` variable mappings | unit / token-check | `npx vitest run tests/theme-fonts.test.ts` | ❌ Wave 0 Gap |

### Sampling Rate
- **Per task commit:** `npx vitest run tests/theme*.test.ts`
- **Per wave merge:** `npm run build && npx vitest run tests/theme*.test.ts`
- **Phase gate:** Full test suite green & Next.js production build passes before completion.

### Wave 0 Gaps
- [ ] `tests/theme-fonts.test.ts` — verifies font CSS variable resolution across all 12 themes.
- [ ] `tests/theme-widgets.test.ts` — verifies unit functionality and accessibility of `src/components/theme-widgets/*`.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | yes | User theme preference sanitized against `THEME_PRESETS` enum in `src/lib/theme.ts`. |
| V14 Malicious Code Protection | yes | Fonts downloaded strictly via official Next.js `next/font/google` at build time without unverified CDN URLs. |

## Sources

### Primary (HIGH confidence)
- Official Next.js 16 Google Fonts API declarations: `node_modules/next/dist/compiled/@next/font/dist/google/index.d.ts`
- Reference HTML mockups: `sample_themes/*.html`
- Phase Context & Decisions: `.planning/phases/04-curated-themes-implementation-sample-parity/04-CONTEXT.md`

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Verified directly against installed Next.js 16 packages.
- Architecture: HIGH — Based on proven CSS variable cascade and modular widget designs.
- Pitfalls: HIGH — Exact font option constraints and pointer-event traps verified.

**Research date:** 2026-11-05
**Valid until:** 2026-12-05
