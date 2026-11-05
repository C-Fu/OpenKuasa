# Phase 1: Multi-Theme Engine & Storage Architecture — Technical Research

## Executive Summary
This research document provides the implementation specifications for Phase 1 of OpenKuasa's Multi-Theme Architecture. It addresses the evolution from a binary light/dark mode switch into a multi-preset theme engine supporting orthogonal light/dark modes (or mode locking for dedicated hardware aesthetics), zero-FOUC client initialization, React 19 external store synchronization, backwards compatibility, and unit testing with Vitest.

---

## 1. Expanding `src/lib/theme.ts` Architecture

### 1.1 Type Definitions & Preset Registry
`src/lib/theme.ts` must expand to support the 12 design systems identified in the project roadmap while maintaining backwards compatibility with existing consumers.

```typescript
export const THEME_STORAGE_KEY = 'theme_preset';
export const MODE_STORAGE_KEY = 'theme_mode';

// Backwards compatibility alias
export const THEME_KEY = 'theme';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemePreset =
  | 'kuasa-emerald'
  | 'proxmox-hypervisor'
  | 'swiss-monochrome'
  | 'crt-phosphor'
  | 'executive-editorial'
  | 'tactile-rackmount'
  | 'blueprint-cad'
  | 'irix-unix'
  | 'scada-command'
  | 'factory-plc'
  | 'brutalist-ledger'
  | 'analog-tape';

export interface ThemeConfig {
  id: ThemePreset;
  name: string;
  description: string;
  supportsLightDark: boolean;
  defaultMode?: 'light' | 'dark';
}

export const THEME_PRESETS: Record<ThemePreset, ThemeConfig> = {
  'kuasa-emerald': {
    id: 'kuasa-emerald',
    name: 'Kuasa Emerald',
    description: 'Signature enterprise emerald & neutral surfaces',
    supportsLightDark: true,
  },
  'proxmox-hypervisor': {
    id: 'proxmox-hypervisor',
    name: 'Proxmox Hypervisor',
    description: 'High-density enterprise virtualization console with amber telemetry',
    supportsLightDark: false,
    defaultMode: 'dark',
  },
  'swiss-monochrome': {
    id: 'swiss-monochrome',
    name: 'Swiss Monochrome',
    description: 'Stark neo-brutalist minimal grid & typography',
    supportsLightDark: true,
  },
  'crt-phosphor': {
    id: 'crt-phosphor',
    name: 'CRT Phosphor',
    description: 'Cathode terminal phosphor green & telemetry amber',
    supportsLightDark: false,
    defaultMode: 'dark',
  },
  'executive-editorial': {
    id: 'executive-editorial',
    name: 'Executive Editorial',
    description: 'Literary serif briefing, obsidian slate, & burnished brass',
    supportsLightDark: true,
  },
  'tactile-rackmount': {
    id: 'tactile-rackmount',
    name: 'Tactile Rackmount',
    description: 'SECC chassis steel, 19-inch appliance front panels & rocker switches',
    supportsLightDark: false,
    defaultMode: 'dark',
  },
  'blueprint-cad': {
    id: 'blueprint-cad',
    name: 'Blueprint CAD',
    description: 'Technical ISO drafting cyanotype & vellum schematics',
    supportsLightDark: true,
    defaultMode: 'dark',
  },
  'irix-unix': {
    id: 'irix-unix',
    name: 'IRIX UNIX Workstation',
    description: '90s Silicon Graphics 4Dwm directional 3D chisel bevels & Motif GUI',
    supportsLightDark: false,
    defaultMode: 'dark',
  },
  'scada-command': {
    id: 'scada-command',
    name: 'SCADA Command Center',
    description: 'Hardened tactical perimeter, defense telemetry & cyber-cyan',
    supportsLightDark: false,
    defaultMode: 'dark',
  },
  'factory-plc': {
    id: 'factory-plc',
    name: 'Factory PLC',
    description: 'Industrial automation touchscreen, OMRON slate & pilot lamps',
    supportsLightDark: false,
    defaultMode: 'dark',
  },
  'brutalist-ledger': {
    id: 'brutalist-ledger',
    name: 'Brutalist Ledger',
    description: 'High-contrast accounting monolith, 0px radii & ASCII tabular rules',
    supportsLightDark: true,
    defaultMode: 'light',
  },
  'analog-tape': {
    id: 'analog-tape',
    name: 'Analog Tape Console',
    description: 'Studer studio walnut, gunmetal faceplates & warm VU meters',
    supportsLightDark: false,
    defaultMode: 'dark',
  },
};

export const DEFAULT_THEME_PRESET: ThemePreset = 'kuasa-emerald';
export const DEFAULT_THEME_MODE: ThemeMode = 'system';
```

