import { describe, it, expect } from 'vitest';
import { THEME_PRESETS, isValidPreset, type ThemePreset } from '@/lib/theme';
import {
  THEME_CATEGORIES,
  getThemeCategory,
} from '@/components/theme/theme-selector';
import { THEME_PALETTES } from '@/components/theme/theme-mockup-card';

describe('ThemeSelector and ThemeMockupCard contracts (REQ-THEME-03)', () => {
  const allPresets = Object.keys(THEME_PRESETS) as ThemePreset[];

  describe('1. Theme Categorization', () => {
    it('contains all 12 presets across the 4 curated categories with zero duplicates', () => {
      expect(allPresets).toHaveLength(12);

      const categorizedThemes = Object.values(THEME_CATEGORIES).flat();
      expect(categorizedThemes).toHaveLength(12);

      // Verify every preset exists exactly once
      for (const preset of allPresets) {
        const occurrences = categorizedThemes.filter((t) => t === preset).length;
        expect(occurrences, `Preset ${preset} must be in exactly one category`).toBe(1);
      }
    });

    it('correctly maps specific presets to their expected categories', () => {
      expect(getThemeCategory('kuasa-emerald')).toBe('Modern');
      expect(getThemeCategory('swiss-monochrome')).toBe('Modern');
      expect(getThemeCategory('executive-editorial')).toBe('Modern');

      expect(getThemeCategory('proxmox-hypervisor')).toBe('Datacenter');
      expect(getThemeCategory('tactile-rackmount')).toBe('Datacenter');

      expect(getThemeCategory('blueprint-cad')).toBe('Technical');
      expect(getThemeCategory('brutalist-ledger')).toBe('Technical');
      expect(getThemeCategory('factory-plc')).toBe('Technical');

      expect(getThemeCategory('crt-phosphor')).toBe('Retro');
      expect(getThemeCategory('irix-unix')).toBe('Retro');
      expect(getThemeCategory('scada-command')).toBe('Retro');
      expect(getThemeCategory('analog-tape')).toBe('Retro');
    });
  });

  describe('2. Locked-Dark Presets Resolution (D-15)', () => {
    const lockedThemes: ThemePreset[] = [
      'proxmox-hypervisor',
      'crt-phosphor',
      'tactile-rackmount',
      'irix-unix',
      'scada-command',
      'factory-plc',
      'analog-tape',
    ];

    it('identifies all 7 hardware and retro presets with lockedMode === "dark"', () => {
      for (const preset of lockedThemes) {
        expect(
          THEME_PRESETS[preset].lockedMode,
          `${preset} should have lockedMode === 'dark'`
        ).toBe('dark');
        expect(THEME_PRESETS[preset].supportsLightDark).toBe(false);
      }
    });

    it('identifies the 5 dual-mode themes with supportsLightDark === true and no lockedMode', () => {
      const dualThemes = allPresets.filter((p) => !lockedThemes.includes(p));
      expect(dualThemes).toHaveLength(5);

      for (const preset of dualThemes) {
        expect(THEME_PRESETS[preset].supportsLightDark).toBe(true);
        expect(THEME_PRESETS[preset].lockedMode).toBeUndefined();
      }
    });
  });

  describe('3. Search Filter Predicate Logic (T-03-02)', () => {
    function filterPresets(query: string): ThemePreset[] {
      const q = query.trim().toLowerCase();
      if (!q) return allPresets;
      return allPresets.filter((p) => {
        const meta = THEME_PRESETS[p];
        return (
          meta.name.toLowerCase().includes(q) ||
          meta.description.toLowerCase().includes(q) ||
          p.toLowerCase().includes(q)
        );
      });
    }

    it('matches "phosphor" to crt-phosphor', () => {
      const results = filterPresets('phosphor');
      expect(results).toContain('crt-phosphor');
      expect(results).toHaveLength(1);
    });

    it('matches "cad" to blueprint-cad and scada-command', () => {
      const results = filterPresets('cad');
      expect(results).toContain('blueprint-cad');
      expect(results).toContain('scada-command');
      expect(results).toHaveLength(2);
    });

    it('matches "swiss" to swiss-monochrome', () => {
      const results = filterPresets('swiss');
      expect(results).toContain('swiss-monochrome');
      expect(results).toHaveLength(1);
    });

    it('matches "proxmox" to proxmox-hypervisor', () => {
      const results = filterPresets('proxmox');
      expect(results).toContain('proxmox-hypervisor');
      expect(results).toHaveLength(1);
    });

    it('returns empty array when search query has no match', () => {
      const results = filterPresets('non-existent-super-theme');
      expect(results).toHaveLength(0);
    });
  });

  describe('4. Theme Palette Map Completeness (T-03-03)', () => {
    it('defines non-empty brand, surface, border, and accent colors for all 12 presets', () => {
      for (const preset of allPresets) {
        const palette = THEME_PALETTES[preset];
        expect(palette, `Palette for ${preset} must be defined`).toBeDefined();
        expect(palette.brand.length).toBeGreaterThan(0);
        expect(palette.surface.length).toBeGreaterThan(0);
        expect(palette.border.length).toBeGreaterThan(0);
        expect(palette.accent.length).toBeGreaterThan(0);
      }
    });
  });

  describe('5. Security & Input Whitelist Validation (T-03-01)', () => {
    it('rejects malicious or arbitrary string presets', () => {
      expect(isValidPreset('arbitrary-xss-payload')).toBe(false);
      expect(isValidPreset('<script>alert(1)</script>')).toBe(false);
      expect(isValidPreset('../../../etc/passwd')).toBe(false);
      expect(isValidPreset(null)).toBe(false);
      expect(isValidPreset(undefined)).toBe(false);
      expect(isValidPreset('')).toBe(false);
    });

    it('accepts only the verified 12 presets', () => {
      for (const preset of allPresets) {
        expect(isValidPreset(preset)).toBe(true);
      }
    });
  });
});
