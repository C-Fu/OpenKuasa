# Context: Phase 2 — CSS Token Specifications & Theme Definitions

## Overview
Phase 2 establishes the modular CSS token architecture in `src/app/globals.css` and dedicated modular CSS files for OpenKuasa. With Phase 1 providing the zero-FOUC runtime engine (`data-theme="..."` and `.dark`), Phase 2 provides the CSS variable definitions and Tailwind CSS 4 `@theme` mappings for all 12 design systems.

## Requirements Addressed
- **REQ-CSS-01**: Modular CSS architecture separating base tokens, typography tokens, component tokens, and per-theme definitions.
- **REQ-CSS-02**: Tailwind CSS 4 inline `@theme` integration preserving existing shadcn semantic tokens (`--background`, `--foreground`, `--card`, `--border`, `--primary`, `--ring`, etc.) while adding custom design variables (`--radius`, typography, accents).
- **REQ-CSS-03**: Support for all 12 themes defined in `.planning/THEMES_LIST.md` and `src/lib/theme.ts`:
  1. `kuasa-emerald` (default)
  2. `proxmox-hypervisor`
  3. `swiss-monochrome`
  4. `crt-phosphor`
  5. `executive-editorial`
  6. `tactile-rackmount`
  7. `blueprint-cad`
  8. `irix-unix`
  9. `scada-command`
  10. `factory-plc`
  11. `brutalist-ledger`
  12. `analog-tape`
- **REQ-CSS-04**: Robust light/dark support for flexible themes, and strict signature dark styling for locked hardware/retro themes.
- **REQ-CSS-05**: Maintain existing product scope styling (`[data-product="finance"]`, `[data-product="crm"]`, etc.) with intelligent fallback to theme-specific accents.

## Design Decisions
1. **Modular CSS Structure**:
   - Rather than bloating `src/app/globals.css` into thousands of lines, organize theme rules cleanly under `src/app/themes/` (or structured imports in `globals.css` via `@import "./themes/..."` or separate layer files).
   - Ensure `src/app/globals.css` remains clean and maintainable.
2. **Selector Conventions**:
   - Base/Default: `:root, [data-theme="kuasa-emerald"]`
   - Specific theme: `[data-theme="proxmox-hypervisor"]`, `[data-theme="swiss-monochrome"]`, etc.
   - Dark mode for theme: `.dark[data-theme="..."]`, `[data-theme="..."] .dark`, or simply `.dark[data-theme="..."]` on `html`. Since `html` carries both `class="dark"` and `data-theme="xyz"`, `html[data-theme="..."]` and `html.dark[data-theme="..."]` (or `:root[data-theme="..."]` / `.dark[data-theme="..."]`) provide ultra-clean, deterministic specificity.
3. **Typography Strategy**:
   - Use CSS variables (`--font-sans`, `--font-mono`, `--font-heading`) with appropriate fallback font stacks (e.g. system monospace, grotesk, serif) so themes look authentic immediately even prior to downloading external webfonts, while integrating Next.js font variables smoothly.
4. **Preservation of Keris Slice View Transition & Animations**:
   - Keep `.theme-slicing`, `.animate-twinkle`, and `@keyframes specialist-slide` intact.