### 1.2 Backwards-Compatible Types & Methods
To prevent breaking existing code (`ThemeToggle`, `ThemeSync`, `isDarkSnapshot`, and tests):
- Maintain `type Theme = 'light' | 'dark'` as an alias for binary mode.
- Maintain `resolveTheme()`, `applyTheme()`, `saveTheme()` with backward compatibility:
  - `resolveTheme()` resolves whether the current active state is light or dark (evaluating preset mode locks, `theme_mode`, and system media preference).
  - `applyTheme(theme: Theme | ThemePreset, mode?: ThemeMode)`: Accepts either legacy binary `'light' | 'dark'` OR preset name and mode.
  - `saveTheme(theme: Theme | ThemePreset, mode?: ThemeMode)`: Updates storage accordingly.
  - Expose new modern functions: `resolveThemePreset()`, `resolveThemeMode()`, `resolveEffectiveMode()`, `applyThemeState()`, `saveThemeState()`.

---

## 2. Inlined Pre-Paint Script (`THEME_INIT_SCRIPT`)

### 2.1 Zero-FOUC Pre-Paint Execution
In Next.js App Router (`src/app/layout.tsx`), the script is rendered at the top of `<body>` with a CSP nonce:
`<script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />`

### 2.2 Script Logic Requirements
1. Read `localStorage.getItem("theme_preset")` (fallback to `"kuasa-emerald"`). Validate that it matches known presets; if invalid or legacy `"theme"` key exists, migrate or fallback safely.
2. Read `localStorage.getItem("theme_mode")` (fallback to legacy `localStorage.getItem("theme")` or `"system"`).
3. If preset is locked to a specific mode (e.g. `crt-phosphor`, `proxmox-hypervisor`, `tactile-rackmount`, `irix-unix`, `scada-command`, `factory-plc`, `analog-tape` are locked to `dark`), enforce `dark`.
4. Otherwise, if mode is `"system"`: check `window.matchMedia("(prefers-color-scheme: dark)").matches`.
5. Apply to `document.documentElement`:
   - `setAttribute("data-theme", preset)`
   - `classList.toggle("dark", isDark)`
6. Wrap completely in `try ... catch (e) {}` to handle restricted browser environments (private mode, sandboxed iframes).

### 2.3 Minified Inlined Code Implementation
```javascript
export const THEME_INIT_SCRIPT = `(function(){try{` +
  `var P_KEY="theme_preset",M_KEY="theme_mode",LEG_KEY="theme";` +
  `var p=localStorage.getItem(P_KEY)||"${DEFAULT_THEME_PRESET}";` +
  `var m=localStorage.getItem(M_KEY)||localStorage.getItem(LEG_KEY)||"system";` +
  `var darkOnly=["proxmox-hypervisor","crt-phosphor","tactile-rackmount","irix-unix","scada-command","factory-plc","analog-tape"];` +
  `var isDark=darkOnly.indexOf(p)!==-1?true:(m==="dark"||(m!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches));` +
  `var root=document.documentElement;` +
  `root.setAttribute("data-theme",p);` +
  `root.classList.toggle("dark",isDark);` +
`}catch(e){}})();`;
```

---

## 3. React 19 `useSyncExternalStore` & MutationObserver Architecture

### 3.1 State Synchronization Mechanism
Instead of relying on heavy context providers with hydration mismatches, React 19 components subscribe directly to the DOM attributes using `useSyncExternalStore`.

- Observed target: `document.documentElement`
- Observed attributes: `['class', 'data-theme']`
- Snapshots:
  - `isDarkSnapshot()`: returns `document.documentElement.classList.contains('dark')`
  - `themePresetSnapshot()`: returns `(document.documentElement.getAttribute('data-theme') as ThemePreset) || DEFAULT_THEME_PRESET`
  - `themeSnapshot()`: returns composite `{ preset, mode, isDark }` cached or immutably snapshot-stable.

### 3.2 Subscription Hook (`useTheme`)
```typescript
interface ThemeState {
  preset: ThemePreset;
  mode: ThemeMode;
  effectiveMode: 'light' | 'dark';
  isDark: boolean;
  setPreset: (preset: ThemePreset) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}
```
The subscription listens to:
1. `MutationObserver` on `document.documentElement` for attribute modifications (`class`, `data-theme`).
2. `window.matchMedia('(prefers-color-scheme: dark)')` `change` events (so when system theme changes and mode is `'system'`, state automatically updates).
3. `window.addEventListener('storage')` for multi-tab synchronization.

