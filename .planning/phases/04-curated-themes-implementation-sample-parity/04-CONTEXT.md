# Phase 4: Curated Themes Implementation & Sample Parity - Context

**Gathered:** 2026-11-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement the full visual personality, tactile skeuomorphism, bespoke typography, and sample prototype parity for all 12 curated themes defined in `.planning/THEMES_LIST.md` and reference HTML mockups in `sample_themes/`. This bridges base CSS token variables from Phase 2 into authentic, tactile component styling and provides a modular library of reusable tactile micro-widgets (`src/components/theme-widgets/`).

</domain>

<decisions>
## Implementation Decisions

### Aesthetic Skeuomorphism vs Semantic Compatibility
- **D-01:** CSS-driven authentic skeuomorphism — Inject custom borders, directional 3D chisel bevels, CRT phosphor text glows, and CAD drafting registration lines through scoped `[data-theme='...']` CSS rules targeting standard HTML/Tailwind elements without breaking standard shadcn component APIs.
- **D-02:** Subtle, non-intrusive scanline overlay with disable toggle — For CRT Phosphor and SCADA Command, provide faint CSS scanline patterns and gentle ambient phosphor text glows on headings and status badges, keeping data tables and numbers razor-sharp and readable.
- **D-03:** Scoped CSS button bevels — Standard shadcn `Button` elements automatically gain directional 3D borders (light top/left, dark bottom/right) and active inset depressions when `irix-unix` or `tactile-rackmount` is active.
- **D-04:** Ambient subtle CSS drafting grid — For Blueprint CAD and Brutalist Ledger, render faint coordinate grid backgrounds on layout canvases and hairline crosshairs on cards, preserving high text contrast and legibility.

### Theme Font Strategy & Google Fonts Integration
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

### Sample HTML Prototypes Feature Parity Scope
- **D-08:** Dedicated Tactile UI Widget Library (`src/components/theme-widgets/`) — Create modular, reusable micro-widgets inspired by the `sample_themes/` prototypes:
  - `VuMeter`: Audio/telemetry level indicator (LED segments, needle dial, or minimalist strip).
  - `TelemetryBeacon`: Pulsing status radar / LED hardware beacon with multi-state health indicators.
  - `RockerSwitch`: Heavy tactile toggle rocker with authentic click feedback.
  - `CadCrosshair`: Corner registration marks and coordinate annotation chips for drafting cards.
  - `TapeReel`: Rotating tape hub / reel visual abstraction for analog consoles.
- **D-09:** Universal Fallback with Signature Skin — Tactile widgets dynamically adapt their visual presentation based on the active theme preset (e.g., `VuMeter` displays LED bars in SCADA/Proxmox, needle dial in Analog Tape, and sleek minimalist strip in Swiss Monochrome).

### Component Override Mechanism & Textures
- **D-10:** Layered CSS Theme Extensions (`src/app/themes/*.css`) — Contain all visual rules inside theme CSS files targeting standard HTML and Tailwind classes (`[data-theme='irix-unix'] .btn`, `[data-theme='blueprint-cad'] .card`), requiring zero changes to existing page JSX.
- **D-11:** Pure CSS Texture Utilities — Implement scanlines (`.scanline-overlay`), CAD grids (`.cad-grid-bg`), and rack ears (`.rack-ears`) using lightweight GPU-accelerated CSS gradients and SVG background patterns rather than heavy Canvas/WebGL shaders or static raster images.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Prototypes & Visual Specifications
- `sample_themes/` — 10 authentic single-file HTML mockups demonstrating typography, tactile bevels, grid lines, and interactive widgets:
  - `sample_themes/analog_audio_mastering_tape_deck_simulator.html`
  - `sample_themes/architectural_blueprint_cad_spec_sheet.html`
  - `sample_themes/brutalist_financial_audit_ledger.html`
  - `sample_themes/industrial_telemetry_crt_phosphor_terminal_rack.html`
  - `sample_themes/irix_6_5_4dwm_unix_workstation_simulator.html`
  - `sample_themes/japanese_industrial_plc_factory_hmi_simulator.html`
  - `sample_themes/neo-brutalist-dieter-rams.html`
  - `sample_themes/strategic_defense_telemetry_scada_command_console.html`
  - `sample_themes/tactile-hardware-rackmount.html`
  - `sample_themes/warm_executive_editorial_hardware_briefing.html`
- `.planning/THEMES_LIST.md` — Detailed breakdown of all 12 design systems, palettes, geometry, and design principles.

### Architecture & CSS Token Infrastructure
- `src/lib/theme.ts` — Runtime theme state store, presets, and locked mode metadata.
- `src/app/themes/` — Modular CSS token files for all 12 themes created in Phase 2 (`index.css` and individual preset definitions).
- `src/app/globals.css` — Base Tailwind CSS 4 theme imports and global styles.
- `src/app/layout.tsx` — Root layout where `next/font/google` font variable bindings and theme initialization script reside.
- `.planning/phases/02-css-token-specifications-theme-definitions/02-SUMMARY.md` — Token definitions and mappings.
- `.planning/phases/03-interactive-theme-selector-component-header-integration/03-CONTEXT.md` — Popover selector and appearance gallery specifications.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/themes/*.css`: 12 separate theme CSS files defining color, background, card, border, and font variables per `[data-theme='...']`.
- `src/components/theme/keris-slice.ts`: Signature canvas-based screen slice animation.
- `src/components/ui/button.tsx`, `card.tsx`, `badge.tsx`, `switch.tsx`: Standard shadcn UI primitives to be enhanced via scoped theme CSS rules.

### Established Patterns
- DOM attribute stamping: `<html data-theme="..." class="...">`.
- Next.js 16 with Tailwind CSS 4 `@theme` integration using CSS variables.
- Modular theme styling in `src/app/themes/`.

### Integration Points
- `src/app/layout.tsx`: Mount Google Fonts (`next/font/google`) and inject font CSS variables into root `<html>` or `<body>`.
- `src/app/themes/*.css`: Deepen CSS rules with tactile bevels, scanline overlays, card header styling, and crosshair decorations.
- `src/components/theme-widgets/`: New directory containing `VuMeter`, `TelemetryBeacon`, `RockerSwitch`, `CadCrosshair`, and `TapeReel`.
- `src/app/account/appearance/page.tsx`: Showcase tactile widgets alongside full theme gallery cards.

</code_context>

<specifics>
## Specific Ideas
- SGI IRIX window titlebar bevels and active button depressions should feel convincingly authentic to Silicon Graphics 4Dwm Motif.
- The Blueprint CAD drafting look should use genuine cyanotype blues, monospaced coordinate markers `[X: 104.2 Y: 89.1]`, and subtle crosshairs at card corners.
- CRT Phosphor should feature an ambient green text glow (`text-shadow: 0 0 8px rgba(34, 197, 94, 0.6)`) on headers without hindering table reading.

</specifics>

<deferred>
## Deferred Ideas
- Interactive audio sound effects (e.g. vintage mechanical keyboard clicks, switch clunks, tape hiss) — deferred to a future polish/audio milestone.
- Full multi-page visual regression testing across all routes — scoped for Phase 5.

</deferred>

---

*Phase: 04-Curated Themes Implementation & Sample Parity*
*Context gathered: 2026-11-05*
