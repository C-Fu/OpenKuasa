/**
 * Legacy key retained for backwards-compatibility.
 * If user previously chose 'light' or 'dark', we honour it as initial mode.
 */
export const THEME_KEY = 'theme';

export const THEME_PRESET_KEY = 'theme_preset';
export const THEME_MODE_KEY = 'theme_mode';

export type Theme = 'light' | 'dark';
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

export interface ThemeMeta {
  id: ThemePreset;
  name: string;
  description: string;
  supportsLightDark: boolean;
  lockedMode?: 'light' | 'dark';
}

export const THEME_PRESETS: Record<ThemePreset, ThemeMeta> = {
  'kuasa-emerald': {
    id: 'kuasa-emerald',
    name: 'Emerald Kuasa',
    description: 'Malaysian enterprise baseline, Lexend font with deep jade accents',
    supportsLightDark: true,
  },
  'proxmox-hypervisor': {
    id: 'proxmox-hypervisor',
    name: 'Enterprise Hypervisor',
    description: 'Dense charcoal & neutral-950 datacenter console with amber status telemetry',
    supportsLightDark: false,
    lockedMode: 'dark',
  },
  'swiss-monochrome': {
    id: 'swiss-monochrome',
    name: 'Swiss Monochrome',
    description: 'High-contrast stark hairline minimalism with geometric grotesk type',
    supportsLightDark: true,
  },
  'crt-phosphor': {
    id: 'crt-phosphor',
    name: 'Industrial CRT Phosphor',
    description: 'Terminal rack with scanline green and telemetry amber raster glows',
    supportsLightDark: false,
    lockedMode: 'dark',
  },
  'executive-editorial': {
    id: 'executive-editorial',
    name: 'Executive Editorial',
    description: 'Parchment & midnight teal balance sheet with literary serif typography',
    supportsLightDark: true,
  },
  'tactile-rackmount': {
    id: 'tactile-rackmount',
    name: 'Hardware Rackmount',
    description: 'Matte chassis steel faceplate with rocker switches and status LEDs',
    supportsLightDark: false,
    lockedMode: 'dark',
  },
  'blueprint-cad': {
    id: 'blueprint-cad',
    name: 'Blueprint CAD',
    description: 'Cyanotype drafting schematic with coordinate grids and technical annotations',
    supportsLightDark: true,
  },
  'irix-unix': {
    id: 'irix-unix',
    name: 'IRIX Unix Workstation',
    description: 'Silicon Graphics Motif 4Dwm with directional 3D chisel bevels',
    supportsLightDark: false,
    lockedMode: 'dark',
  },
  'scada-command': {
    id: 'scada-command',
    name: 'SCADA Command Console',
    description: 'Hardened tactical telemetry with DEFCON amber and radar sweeps',
    supportsLightDark: false,
    lockedMode: 'dark',
  },
  'factory-plc': {
    id: 'factory-plc',
    name: 'Factory HMI Automation',
    description: 'Industrial automation touchscreen with safety indicators and status lamps',
    supportsLightDark: false,
    lockedMode: 'dark',
  },
  'brutalist-ledger': {
    id: 'brutalist-ledger',
    name: 'Brutalist Financial Ledger',
    description: 'Anti-design zero-radius tabular accounting matrix with 2px structural rules',
    supportsLightDark: true,
  },
  'analog-tape': {
    id: 'analog-tape',
    name: 'Mastering Tape Deck',
    description: 'Champagne aluminum faceplate with walnut cheeks and warm VU meters',
    supportsLightDark: false,
    lockedMode: 'dark',
  },
};

export const DEFAULT_PRESET: ThemePreset = 'kuasa-emerald';
export const DEFAULT_MODE: ThemeMode = 'system';

export function isValidPreset(preset: string | null | undefined): preset is ThemePreset {
  return typeof preset === 'string' && preset in THEME_PRESETS;
}

export function isValidMode(mode: string | null | undefined): mode is ThemeMode {
  return mode === 'light' || mode === 'dark' || mode === 'system';
}

