# Project: OpenKuasa Multi-Theme System & Curated Impeccable Design Engines

## Project Vision & Scope
OpenKuasa is the open-source business OS for Malaysian SMEs. To give users complete visual sovereignty and world-class craft across high-density administrative workflows, marketing surfaces, and executive command centers, this milestone implements an architectural Multi-Theme Engine and Selector, integrated with shadcn/ui and Tailwind CSS 4, populated with curated high-craft design systems (derived from `.planning/THEMES_LIST.md` and reference prototypes in `sample_themes/`).

## Architecture & Technical Mechanism
1. **Dynamic Theme Engine (`src/lib/theme.ts`)**:
   - Extend beyond binary `light | dark` to support full theme presets (e.g. `kuasa-emerald`, `obsidian-hypervisor`, `swiss-monochrome`, `crt-phosphor`, `executive-editorial`, `hardware-rack`, `blueprint-cad`, `irix-unix`, `scada-command`, `factory-plc`, `brutalist-ledger`, `analog-tape`).
   - Store active theme preference in `localStorage` and `data-theme` attribute on `<html>` / `<body>`.
   - Zero-FOUC inline hydration script in root layout.
   - Preserves dark/light variant states and keris slice transitions where appropriate.
2. **Design Tokens & Shadcn/Tailwind 4 Bridge (`src/app/globals.css`)**:
   - Standardize CSS variables for theme-dependent typography, corner radii (`--radius`), surface backgrounds (`--background`, `--card`), borders, and interactive accents.
   - Map module product scopes (`[data-product="..."]`) cleanly inside each theme.
3. **Interactive Theme Selector Component (`src/components/theme/theme-selector.tsx`)**:
   - Accessible dropdown / popover selector integrated cleanly into `app-topbar.tsx`, `marketing-header.tsx`, and user `Settings`.
   - Rich visual preview swatches showing palette, corner radius, and font personality.
4. **Theme Systems Implementation via Impeccable Craft Standards**:
   - Implement curated themes capturing distinct typography (Lexend, Geist, JetBrains Mono, Newsreader, Space Grotesk, Chakra Petch), border radii (0px brutalist to 12px pill), and surface depth models.

## Requirements

### Validated
- ✓ Full-stack Next.js 16 + React 19 + Tailwind CSS 4 + Shadcn UI foundation (`package.json`) — existing
- ✓ Core business modules: Reach, CRM, People, Hire, Finance, Command (`src/app/(app)/...`) — existing
- ✓ Basic light/dark mode toggling with keris-slice view transitions (`src/lib/theme.ts`, `src/components/theme/`) — existing
- ✓ Comprehensive codebase mapping & durable product/design authority (`.planning/codebase/`, `PRODUCT.md`, `DESIGN.md`) — existing

### Active
- [ ] Multi-Theme Architecture: `data-theme` state management, storage, zero-flash head script, and CSS variable token definitions
- [ ] UI Theme Selector: Accessible Popover/Dropdown picker in topbar & settings with theme preview badges
- [ ] Core Curated Themes Implementation:
  - [ ] Emerald Kuasa (Default Malaysian Business OS)
  - [ ] Enterprise Hypervisor / Proxmox (Dense Charcoal & Amber status)
  - [ ] Monochromatic Swiss / Minimal (High-contrast hairline grid)
  - [ ] Industrial CRT Phosphor (Retro terminal green & amber raster)
  - [ ] Warm Executive Editorial (Parchment & midnight teal balance sheet)
  - [ ] Tactical Hardware Rackmount / Physical Front-Panel (Industrial steel & rocker switches)
  - [ ] Deconstructed Blueprint / CAD Spec Sheet (Drafting cyan & coordinate rules)
  - [ ] 90s UNIX Workstation / IRIX Motif (3D directional bevels & classic computing)
  - [ ] SCADA Command Console / Defense Telemetry (Hardened tactical cyan & warning amber)
  - [ ] Brutalist Financial Ledger (Zero-radius anti-design accounting table)
  - [ ] Analog Tape Deck / Studio Console (Walnut & champagne aluminum VU meter)
- [ ] Theme Verification & Visual Regression Audit across all OpenKuasa core screens (Finance, People, CRM, Reach, Command)

### Out of Scope
- Runtime user custom color wheel generator (we provide curated, rigorously crafted design systems).
- Backend database schema migration for themes (theme selection saved client-side in localStorage and cookie for zero-latency SSR).

## Key Decisions
- **Token Architecture**: Controlled via `data-theme="<theme-id>"` on document element, cascading to Tailwind 4 `@theme inline` and shadcn variables.
- **Backwards Compatibility**: Default remains `kuasa-emerald`, preserving existing brand and module accents unless another theme is selected.
- **Reference Authority**: Theme aesthetics, fonts, and geometry follow `.planning/THEMES_LIST.md` and `sample_themes/`.
