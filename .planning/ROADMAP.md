# Project Roadmap: OpenKuasa Multi-Theme System & Curated Design Engines

## Phase Overview

```mermaid
graph TD
  P1["Phase 1: Multi-Theme Engine & Storage Architecture"] --> P2["Phase 2: CSS Token Specifications & Theme Definitions"]
  P2 --> P3["Phase 3: Interactive Theme Selector Component & Header Integration"]
  P3 --> P4["Phase 4: Curated Themes Implementation & Sample Parity"]
  P4 --> P5["Phase 5: Full Application Audit & Visual Verification"]
```

---

### Phase 1: Multi-Theme Engine & Storage Architecture
**Goal:** Build the foundation for multi-theme switching without FOUC, extending `src/lib/theme.ts` to support both theme presets and light/dark modes.
- Extend `src/lib/theme.ts` with `THEME_PRESET_KEY`, available preset constants, and reactive subscription hooks.
- Update `THEME_INIT_SCRIPT` for early pre-paint DOM attribute stamping (`data-theme="..."` and `.dark`).
- Add tests in `vitest` verifying theme resolution, persistence, and fallback logic.

### Phase 2: CSS Token Specifications & Theme Definitions
**Goal:** Structure `src/app/globals.css` with modular `@layer` / data-theme attributes mapped to Tailwind CSS 4 `@theme` and shadcn tokens.
- Define CSS custom properties per theme for:
  - Font families (`--font-sans`, `--font-mono`, `--font-heading`)
  - Border radii (`--radius`, `--radius-sm`, `--radius-lg`, etc.)
  - Surfaces & foregrounds (`--background`, `--foreground`, `--card`, `--border`, `--input`, `--ring`)
  - Accent colors and product module overrides (`--pc`, `--primary`)
- Ensure clean transitions and dark mode overrides per theme.

### Phase 3: Interactive Theme Selector Component & Header Integration
**Goal:** Create a polished, accessible Theme Selector dropdown/popover and mount it in key application headers.
**Plans:** 2/2 plans complete

Plans:
- [x] 03-01-PLAN.md — Popover primitive, ThemeMockupCard, ThemeSelector interactive popover, and tests
- [x] 03-02-PLAN.md — Header replacements across AppTopbar, MarketingHeader, AccountShell + Appearance page & nav registration

### Phase 4: Curated Themes Implementation & Sample Parity
**Goal:** Implement the full collection of curated themes from `.planning/THEMES_LIST.md` and reference prototypes in `sample_themes/`.
**Plans:** 2 plans

Plans:
**Wave 1**
- [ ] 04-01-PLAN.md — Core Typography (`next/font/google` in layout) + Scoped Skeuomorphic CSS & Visual Personality across all 12 themes

**Wave 2** *(blocked on Wave 1 completion)*
- [ ] 04-02-PLAN.md — Tactile UI Widget Library (`src/components/theme-widgets/*`), tests, and Appearance Gallery parity showcase

- Batch 1 (Tech & Minimalist):
  - Enterprise Hypervisor (Proxmox VE dense charcoal)
  - Monochromatic Swiss / Minimal (High-contrast hairline grid)
  - Industrial CRT Phosphor (Retro green terminal)
  - Deconstructed Blueprint / CAD Spec Sheet
- Batch 2 (Executive, Physical & Tactile):
  - Warm Executive Editorial (Parchment & midnight teal balance sheet)
  - Tactile Hardware Rackmount (Industrial steel & rocker switches)
  - 90s UNIX Workstation (IRIX 4Dwm directional bevels)
  - SCADA Command Console (Defense telemetry & amber radar)
  - Brutalist Financial Ledger (Zero-radius anti-design accounting table)
  - Analog Tape Deck / VU Console (Champagne aluminum & walnut)

### Phase 5: Full Application Audit & Visual Verification
**Goal:** Rigorously verify all core screens and components under every theme preset across both light and dark modes.
**Plans:** 3 plans

Plans:
- [ ] 05-01-PLAN.md — Test Infrastructure & Automated Multi-Theme Route Crawling
- [ ] 05-02-PLAN.md — Visual Audit Engine & Contrast Assurance
- [ ] 05-03-PLAN.md — In-Place Theme Remediation & Verification Seal

