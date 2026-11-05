# Phase 3: Interactive Theme Selector Component & Header Integration - Context

**Gathered:** 2026-11-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Create a polished, accessible Theme Selector dropdown/popover featuring miniature mockup cards for all 12 curated themes, an integrated Light/Dark toggle with Keris slice animation, and mount it across key navigation surfaces (`AppTopbar`, `MarketingHeader`, `AccountShell`) while establishing a dedicated Appearance & Theme Gallery in the Account settings area (`/account/appearance`).

</domain>

<decisions>
## Implementation Decisions

### Selector Popover UI & Preview Card Architecture
- **D-01:** Categorized Grid with Groups — Organize the 12 design systems into curated sections/tabs (e.g., 'Modern & Minimal', 'Retro & Workstation', 'Industrial & Hardware') for clean navigation.
- **D-02:** Mini Mockup Card Preview — Each theme item renders a tiny UI abstraction displaying authentic surface colors, header bar, sidebar strip, and card button matching the theme's palette.
- **D-03:** Integrated Popover with Quick Mode Toggle — Popover header includes theme search/filtering and categories; popover footer includes a quick Light/Dark toggle (badged or disabled with a tooltip for signature dark-locked themes).
- **D-04:** Trigger Button Appearance — Clean Lucide Palette icon button with active theme tooltip and subtle accent indicator dot.
- **D-05:** Popover Interaction Flow — Popover stays open upon selecting a theme so users can rapidly preview and compare multiple presets back-to-back.

### Header Mount Points & Mobile Navigation Strategy
- **D-06:** Unified Single Control — `ThemeSelector` completely replaces `ThemeToggle` across all headers, eliminating duplicate buttons while housing both preset switching and the light/dark toggle. — **Reversibility:** costly — (Replaces `ThemeToggle` call sites across `AppTopbar`, `MarketingHeader`, and `AccountShell`).
- **D-07:** Keris Slice Preservation — Toggling Light/Dark mode from within the ThemeSelector popover footer triggers the signature Keris slice animation.
- **D-08:** Preset Switch Transition — Selecting ANY theme preset also triggers the signature Keris slice screen transition for dramatic, seamless visual shifts.
- **D-09:** Mobile Screen Support — Keep the unified ThemeSelector icon button visible in the top header across all screen sizes (<640px and desktop) with touch-friendly 40px/44px target bounds.
- **D-10:** Mounted Surfaces — Integrates into `src/components/app/app-topbar.tsx`, `src/components/marketing/marketing-header.tsx`, and `src/components/account/account-shell.tsx`.

### Settings & Account Integration
- **D-11:** Dedicated `/account/appearance` Route & View — Create a dedicated Appearance page and register `Appearance` in `src/config/account-nav.ts` under the first 'Account' section (alongside 'My profile', 'Security', 'Notifications') with a Palette icon.
- **D-12:** Large Interactive Theme Gallery — Full-page responsive grid of 12 rich mockup cards featuring live color chips, font specimens, archetype badges ('Retro Hardware', 'Modern Enterprise', etc.), and 1-click 'Apply Theme' actions.
- **D-13:** Dedicated Mode Card on Appearance Page — Top card on `/account/appearance` offering explicit System Default, Light, and Dark mode options with live Keris slice feedback.

### Interaction & Persistence
- **D-14:** 1-Click Instant Apply & Persist — Clicking any theme preset immediately updates `data-theme` on `<html>`, synchronizes `localStorage` via `saveThemeState`, and triggers the Keris slice transition without requiring explicit modal confirmation.
- **D-15:** Signature Dark-Locked Theme Handling — When switching to a locked-dark theme (e.g., CRT Phosphor, IRIX Unix, SCADA Command) while in Light mode, automatically switch to Dark mode with an inline indicator notice ('This theme requires dark mode').

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Architecture & Theme Engine
- `src/lib/theme.ts` — Runtime theme state store, `THEME_PRESETS`, locked mode metadata, `saveThemeState`, `resolveEffectiveMode`, and `useSyncExternalStore` subscription.
- `src/components/theme/keris-slice.ts` — Canvas-based Keris slice animation utility (`sliceTheme`, `preloadKeris`).
- `.planning/phases/01-multi-theme-engine-storage-architecture/01-SUMMARY.md` — Phase 1 summary outlining runtime contracts, DOM attributes (`data-theme`, `class="dark"`), and zero-FOUC script.
- `.planning/phases/02-css-token-specifications-theme-definitions/02-SUMMARY.md` — Phase 2 summary outlining CSS tokens for all 12 themes in `src/app/themes/`.
- `.planning/THEMES_LIST.md` — Comprehensive specifications and visual archetypes for all 12 design systems.

### Component & Navigation Integrations
- `src/components/app/app-topbar.tsx` — Main application header mounting search, help, notifications, and theme controls.
- `src/components/marketing/marketing-header.tsx` — Public marketing website header.
- `src/components/account/account-shell.tsx` — Account settings shell and navigation.
- `src/config/account-nav.ts` — Account navigation sections definition (`ACCOUNT_SECTIONS`).
- `src/components/ui/dropdown-menu.tsx` — Radix primitive wrappers for popover/dropdown behaviors.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `radix-ui`: Popover, DropdownMenu, Tabs, and Tooltip primitives already installed and configured in project.
- `sliceTheme` & `preloadKeris` (`src/components/theme/keris-slice.ts`): Signature View Transition animation for theme shifts.
- `THEME_PRESETS` (`src/lib/theme.ts`): Metadata dictionary containing all 12 theme IDs, names, descriptions, and `lockedMode` properties.
- `Button` (`src/components/ui/button.tsx`): Ghost and icon button variants for header triggers.

### Established Patterns
- Client components use `'use client'` directive.
- Icons from `lucide-react`.
- Tailwind CSS 4 `@theme` tokens and semantic color classes (`bg-popover`, `text-popover-foreground`, `ring-foreground/10`).
- Account settings pages live under `src/app/account/[section]/page.tsx` wrapped by `AccountShell`.

### Integration Points
- `src/components/theme/theme-selector.tsx`: New component housing the unified selector popover.
- Header replacements: Swap `ThemeToggle` for `ThemeSelector` in `app-topbar.tsx`, `marketing-header.tsx`, and `account-shell.tsx`.
- `src/app/account/appearance/page.tsx`: New page rendering the theme gallery and mode selector card.
- `src/config/account-nav.ts`: Add `Appearance` nav item under the 'Account' section.

</code_context>

<specifics>
## Specific Ideas
- Tiny mockup cards in the popover and large mockup cards on `/account/appearance` should authentically represent the distinct aesthetics of the themes (e.g. green terminal glow for CRT Phosphor, cyanotype drafting borders for Blueprint CAD, stark Swiss monochrome rules).
- The popover remains open on selection for seamless previewing across themes, with instant Keris slice visual execution.

</specifics>

<deferred>
## Deferred Ideas
- Custom user hex-color builder / custom palette generator (planned for future milestone).
- Full application component parity audits (scoped for Phase 4 & Phase 5).

</deferred>

---

*Phase: 03-interactive-theme-selector-component-header-integration*
*Context gathered: 2026-11-05*
