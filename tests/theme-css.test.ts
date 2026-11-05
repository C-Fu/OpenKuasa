import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { THEME_PRESETS, ThemePreset } from '@/lib/theme';

describe('Phase 2 — CSS Theme Token Specifications & Integrity', () => {
  const themesDir = path.resolve(process.cwd(), 'src/app/themes');
  const globalsCssPath = path.resolve(process.cwd(), 'src/app/globals.css');
  const indexCssPath = path.resolve(themesDir, 'index.css');

  it('contains index.css and imports it in globals.css', () => {
    expect(fs.existsSync(indexCssPath)).toBe(true);
    const globalsCss = fs.readFileSync(globalsCssPath, 'utf-8');
    expect(globalsCss).toContain('@import "./themes/index.css"');
  });

  const allPresetKeys = Object.keys(THEME_PRESETS) as ThemePreset[];

  it.each(allPresetKeys)('has dedicated CSS file and valid tokens for preset: %s', (preset) => {
    const filePath = path.resolve(themesDir, `${preset}.css`);
    expect(fs.existsSync(filePath), `Missing CSS file for theme ${preset}`).toBe(true);

    const css = fs.readFileSync(filePath, 'utf-8');

    // Must declare the data-theme selector
    expect(css).toContain(`[data-theme='${preset}']`);

    // Must define core semantic tokens
    const requiredTokens = [
      '--background:',
      '--foreground:',
      '--card:',
      '--card-foreground:',
      '--primary:',
      '--primary-foreground:',
      '--secondary:',
      '--muted:',
      '--accent:',
      '--destructive:',
      '--border:',
      '--ring:',
      '--radius:',
      '--sidebar:',
      '--chart-1:',
      '--chart-2:',
      '--chart-3:',
      '--chart-4:',
      '--chart-5:',
    ];

    for (const token of requiredTokens) {
      expect(css, `Theme ${preset} must define ${token}`).toContain(token);
    }

    // Verify mode support rules
    const meta = THEME_PRESETS[preset];
    if (meta.supportsLightDark) {
      // Must have .dark definition
      expect(css).toMatch(new RegExp(`\\.dark\\[data-theme=['"]${preset}['"]\\]`));
    }
  });

  it('index.css imports all 12 preset stylesheets', () => {
    const indexCss = fs.readFileSync(indexCssPath, 'utf-8');
    for (const preset of allPresetKeys) {
      expect(indexCss).toContain(`@import "./${preset}.css";`);
    }
  });
});
