# Plan: Phase 2 — CSS Token Specifications & Theme Definitions

## Phase Goal
Structure `src/app/globals.css` and a modular `src/app/themes/` architecture mapping all 12 design systems to Tailwind CSS 4 `@theme` and shadcn UI tokens with full support for light/dark mode, locked signature aesthetics, radii, fonts, and product accents.

## Context & Inputs
- **Context:** `.planning/phases/02-css-token-specifications-theme-definitions/02-CONTEXT.md`
- **Research:** `.planning/phases/02-css-token-specifications-theme-definitions/02-RESEARCH.md`
- **Roadmap:** `.planning/ROADMAP.md` (Phase 2)
- **Engine Setup:** `src/lib/theme.ts` & `src/lib/use-theme.ts` (Phase 1)
- **Prototypes & References:** `sample_themes/` and `.planning/THEMES_LIST.md`

---

## Tasks

### Task 1: Design System CSS Token Architecture & Theme Modularization
**Files to create/modify:**
- `src/app/themes/tokens.css` (or base token definitions)
- `src/app/themes/index.css`
- `src/app/globals.css`

**Action items:**
1. Extract and modularize theme stylesheets into `src/app/themes/`:
   - Keep common Tailwind 4 imports, `@custom-variant dark`, and core `@theme inline` mappings in `src/app/globals.css`.
   - Ensure `@theme inline` exposes semantic tokens:
     - `--font-sans`, `--font-mono`, `--font-heading`
     - `--radius`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`
     - Surfaces & Foregrounds (`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`)
     - Functional & Interactive (`--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--border`, `--input`, `--ring`)
     - Sidebar tokens (`--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`)
     - Chart series tokens (`--chart-1` through `--chart-5`)
     - Brand and product accent tokens (`--brand`, `--pc`, `--pc-soft`, `--pc-ink`, etc.)
2. Wire `@import "./themes/index.css";` into `src/app/globals.css` cleanly.

---

### Task 2: Implement Complete Token Definitions for All 12 Themes
**Files to create:**
- `src/app/themes/kuasa-emerald.css`
- `src/app/themes/proxmox-hypervisor.css`
- `src/app/themes/swiss-monochrome.css`
- `src/app/themes/crt-phosphor.css`
- `src/app/themes/executive-editorial.css`
- `src/app/themes/tactile-rackmount.css`
- `src/app/themes/blueprint-cad.css`
- `src/app/themes/irix-unix.css`
- `src/app/themes/scada-command.css`
- `src/app/themes/factory-plc.css`
- `src/app/themes/brutalist-ledger.css`
- `src/app/themes/analog-tape.css`

**Action items:**
1. **`kuasa-emerald`**:
   - Refactor existing `:root` and `.dark` brand emerald tokens into `src/app/themes/kuasa-emerald.css` scoped to `:root, [data-theme="kuasa-emerald"]` and `.dark, .dark[data-theme="kuasa-emerald"]`.
2. **`proxmox-hypervisor`**:
   - Scoped to `[data-theme="proxmox-hypervisor"]`.
   - Charcoal/neutral-950 canvas (`#0a0a0a`), neutral-900 panels (`#171717`), borders `#262626`.
   - Amber accent (`#f59e0b`), phosphor green status (`#22c55e`). Radius: `0.125rem` (sharp 2px).
3. **`swiss-monochrome`**:
   - Scoped to `[data-theme="swiss-monochrome"]` (and `.dark[data-theme="swiss-monochrome"]`).
   - Stark contrast, hairline borders (`rgba(255,255,255,0.12)` in dark, `rgba(0,0,0,0.12)` in light).
   - Radius: `0px`. High-contrast monochromatic or International Klein Blue accent.
4. **`crt-phosphor`**:
   - Scoped to `[data-theme="crt-phosphor"]`.
   - Cold carbon canvas (`#050806`), dark olive panels (`#0d140f`), terminal phosphor green (`#00ff66`), telemetry amber (`#ffb000`). Radius: `0.125rem`.
