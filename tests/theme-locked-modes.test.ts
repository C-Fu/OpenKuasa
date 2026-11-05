import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  THEME_PRESETS,
  THEME_PRESET_KEY,
  THEME_MODE_KEY,
  THEME_INIT_SCRIPT,
  DEFAULT_PRESET,
  isValidPreset,
  resolveEffectiveMode,
  resolveThemePreset,
  resolveThemeMode,
  resolveTheme,
  saveThemeState,
  type ThemePreset,
  type ThemeMeta,
} from '@/lib/theme';

describe('Locked-Mode Theme State Machine Test Suite (D-06, D-04, FR-1)', () => {
  const lockedThemes: ThemePreset[] = [
    'proxmox-hypervisor',
    'crt-phosphor',
    'tactile-rackmount',
    'irix-unix',
    'scada-command',
    'factory-plc',
    'analog-tape',
  ];

  const flexibleThemes: ThemePreset[] = [
    'kuasa-emerald',
    'swiss-monochrome',
    'executive-editorial',
    'blueprint-cad',
    'brutalist-ledger',
  ];

  let store: Record<string, string> = {};
  let attributes: Record<string, string> = {};
  let classList: Set<string> = new Set();

  beforeEach(() => {
    store = {};
    attributes = {};
    classList = new Set();

    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, val: string) => {
        store[key] = val;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    });

    vi.stubGlobal('window', {
      matchMedia: vi.fn((query: string) => ({
        matches: query.includes('dark'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    const mockDocumentElement = {
      className: '',
      classList: {
        contains: (c: string) => classList.has(c),
        toggle: (c: string, force?: boolean) => {
          const shouldHave = force !== undefined ? force : !classList.has(c);
          if (shouldHave) classList.add(c);
          else classList.delete(c);
          return shouldHave;
        },
        add: (c: string) => classList.add(c),
        remove: (c: string) => classList.delete(c),
      },
      setAttribute: vi.fn((attr: string, val: string) => {
        attributes[attr] = val;
      }),
      getAttribute: vi.fn((attr: string) => attributes[attr] ?? null),
      removeAttribute: vi.fn((attr: string) => {
        delete attributes[attr];
      }),
    };

    vi.stubGlobal('document', {
      documentElement: mockDocumentElement,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('1. Preset Metadata & Locked-Dark Definitions', () => {
    it('verifies all 7 hardware/retro presets have lockedMode === "dark" and supportsLightDark === false', () => {
      expect(lockedThemes).toHaveLength(7);
      for (const preset of lockedThemes) {
        const meta = THEME_PRESETS[preset];
        expect(meta, `Metadata for preset ${preset} must exist`).toBeDefined();
        expect(meta.lockedMode, `${preset} must have lockedMode === 'dark'`).toBe('dark');
        expect(meta.supportsLightDark, `${preset} must have supportsLightDark === false`).toBe(false);
      }
    });

    it('verifies all 5 flexible/modern presets have supportsLightDark === true and no lockedMode', () => {
      expect(flexibleThemes).toHaveLength(5);
      for (const preset of flexibleThemes) {
        const meta = THEME_PRESETS[preset];
        expect(meta, `Metadata for preset ${preset} must exist`).toBeDefined();
        expect(meta.supportsLightDark, `${preset} must have supportsLightDark === true`).toBe(true);
        expect(meta.lockedMode, `${preset} must not have lockedMode`).toBeUndefined();
      }
    });

    it('verifies total of exactly 12 presets registered with valid metadata (id, name, description)', () => {
      const allPresets = Object.keys(THEME_PRESETS) as ThemePreset[];
      expect(allPresets).toHaveLength(12);

      for (const preset of allPresets) {
        const meta: ThemeMeta = THEME_PRESETS[preset];
        expect(meta.id).toBe(preset);
        expect(meta.name).toBeTruthy();
        expect(meta.name.trim().length).toBeGreaterThan(0);
        expect(meta.description).toBeTruthy();
        expect(meta.description.trim().length).toBeGreaterThan(0);
        expect(isValidPreset(preset)).toBe(true);
      }
    });
  });

  describe('2. State Machine Transitions & Effective Mode Resolution', () => {
    it('resolves locked presets strictly to "dark" even when "light" preference is passed', () => {
      for (const preset of lockedThemes) {
        expect(resolveEffectiveMode(preset, 'light'), `${preset} with light must resolve to dark`).toBe('dark');
        expect(resolveEffectiveMode(preset, 'dark'), `${preset} with dark must resolve to dark`).toBe('dark');
        expect(resolveEffectiveMode(preset, 'system'), `${preset} with system must resolve to dark`).toBe('dark');
      }
    });

    it('resolves flexible presets according to requested mode', () => {
      for (const preset of flexibleThemes) {
        expect(resolveEffectiveMode(preset, 'light'), `${preset} with light must resolve to light`).toBe('light');
        expect(resolveEffectiveMode(preset, 'dark'), `${preset} with dark must resolve to dark`).toBe('dark');
      }
    });

    it('evaluates system preference via matchMedia for flexible presets when mode is "system"', () => {
      // Mock dark system preference
      vi.stubGlobal('window', {
        matchMedia: vi.fn((query: string) => ({
          matches: query.includes('dark'),
          media: query,
        })),
      });
      expect(resolveEffectiveMode('kuasa-emerald', 'system')).toBe('dark');
      expect(resolveEffectiveMode('swiss-monochrome', 'system')).toBe('dark');

      // Mock light system preference
      vi.stubGlobal('window', {
        matchMedia: vi.fn(() => ({
          matches: false,
          media: '(prefers-color-scheme: dark)',
        })),
      });
      expect(resolveEffectiveMode('kuasa-emerald', 'system')).toBe('light');
      expect(resolveEffectiveMode('swiss-monochrome', 'system')).toBe('light');
    });
  });

  describe('3. Persistence & DOM Stamping Behavior', () => {
    it('stamps data-theme and forces dark class on documentElement for locked presets', () => {
      saveThemeState('crt-phosphor', 'light');

      expect(store[THEME_PRESET_KEY]).toBe('crt-phosphor');
      expect(store[THEME_MODE_KEY]).toBe('light');
      // Resolved theme legacy key is forced to dark
      expect(store['theme']).toBe('dark');

      expect(document.documentElement.getAttribute('data-theme')).toBe('crt-phosphor');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('honors light mode DOM stamping for flexible presets', () => {
      saveThemeState('kuasa-emerald', 'light');

      expect(store[THEME_PRESET_KEY]).toBe('kuasa-emerald');
      expect(store[THEME_MODE_KEY]).toBe('light');
      expect(store['theme']).toBe('light');

      expect(document.documentElement.getAttribute('data-theme')).toBe('kuasa-emerald');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('resolves fallback properly when localStorage contains invalid preset or mode', () => {
      store[THEME_PRESET_KEY] = 'non-existent-theme';
      store[THEME_MODE_KEY] = 'super-mode';

      expect(resolveThemePreset()).toBe(DEFAULT_PRESET);
      expect(resolveThemeMode()).toBe('system');
      // Default preset is kuasa-emerald, matchMedia evaluates to true (dark) in default beforeEach mock
      expect(resolveTheme()).toBe('dark');
    });
  });

  describe('4. Zero-FOUC Pre-paint Inlined Script (THEME_INIT_SCRIPT)', () => {
    it('contains lock map for all 7 retro/hardware presets', () => {
      for (const preset of lockedThemes) {
        expect(
          THEME_INIT_SCRIPT.includes(`"${preset}":"dark"`),
          `THEME_INIT_SCRIPT must contain "${preset}":"dark"`
        ).toBe(true);
      }
    });

    it('enforces dark mode in DOM even when user mode is set to light for locked themes', () => {
      for (const preset of lockedThemes) {
        store[THEME_PRESET_KEY] = preset;
        store[THEME_MODE_KEY] = 'light';

        eval(THEME_INIT_SCRIPT);

        expect(
          document.documentElement.getAttribute('data-theme'),
          `data-theme must be ${preset}`
        ).toBe(preset);
        expect(
          document.documentElement.classList.contains('dark'),
          `${preset} must have 'dark' class applied despite light mode in storage`
        ).toBe(true);
      }
    });

    it('permits light mode execution for flexible themes in THEME_INIT_SCRIPT', () => {
      for (const preset of flexibleThemes) {
        store[THEME_PRESET_KEY] = preset;
        store[THEME_MODE_KEY] = 'light';

        eval(THEME_INIT_SCRIPT);

        expect(document.documentElement.getAttribute('data-theme')).toBe(preset);
        expect(document.documentElement.classList.contains('dark')).toBe(false);
      }
    });
  });
});
