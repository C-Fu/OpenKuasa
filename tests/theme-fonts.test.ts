import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const THEMES_DIR = path.resolve(process.cwd(), 'src/app/themes');
const LAYOUT_FILE = path.resolve(process.cwd(), 'src/app/layout.tsx');

const THEME_FILES = [
  'kuasa-emerald.css',
  'proxmox-hypervisor.css',
  'swiss-monochrome.css',
  'crt-phosphor.css',
  'executive-editorial.css',
  'tactile-rackmount.css',
  'blueprint-cad.css',
  'irix-unix.css',
  'scada-command.css',
  'factory-plc.css',
  'brutalist-ledger.css',
  'analog-tape.css',
];

const REQUIRED_GOOGLE_FONTS = [
  'Lexend',
  'Inter',
  'Space_Grotesk',
  'Newsreader',
  'IBM_Plex_Sans',
  'IBM_Plex_Mono',
  'JetBrains_Mono',
  'Chivo_Mono',
  'Share_Tech_Mono',
  'VT323',
];

const REQUIRED_FONT_VARS = [
  '--font-lexend',
  '--font-inter',
  '--font-space-grotesk',
  '--font-newsreader',
  '--font-ibm-plex-sans',
  '--font-ibm-plex-mono',
  '--font-jetbrains-mono',
  '--font-chivo-mono',
  '--font-share-tech-mono',
  '--font-vt323',
];

describe('Theme Fonts Pipeline & Google Fonts Verification (Wave 0)', () => {
  describe('src/app/layout.tsx Font Declarations', () => {
    const layoutContent = fs.readFileSync(LAYOUT_FILE, 'utf8');

    it('imports all 10 deduplicated Google Fonts from next/font/google', () => {
      for (const font of REQUIRED_GOOGLE_FONTS) {
        expect(layoutContent).toContain(font);
      }
    });

    it('declares fixed-weight fonts (VT323 and Share_Tech_Mono) with weight "400"', () => {
      expect(layoutContent).toMatch(/Share_Tech_Mono\(\s*\{[\s\S]*?weight:\s*['"]400['"]/);
      expect(layoutContent).toMatch(/VT323\(\s*\{[\s\S]*?weight:\s*['"]400['"]/);
    });

    it('defines and binds all 10 font CSS variable tokens into the root <html> class string', () => {
      for (const fontVar of REQUIRED_FONT_VARS) {
        expect(layoutContent).toContain(fontVar);
      }
    });
  });

  describe('Theme Presets Font Bindings (src/app/themes/*.css)', () => {
    it('verifies all 12 theme files exist and declare valid --font-sans and --font-mono', () => {
      for (const file of THEME_FILES) {
        const filePath = path.join(THEMES_DIR, file);
        expect(fs.existsSync(filePath), `Theme file ${file} should exist`).toBe(true);
        const content = fs.readFileSync(filePath, 'utf8');
        expect(content, `${file} should define --font-sans`).toMatch(/--font-sans:\s*[^;]+;/);
        expect(content, `${file} should define --font-mono`).toMatch(/--font-mono:\s*[^;]+;/);
      }
    });

    it('verifies signature font variable mappings per theme', () => {
      const getThemeContent = (file: string) => fs.readFileSync(path.join(THEMES_DIR, file), 'utf8');

      // kuasa-emerald: Lexend
      expect(getThemeContent('kuasa-emerald.css')).toContain('var(--font-lexend)');

      // proxmox-hypervisor: Inter & JetBrains Mono
      const proxmox = getThemeContent('proxmox-hypervisor.css');
      expect(proxmox).toContain('var(--font-inter)');
      expect(proxmox).toContain('var(--font-jetbrains-mono)');

      // swiss-monochrome: Space Grotesk & JetBrains Mono
      const swiss = getThemeContent('swiss-monochrome.css');
      expect(swiss).toContain('var(--font-space-grotesk)');
      expect(swiss).toContain('var(--font-jetbrains-mono)');

      // crt-phosphor: VT323 & Chivo Mono
      const crt = getThemeContent('crt-phosphor.css');
      expect(crt).toContain('var(--font-vt323)');
      expect(crt).toContain('var(--font-chivo-mono)');

      // executive-editorial: Inter, Newsreader & JetBrains Mono
      const exec = getThemeContent('executive-editorial.css');
      expect(exec).toContain('var(--font-inter)');
      expect(exec).toContain('var(--font-newsreader)');
      expect(exec).toContain('var(--font-jetbrains-mono)');

      // tactile-rackmount: IBM Plex Sans & Chivo Mono
      const rack = getThemeContent('tactile-rackmount.css');
      expect(rack).toContain('var(--font-ibm-plex-sans)');
      expect(rack).toContain('var(--font-chivo-mono)');

      // blueprint-cad: Space Grotesk & JetBrains Mono
      const cad = getThemeContent('blueprint-cad.css');
      expect(cad).toContain('var(--font-space-grotesk)');
      expect(cad).toContain('var(--font-jetbrains-mono)');

      // irix-unix: IBM Plex Sans & Chivo Mono
      const irix = getThemeContent('irix-unix.css');
      expect(irix).toContain('var(--font-ibm-plex-sans)');
      expect(irix).toContain('var(--font-chivo-mono)');

      // scada-command: Share Tech Mono
      const scada = getThemeContent('scada-command.css');
      expect(scada).toContain('var(--font-share-tech-mono)');

      // factory-plc: Space Grotesk & Chivo Mono
      const plc = getThemeContent('factory-plc.css');
      expect(plc).toContain('var(--font-space-grotesk)');
      expect(plc).toContain('var(--font-chivo-mono)');

      // brutalist-ledger: Space Grotesk & IBM Plex Mono
      const brutalist = getThemeContent('brutalist-ledger.css');
      expect(brutalist).toContain('var(--font-space-grotesk)');
      expect(brutalist).toContain('var(--font-ibm-plex-mono)');

      // analog-tape: Space Grotesk, Newsreader & Chivo Mono
      const tape = getThemeContent('analog-tape.css');
      expect(tape).toContain('var(--font-space-grotesk)');
      expect(tape).toContain('var(--font-newsreader)');
      expect(tape).toContain('var(--font-chivo-mono)');
    });
  });
});