---

## 4. Backward Compatibility Strategy

### 4.1 Compatibility Matrix
| Existing API | Status | Behavior in Phase 1 |
|---|---|---|
| `THEME_KEY = 'theme'` | Maintained | Legacy storage key reference kept. Reading falls back to it; writing updates both `theme_mode` and legacy `theme` for safety. |
| `type Theme = 'light' \| 'dark'` | Maintained | Alias for binary light/dark mode. |
| `resolveTheme(): Theme` | Maintained | Returns effective mode (`'light'` or `'dark'`) based on current preset and system/storage mode. |
| `applyTheme(theme: Theme)` | Maintained | Toggles `.dark` on `document.documentElement`. Also updates `data-theme` if not already set. |
| `saveTheme(theme: Theme)` | Maintained | Writes to `theme_mode` and updates legacy `theme`. |
| `subscribeTheme(onChange)` | Maintained | Subscribes `MutationObserver` to both `class` and `data-theme`. |
| `isDarkSnapshot(): boolean` | Maintained | Returns `document.documentElement.classList.contains('dark')`. |
| `ThemeToggle` component | Maintained | Continues to toggle light/dark via `keris-slice` view transition. If the current preset is mode-locked, optionally visually disables or preserves lock. |
| `ThemeSync` component | Maintained | Re-applies active preset and mode on hydration/Strict Mode remount. |

---

## 5. Unit Testing Strategy with Vitest

### 5.1 Test Environment & File Placement
- Test file location: `tests/theme.test.ts` (or `src/lib/__tests__/theme.test.ts` with test discovery configured in `vitest.config.mts`). OpenKuasa's existing test suite lives under `tests/*.test.ts`. Placing `tests/theme.test.ts` matches project conventions.

### 5.2 Mocks Required
1. **`localStorage`**:
   Provide a standard in-memory mock:
   ```typescript
   const localStorageMock = (() => {
     let store: Record<string, string> = {};
     return {
       getItem: (key: string) => store[key] ?? null,
       setItem: (key: string, value: string) => { store[key] = String(value); },
       removeItem: (key: string) => { delete store[key]; },
       clear: () => { store = {}; },
     };
   })();
   Object.defineProperty(window, 'localStorage', { value: localStorageMock });
   ```
2. **`window.matchMedia`**:
   Mock matchMedia to test system preference changes:
   ```typescript
   Object.defineProperty(window, 'matchMedia', {
     writable: true,
     value: (query: string) => ({
       matches: false,
       media: query,
       onchange: null,
       addListener: () => {},
       removeListener: () => {},
       addEventListener: () => {},
       removeEventListener: () => {},
       dispatchEvent: () => false,
     }),
   });
   ```
3. **`MutationObserver`**:
   Mock `MutationObserver` to verify `subscribeTheme` trigger notifications when `classList` or `setAttribute` changes on `document.documentElement`.

### 5.3 Core Test Cases
- **Preset Resolution**: Default fallback to `'kuasa-emerald'`, respect stored `theme_preset`.
- **Mode Resolution**: System preference fallback, stored `theme_mode`, legacy `'theme'` key migration.
- **Mode-Locked Themes**: Themes like `'crt-phosphor'` or `'proxmox-hypervisor'` always resolve effective mode to `'dark'` even if mode is set to `'light'`.
- **DOM Stamping**: `applyThemeState` sets `data-theme` attribute and correctly toggles `dark` class.
- **Pre-paint Script Validation**: Evaluating `THEME_INIT_SCRIPT` string in a simulated DOM correctly configures `document.documentElement` attributes synchronously without error.
- **Observer & Subscription**: `subscribeTheme` triggers callbacks on attribute mutations.

---

## Next Steps for Planning
1. Create `PLAN.md` breaking execution into:
   - Wave 1: Core theme engine types, preset dictionary, helper functions, and `THEME_INIT_SCRIPT` in `src/lib/theme.ts`.
   - Wave 2: DOM synchronization and `useTheme` hook with `useSyncExternalStore`.
   - Wave 3: Backward compatibility verification in `ThemeToggle`, `ThemeSync`, and `src/app/layout.tsx`.
   - Wave 4: Vitest test suite covering persistence, fallbacks, mode locks, and script execution.
