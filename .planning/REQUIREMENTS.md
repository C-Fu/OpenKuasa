# Requirements: OpenKuasa Multi-Theme System & Curated Themes

## Functional Requirements (FR)

### FR-1: Theme Architecture & Engine
- **FR-1.1**: Support selectable theme identifiers stored in `localStorage` (`theme_preset`) and optional cookie for SSR.
- **FR-1.2**: Inlined pre-paint initialization script in `<head>` to prevent flash of unstyled content (FOUC).
- **FR-1.3**: Decouple theme aesthetic preset (e.g. `kuasa`, `proxmox`, `swiss`, `editorial`, `crt`, `blueprint`, `brutalist`, etc.) from mode preference (`light` | `dark` | `system`).
- **FR-1.4**: React hook (`useTheme`) providing active theme, mode, and setters with external store subscriptions (`useSyncExternalStore`).

### FR-2: Theme Selector Component
- **FR-2.1**: Accessible dropdown/popover menu with keyboard navigation and ARIA attributes.
- **FR-2.2**: Visual preview items showing theme name, palette swatches (primary, neutral, accent), and typography preview.
- **FR-2.3**: Integrated into `app-topbar.tsx`, `account-shell.tsx`, and `marketing-header.tsx`.
- **FR-2.4**: Dedicated theme customizer section in Settings (`/settings`).

### FR-3: Curated Design Systems (CSS Variables & Impeccable Standards)
- **FR-3.1**: **Emerald Kuasa** (Default) — Lexend font, 8px/12px radius, signature Malaysian brand jade & module accents.
- **FR-3.2**: **Enterprise Hypervisor / Proxmox** — Pitch-black/charcoal neutral-950, crisp 2-4px radius, amber status telemetry, strict tabular monospace numbers.
- **FR-3.3**: **Monochromatic Swiss / Minimal** — High contrast stark white/black, 0-2px hairline grid borders, pure geometric grotesk typography, no card drop shadows.
- **FR-3.4**: **Industrial CRT Phosphor** — Carbon black, faint phosphor green (#00ff66) / amber raster glow, inset terminal bezels, monospace terminal labels.
- **FR-3.5**: **Warm Executive Editorial** — Dark obsidian / midnight teal with warm parchment tone shifts (#ded7c8), literary serif headings, hairline card borders.
- **FR-3.6**: **Tactile Hardware Rackmount** — Matte chassis steel (#14171a), stamped sheet metal seams, signal rocker orange (#ff5722), industrial sans typography.
- **FR-3.7**: **Deconstructed Blueprint / CAD** — Blueprint cyanotype indigo (#070e1c), technical drafting cyan rules, coordinate margin headers, JetBrains Mono annotations.
- **FR-3.8**: **90s UNIX Workstation (IRIX Motif)** — Directional 3D chisel bevels, desktop stipple teal-slate, square Motif window actions, classic computing tactile feel.
- **FR-3.9**: **SCADA Command Console** — Hardened tactical black (#06080a), division lines (#233345), DEFCON amber & cyber-cyan radar beacons.
- **FR-3.10**: **Brutalist Financial Ledger** — Zero radius (border-radius: 0), thick 2px/4px structural black rules, pure tabular accounting monospace.
- **FR-3.11**: **Analog Tape Deck / VU Console** — Anodized champagne aluminum faceplate, studio walnut accents, halogen VU meter dials.

## Non-Functional Requirements (NFR)
- **NFR-1 (Performance)**: Theme switching must occur in <16ms (single frame) without re-rendering unnecessary component trees or causing layout thrashing.
- **NFR-2 (Compatibility)**: All existing shadcn/ui components (`Button`, `Card`, `Input`, `Dialog`, `Table`, `Select`) must dynamically adapt colors, borders, and radii to the active theme.
- **NFR-3 (Accessibility)**: All color pairings in both light and dark variations of each theme must meet WCAG 2.1 AA contrast requirements (minimum 4.5:1 for body copy).