/** Resolves the stored or default ThemePreset. */
export function resolveThemePreset(): ThemePreset {
  try {
    const stored = localStorage.getItem(THEME_PRESET_KEY);
    if (isValidPreset(stored)) return stored;
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_PRESET;
}

/** Resolves the stored or default ThemeMode. */
export function resolveThemeMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_MODE_KEY);
    if (isValidMode(stored)) return stored;

    // Backwards-compatibility fallback to legacy key
    const legacy = localStorage.getItem(THEME_KEY);
    if (legacy === 'light' || legacy === 'dark') return legacy;
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_MODE;
}

/**
 * Calculates the effective 'light' | 'dark' mode taking into account:
 * 1. Preset locked mode (e.g. CRT Phosphor locked to dark)
 * 2. ThemeMode ('light' | 'dark' | 'system')
 * 3. System preference via window.matchMedia
 */
export function resolveEffectiveMode(preset: ThemePreset, mode: ThemeMode): Theme {
  const meta = THEME_PRESETS[preset];
  if (meta && meta.lockedMode) {
    return meta.lockedMode;
  }

  if (mode === 'light' || mode === 'dark') {
    return mode;
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return 'light';
}

/** Applies DOM attributes for theme preset and mode. */
export function applyThemeState(preset: ThemePreset, effectiveMode: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', preset);
  root.classList.toggle('dark', effectiveMode === 'dark');
}

/** Saves preset and mode to storage, then applies to DOM. */
export function saveThemeState(preset: ThemePreset, mode: ThemeMode) {
  try {
    localStorage.setItem(THEME_PRESET_KEY, preset);
    localStorage.setItem(THEME_MODE_KEY, mode);
    // Sync legacy key for backward compatibility
    const effective = resolveEffectiveMode(preset, mode);
    localStorage.setItem(THEME_KEY, effective);
  } catch {
    // Private mode / storage blocked
  }
  const effective = resolveEffectiveMode(preset, mode);
  applyThemeState(preset, effective);
}

/* -------------------------------------------------------------------------
 * Legacy API wrappers (drop-in compatibility)
 * ------------------------------------------------------------------------- */

export function resolveTheme(): Theme {
  const preset = resolveThemePreset();
  const mode = resolveThemeMode();
  return resolveEffectiveMode(preset, mode);
}

export function applyTheme(theme: Theme) {
  const preset = resolveThemePreset();
  applyThemeState(preset, theme);
}

export function saveTheme(theme: Theme) {
  const preset = resolveThemePreset();
  saveThemeState(preset, theme);
}

export function isDarkSnapshot(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

export function presetSnapshot(): ThemePreset {
  if (typeof document === 'undefined') return DEFAULT_PRESET;
  const attr = document.documentElement.getAttribute('data-theme');
  return isValidPreset(attr) ? attr : DEFAULT_PRESET;
}

/**
 * Runs before first paint (inlined at top of <body>) so the saved preset and mode
 * are applied without a flash.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var pk="${THEME_PRESET_KEY}";var mk="${THEME_MODE_KEY}";var lk="${THEME_KEY}";var p=localStorage.getItem(pk)||"kuasa-emerald";var m=localStorage.getItem(mk)||localStorage.getItem(lk);var lkMap={"proxmox-hypervisor":"dark","crt-phosphor":"dark","tactile-rackmount":"dark","irix-unix":"dark","scada-command":"dark","factory-plc":"dark","analog-tape":"dark"};var d;if(lkMap[p]){d=lkMap[p]==="dark";}else if(m==="dark"||m==="light"){d=m==="dark";}else{d=window.matchMedia("(prefers-color-scheme: dark)").matches;}var root=document.documentElement;root.setAttribute("data-theme",p);root.classList.toggle("dark",d);}catch(e){}})()`;

/**
 * Subscribe to both 'class' and 'data-theme' changes on <html> plus system theme changes.
 */
export function subscribeTheme(onChange: () => void): () => void {
  if (typeof document === 'undefined') return () => {};

  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme'],
  });

  let mediaQuery: MediaQueryList | null = null;
  if (typeof window !== 'undefined' && window.matchMedia) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', onChange);
  }

  return () => {
    observer.disconnect();
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', onChange);
    }
  };
}
