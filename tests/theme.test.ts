import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  THEME_KEY,
  THEME_PRESET_KEY,
  THEME_MODE_KEY,
  THEME_PRESETS,
  DEFAULT_PRESET,
  DEFAULT_MODE,
  resolveThemePreset,
  resolveThemeMode,
  resolveEffectiveMode,
  applyThemeState,
  saveThemeState,
  resolveTheme,
  applyTheme,
  saveTheme,
  isDarkSnapshot,
  presetSnapshot,
  THEME_INIT_SCRIPT,
} from '@/lib/theme';

describe('Multi-Theme Engine (src/lib/theme.ts)', () => {
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

  describe('Theme resolution & fallbacks', () => {
    it('returns default preset when localStorage is empty', () => {
      expect(resolveThemePreset()).toBe(DEFAULT_PRESET);
      expect(DEFAULT_PRESET).toBe('kuasa-emerald');
    });

    it('returns stored valid preset', () => {
      store[THEME_PRESET_KEY] = 'proxmox-hypervisor';
      expect(resolveThemePreset()).toBe('proxmox-hypervisor');
    });

    it('falls back to default preset on unknown preset', () => {
      store[THEME_PRESET_KEY] = 'invalid-unknown-preset';
      expect(resolveThemePreset()).toBe(DEFAULT_PRESET);
    });

    it('returns default mode when storage is empty', () => {
      expect(resolveThemeMode()).toBe(DEFAULT_MODE);
      expect(DEFAULT_MODE).toBe('system');
    });

    it('returns stored valid mode', () => {
      store[THEME_MODE_KEY] = 'dark';
      expect(resolveThemeMode()).toBe('dark');
    });

    it('falls back to legacy THEME_KEY if THEME_MODE_KEY is not set', () => {
      store[THEME_KEY] = 'dark';
      expect(resolveThemeMode()).toBe('dark');
    });
  });

  describe('Effective mode computation & locking', () => {
    it('respects lockedMode on retro/hardware themes regardless of user mode', () => {
      const crtMeta = THEME_PRESETS['crt-phosphor'];
      expect(crtMeta.lockedMode).toBe('dark');
      expect(resolveEffectiveMode('crt-phosphor', 'light')).toBe('dark');
      expect(resolveEffectiveMode('crt-phosphor', 'system')).toBe('dark');
      expect(resolveEffectiveMode('crt-phosphor', 'dark')).toBe('dark');
    });

    it('evaluates light and dark properly for flexible themes', () => {
      expect(resolveEffectiveMode('kuasa-emerald', 'light')).toBe('light');
      expect(resolveEffectiveMode('kuasa-emerald', 'dark')).toBe('dark');
    });

    it('evaluates system preference via matchMedia when mode is system', () => {
      vi.stubGlobal('window', {
        matchMedia: vi.fn((query: string) => ({
          matches: false,
          media: query,
        })),
      });
      expect(resolveEffectiveMode('kuasa-emerald', 'system')).toBe('light');

      vi.stubGlobal('window', {
        matchMedia: vi.fn((query: string) => ({
          matches: true,
          media: query,
        })),
      });
      expect(resolveEffectiveMode('kuasa-emerald', 'system')).toBe('dark');
    });
  });

  describe('DOM Attribute Stamping & State Persistence', () => {
    it('applies data-theme and dark class to documentElement', () => {
      applyThemeState('swiss-monochrome', 'dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('swiss-monochrome');
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      applyThemeState('executive-editorial', 'light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('executive-editorial');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('saves state to localStorage and syncs legacy key', () => {
      saveThemeState('tactile-rackmount', 'system');
      expect(store[THEME_PRESET_KEY]).toBe('tactile-rackmount');
      expect(store[THEME_MODE_KEY]).toBe('system');
      // tactile-rackmount is locked to dark
      expect(store[THEME_KEY]).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('tactile-rackmount');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('provides accurate snapshots', () => {
      document.documentElement.setAttribute('data-theme', 'blueprint-cad');
      document.documentElement.classList.add('dark');
      expect(presetSnapshot()).toBe('blueprint-cad');
      expect(isDarkSnapshot()).toBe(true);
    });
  });

  describe('Legacy drop-in API compatibility', () => {
    it('resolveTheme() returns effective dark or light', () => {
      store[THEME_PRESET_KEY] = 'kuasa-emerald';
      store[THEME_MODE_KEY] = 'dark';
      expect(resolveTheme()).toBe('dark');
    });

    it('applyTheme() applies given mode', () => {
      store[THEME_PRESET_KEY] = 'kuasa-emerald';
      applyTheme('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('saveTheme() writes and applies mode', () => {
      store[THEME_PRESET_KEY] = 'kuasa-emerald';
      saveTheme('dark');
      expect(store[THEME_MODE_KEY]).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('Inlined Pre-paint Script (THEME_INIT_SCRIPT)', () => {
    it('stamps data-theme and toggles dark correctly when evaluated', () => {
      store[THEME_PRESET_KEY] = 'scada-command';
      store[THEME_MODE_KEY] = 'light'; // SCADA is locked to dark in script map

      // Execute the script in the mocked DOM context
      eval(THEME_INIT_SCRIPT);

      expect(document.documentElement.getAttribute('data-theme')).toBe('scada-command');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('falls back to default preset and system matchMedia when storage is empty', () => {
      store = {};
      eval(THEME_INIT_SCRIPT);

      expect(document.documentElement.getAttribute('data-theme')).toBe('kuasa-emerald');
      // matchMedia mock matches 'dark' in default beforeEach
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });
});
