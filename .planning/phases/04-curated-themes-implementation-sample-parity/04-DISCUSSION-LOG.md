# Phase 4: Curated Themes Implementation & Sample Parity - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-11-05
**Phase:** 4-Curated Themes Implementation & Sample Parity
**Areas discussed:** Aesthetic Skeuomorphism vs Semantic Compatibility, Theme Font Strategy & Google Fonts Integration, Sample HTML Prototypes Feature Parity Scope, Component Override Mechanism

---

## Aesthetic Skeuomorphism vs Semantic Compatibility

### Question: How should custom tactile elements (SGI bevels, CRT glow/scanlines, CAD grids) be applied to base components?
| Option | Description | Selected |
|--------|-------------|----------|
| CSS-driven authentic skeuomorphism | Inject custom borders/bevels/effects via scoped `[data-theme="..."]` CSS overrides without breaking standard shadcn component APIs | ✓ |
| Strict semantic tokens only | Keep components standard flat boxes and strictly rely on colors, fonts, and border radii without custom bevels, scanlines, or glow effects | |
| Opt-in utility classes | Only apply custom effects when developers explicitly add specialized classes to specific cards or headers | |

**User's choice:** CSS-driven authentic skeuomorphism

### Question: For the CRT Phosphor and SCADA Command themes, how intense should the scanline and terminal glow effects be?
| Option | Description | Selected |
|--------|-------------|----------|
| Subtle, non-intrusive scanline overlay with disable toggle | Light CSS scanline pattern and faint amber/green text-shadow on headings and badges, keeping standard data tables crisp and readable | ✓ |
| Full retro simulation | CRT screen curvature vignette, visible flicker animation, and pronounced scanlines across the entire viewport | |
| Static styling only | Authentic green/amber phosphor colors and monospaced typography, but zero animated flicker or background scanlines | |

**User's choice:** Subtle, non-intrusive scanline overlay with disable toggle

### Question: For SGI IRIX 4Dwm and Tactile Rackmount, how should buttons and input bevels be handled?
| Option | Description | Selected |
|--------|-------------|----------|
| Scoped CSS button bevels | Standard shadcn Button automatically gets directional 3D borders and active inset depression when `data-theme="irix-unix"` or `"tactile-rackmount"` is active | ✓ |
| Dedicated TactileButton component | Leave standard Button alone and only show directional bevels on custom tactile-specific buttons | |
| Flat borders with vintage colorway | Use IRIX / rackmount color palettes and sharp corners, but keep button borders flat 1px | |

**User's choice:** Scoped CSS button bevels

### Question: For Blueprint CAD and Brutalist Ledger, how should background gridlines and drafting rules be rendered?
| Option | Description | Selected |
|--------|-------------|----------|
| Ambient subtle CSS grid | Render faint coordinate grid background on body or main wrapper with hairline crosshair accents on cards, maintaining high contrast for text | ✓ |
| Heavy technical drafting overlay | Dense graph paper background with millimeter ticks, corner registration marks, and dimension measurement callouts across all cards | |
| Minimalist paper mode | Clean light cyan/dark navy paper background without background coordinate gridlines | |

**User's choice:** Ambient subtle CSS grid

---

## Theme Font Strategy & Google Fonts Integration

### Question: How should the typography font assets be loaded for specialized themes (IRIX, CRT, CAD, Editorial)?
| Option | Description | Selected |
|--------|-------------|----------|
| Next.js `next/font/google` in root layout | Preload Google fonts with `display: 'swap'` and CSS variable bindings mapped to theme tokens with zero layout shift and local caching | ✓ |
| Local bundled TTF/WOFF2 font files | Place all required webfonts inside `public/fonts/` for 100% offline self-hosted independence | |
| System fallback fonts only | Strictly use OS built-in fonts without downloading any webfonts | |

**User's choice:** Next.js `next/font/google` in root layout

