# Research: Phase 2 — CSS Token Specifications & Theme Definitions

## Objective
Identify the exact CSS token structure, Tailwind CSS 4 `@theme` compatibility, modular CSS file architecture, and theme palette values extracted from the reference prototypes in `sample_themes/` and `.planning/THEMES_LIST.md`.

## Analysis of Existing Setup & Tailwind CSS 4

1. **Tailwind CSS 4 `@theme`**:
   - `globals.css` uses `@theme inline { ... }` linking CSS custom properties to Tailwind utility classes.
   - For example:
     - `--color-background: var(--background);`
     - `--color-foreground: var(--foreground);`
     - `--color-card: var(--card);`
     - `--color-card-foreground: var(--card-foreground);`
     - `--color-primary: var(--primary);`
     - `--color-primary-foreground: var(--primary-foreground);`
     - `--color-muted: var(--muted);`
     - `--color-muted-foreground: var(--muted-foreground);`
     - `--color-accent: var(--accent);`
     - `--color-accent-foreground: var(--accent-foreground);`
     - `--color-destructive: var(--destructive);`
     - `--color-border: var(--border);`
     - `--color-input: var(--input);`
     - `--color-ring: var(--ring);`
     - `--radius-*: ...` calculated from `var(--radius)`
     - `--font-sans: var(--font-sans);`
     - `--font-mono: var(--font-mono);`
     - `--font-heading: var(--font-heading, var(--font-sans));`
   - Custom utility variables:
     - `--radius` dictates corner roundness (e.g. `0.75rem` default, `0.125rem` or `0` for Proxmox / Swiss / Brutalist, `0.375rem` for Tactile, etc.).

2. **Modular File Architecture**:
   - In Tailwind CSS 4 / Next.js with PostCSS/Turbopack, CSS `@import` statements can be used cleanly:
     - `src/styles/themes/` or `src/app/themes/`:
       - `theme-base.css` (shared base tokens, `@theme inline`, animations)
       - `kuasa-emerald.css`
       - `proxmox-hypervisor.css`
       - `swiss-monochrome.css`
       - `crt-phosphor.css`
       - `executive-editorial.css`
       - `tactile-rackmount.css`
       - `blueprint-cad.css`
       - `irix-unix.css`
       - `scada-command.css`
       - `factory-plc.css`
       - `brutalist-ledger.css`
       - `analog-tape.css`
       - `index.css` (combining all themes)
     - `src/app/globals.css` imports `@import "./themes/index.css";` (or imports them directly).

3. **Color Palettes & Specifications**:
   - **`kuasa-emerald`**:
     - Light: Background white, foreground slate-900, primary deep emerald jade `oklch(0.52 0.125 164)`, radius `0.75rem`.
     - Dark: Background `oklch(0.17 0.015 250)`, primary bright emerald `oklch(0.64 0.13 164)`.
   - **`proxmox-hypervisor`**:
     - Vibe: Neutral pitch charcoal (`#0a0a0a` / `#121212`), borders crisp `#262626`, accents industrial amber (`#f59e0b` / `#ea580c`) and phosphor green (`#22c55e`). Radius: `0.125rem` / `2px`. Font: monospace numeric accents.
   - **`swiss-monochrome`**:
     - Vibe: High contrast black/white (`#000000` dark, `#ffffff` light), zero card gradients, hairline borders (`rgba(255,255,255,0.12)` or `rgba(0,0,0,0.12)`), radius: `0px` or `2px`. Accent: International Klein Blue (`#2563eb`) or pure high-contrast monochrome inversion.
   - **`crt-phosphor`**:
     - Vibe: Cold carbon black (`#050806`), dark olive panels (`#0d140f`), phosphor terminal green text/accents (`#00ff66`), telemetry amber (`#ffb000`), radius: `0.125rem`, scanline aesthetic.
   - **`executive-editorial`**:
     - Vibe: Dark petrol slate (`#0d1317`) / light warm parchment (`#f8f6f0`), deep midnight teal surfaces (`#12191f`), burnished brass/copper accents (`#d97736` / `#c29b38`), accounting ledger green (`#45b18a`). Literary serif font accents, generous radius `0.5rem`.
   - **`tactile-rackmount`**:
     - Vibe: Machined 19" chassis steel faceplate (`#1a1d20`), dark anodized aluminum, safety rocker switch accents (`#ff3b30`, `#00e5ff`, `#ffcc00`), countersunk screw border effects, radius `0.25rem`.
   - **`blueprint-cad`**:
     - Vibe: Cyanotype drafting blueprint (`#0b1e36` deep dark cyan / `#f0f6ff` light draft paper), grid line borders (`rgba(56, 189, 248, 0.2)`), drafting neon cyan accents (`#38bdf8`), technical annotations, radius `0px` or `2px`.
   - **`irix-unix`**:
     - Vibe: Silicon Graphics IRIX 4Dwm Motif teal/indigo (`#2d4452` / `#1c2d37`), 3D directional chisel bevels (highlight/shadow borders), vibrant Indigo & Gold accents (`#5c6bc0` / `#ffd54f`), radius `0px`.
   - **`scada-command`**:
     - Vibe: Hardened defense console, deep tactical navy/black (`#06090e`), radar sweeps, DEFCON amber (`#f59e0b`), radar emerald (`#10b981`), critical alarm red (`#ef4444`), radius `0.125rem`.
   - **`factory-plc`**:
     - Vibe: Industrial Mitsubishi/Siemens HMI panel, industrial gray-green chassis (`#1e2421`), high-visibility operator yellow (`#eab308`), e-stop red (`#dc2626`), high-contrast buttons, radius `0.25rem`.
   - **`brutalist-ledger`**:
     - Vibe: Anti-design accounting tabular ledger, dense 2px high-contrast structural rules, mono numbers, stark monochrome with accounting red/green deltas, radius `0px`.
   - **`analog-tape`**:
     - Vibe: Champagne brushed aluminum (`#2a2621` chassis), warm walnut side panels, backlit warm amber VU meters (`#ffaa33`), soft incandescent glow, radius `0.375rem`.

## Verification Strategy
- **Syntax & Build Check**: Run `pnpm build` to verify Tailwind CSS 4 compiles all theme classes, layers, and custom properties without syntax errors.
- **Unit & Integration Tests**: Update or add tests verifying that all 12 theme selectors have corresponding tokens defined (checking CSS file presence and token key completeness).
- **Smoke Route Check**: Run `scripts/smoke-routes.mjs` (or inspect sample route with different `data-theme` values).