5. **`executive-editorial`**:
   - Scoped to `[data-theme="executive-editorial"]` (with light parchment and dark midnight teal).
   - Midnight teal (`#12191f`), warm parchment (`#f8f6f0`), burnished brass/copper (`#d97736` / `#c29b38`), ledger green (`#45b18a`). Radius: `0.5rem`.
6. **`tactile-rackmount`**:
   - Scoped to `[data-theme="tactile-rackmount"]`.
   - Machined 19" chassis steel (`#1a1d20`), anodized panels, rocker switch accents (`#ff3b30`, `#00e5ff`, `#ffcc00`). Radius: `0.25rem`.
7. **`blueprint-cad`**:
   - Scoped to `[data-theme="blueprint-cad"]` (with dark cyanotype `#0b1e36` and light draft paper `#f0f6ff`).
   - Grid line borders (`rgba(56, 189, 248, 0.2)`), neon cyan accent (`#38bdf8`). Radius: `0px`.
8. **`irix-unix`**:
   - Scoped to `[data-theme="irix-unix"]`.
   - SGI Motif 4Dwm indigo/teal (`#2d4452` / `#1c2d37`), 3D directional chisel bevel borders, vibrant gold/indigo accents (`#ffd54f` / `#5c6bc0`). Radius: `0px`.
9. **`scada-command`**:
   - Scoped to `[data-theme="scada-command"]`.
   - Hardened tactical navy/black (`#06090e`), DEFCON amber (`#f59e0b`), radar emerald (`#10b981`), alarm red (`#ef4444`). Radius: `0.125rem`.
10. **`factory-plc`**:
    - Scoped to `[data-theme="factory-plc"]`.
    - Industrial gray-green chassis (`#1e2421`), operator yellow (`#eab308`), e-stop red (`#dc2626`). Radius: `0.25rem`.
11. **`brutalist-ledger`**:
    - Scoped to `[data-theme="brutalist-ledger"]` (light & dark).
    - Dense anti-design accounting table styling, 2px structural borders, mono numerals, delta red/green. Radius: `0px`.
12. **`analog-tape`**:
    - Scoped to `[data-theme="analog-tape"]`.
    - Champagne aluminum chassis (`#2a2621`), walnut panels, warm amber backlit VU meters (`#ffaa33`). Radius: `0.375rem`.

---

### Task 3: Token Validation Suite & Verification
**Files to create/modify:**
- `tests/theme-css.test.ts`
- Run `pnpm build`
- Run `vitest run`

**Action items:**
1. Create automated test `tests/theme-css.test.ts` to assert that:
   - Each of the 12 presets declared in `THEME_PRESETS` has an active CSS definition in `src/app/themes/`.
   - All critical semantic variables (`--background`, `--foreground`, `--primary`, `--border`, `--radius`) are specified for every theme preset.
   - Dual-mode themes define both light and dark variations; locked-mode themes define their signature dark styles.
2. Verify Next.js and Tailwind CSS 4 build:
   - Execute `pnpm build` to guarantee CSS compiles without PostCSS or syntax errors across all 299 routes.
3. Validate that existing product scopes (`[data-product="finance"]`, etc.) and animation keyframes (`specialist-slide`, `twinkle`) remain completely functional.

---

## Success Criteria
- [ ] Modular CSS file structure established under `src/app/themes/` and cleanly linked in `src/app/globals.css`.
- [ ] All 12 themes have complete CSS variable token definitions (backgrounds, surfaces, borders, radii, fonts, accents, and charts).
- [ ] Strict mode compliance: locked themes enforce signature dark presentation; hybrid themes support seamless light and dark switching.
- [ ] Automated token validation tests pass (`tests/theme-css.test.ts`).
- [ ] Production build (`pnpm build`) succeeds with zero errors.