### Question: Which font bundle strategy should we adopt to balance visual authenticity with page load performance?
| Option | Description | Selected |
|--------|-------------|----------|
| Curated core subset of 4 high-impact font variables | Load Lexend, Inter/Geist, JetBrains Mono, and Newsreader aliased per theme | |
| Comprehensive individual font per theme | Load 8+ unique fonts (Chivo Mono, Space Grotesk, IBM Plex Sans, Silkscreen, VT323, Courier Prime, etc.) exactly mirroring each individual prototype HTML file | ✓ |
| Dual-stack only (Sans + Mono) | Only load one modern Sans font and one Monospace font across all themes | |

**User's choice:** Comprehensive individual font per theme

### Question: How should the theme CSS variables handle fallback font stacks if webfonts fail or take time to load?
| Option | Description | Selected |
|--------|-------------|----------|
| Robust system font fallback chains | Declare immediate OS-level fallbacks in CSS variable definitions | |
| Strict webfont wait | Require fonts to be loaded before rendering text to prevent any visual substitution | ✓ |

**User's choice:** Strict webfont wait

---

## Sample HTML Prototypes Feature Parity Scope

### Question: How should unique interactive widgets from the prototype samples (VU meters, telemetry beacons, rocker switches) be integrated?
| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated Tactile UI Widget Library (`src/components/theme-widgets/`) | Build modular reusable micro-widgets (VuMeter, TelemetryBeacon, RockerSwitch, CadCrosshair, TapeReel) that can be showcased on the Appearance gallery page and embedded into relevant dashboard cards | ✓ |
| Appearance Gallery Showcase Only | Build these widgets strictly inside the `/account/appearance` gallery preview panels | |
| Pure CSS styling on standard components | Don't build new widget components; only re-skin existing standard components | |

**User's choice:** Dedicated Tactile UI Widget Library (`src/components/theme-widgets/`)

### Question: When tactile widgets (e.g. VuMeter, TelemetryBeacon) are used in views, how should they behave if the user switches themes?
| Option | Description | Selected |
|--------|-------------|----------|
| Universal fallback with signature skin | The widgets function in all themes, but dynamically adopt theme-appropriate skinning (e.g. LED bar vs analog needle dial vs minimalist strip) | ✓ |
| Theme-gated display | Widgets only appear or render when their native corresponding theme is active | |
| Static decorative styling | Widgets have fixed vintage styling and always retain their retro hardware look regardless of active theme | |

**User's choice:** Universal fallback with signature skin

---

## Component Override Mechanism

### Question: How should theme-specific structural styling (e.g. IRIX window bevels, CAD registration lines) be implemented?
| Option | Description | Selected |
|--------|-------------|----------|
| Layered CSS Theme Extensions (`src/app/themes/*.css`) | Keep all visual rules inside theme CSS files targeting standard HTML/Tailwind classes, requiring zero changes to component JSX | ✓ |
| Component Variant Props | Add theme-specific variant props to shadcn components | |
| Theme Context Wrapper Components | Wrap distinct views in high-level theme wrappers that conditionally render alternate DOM elements | |

**User's choice:** Layered CSS Theme Extensions (`src/app/themes/*.css`)

### Question: For heavy textural backgrounds (CAD coordinate grids, SCADA telemetry radar lines, tape deck brushed aluminum / walnut grain), what rendering technique should be used?
| Option | Description | Selected |
|--------|-------------|----------|
| Pure CSS utility classes (`.scanline-overlay`, `.cad-grid-bg`, `.rack-ears`) | Injected via layout root or opt-in card decorations for high GPU performance and minimal bundle size | ✓ |
| Canvas or SVG WebGL shader backgrounds | Render active CRT phosphor curves and animated tape reels using real-time canvas contexts | |
| Fixed background images | Use static PNG/SVG image assets for gridlines, woodgrain, and chassis textures | |

**User's choice:** Pure CSS utility classes

---

## The Agent's Discretion
- Exact CSS keyframe animations for scanline flicker and LED beacon pulse speeds.
- SGI 4Dwm window title bar layout details and corner bevel thickness.
- Color stopping positions on the CAD blueprint ambient background grid.

## Deferred Ideas
- Interactive audio sound effects (e.g. mechanical keyboard clicks, switch clunks, tape hiss) — deferred to a future polish/audio milestone.
- Full multi-page visual regression testing across all routes — scoped for Phase 5.
