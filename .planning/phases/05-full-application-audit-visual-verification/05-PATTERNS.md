# Phase 05: Full Application Audit & Visual Verification - Pattern Map

**Mapped:** 2026-11-05
**Files analyzed:** 6
**Analogs found:** 6 / 6

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `scripts/audit-harness.mjs` | utility / runner | file-I/O & browser automation | `scripts/docs-shots.mjs` | exact |
| `scripts/audit-matrix.mjs` | utility / runner | batch & browser automation | `scripts/smoke-routes.mjs` | exact |
| `scripts/audit-contrast.mjs` | utility / evaluation | batch & DOM evaluation | `scripts/docs-shots.mjs` | role-match |
| `tests/theme-locks.test.ts` | test | batch / assertions | `tests/theme-selector.test.ts` | exact |
| `src/app/themes/*.css` | config / styling | CSS custom properties | `src/app/themes/crt-phosphor.css` | exact |
| `.planning/phases/05-full-application-audit-visual-verification/AUDIT-REPORT.md` | documentation / report | static report | `.planning/phases/05-full-application-audit-visual-verification/05-RESEARCH.md` | role-match |

---

## Pattern Assignments

### `scripts/audit-harness.mjs` (utility, file-I/O & browser automation)

**Analog:** `scripts/docs-shots.mjs` and `scripts/docs-shots-lib.mjs`

**Imports and Playwright Launch Pattern** (lines 4-20 of `scripts/docs-shots.mjs`):
```javascript
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? 'playwright-core');

// Local chromium headless shell binary discovery
const CHROME = process.env.CHROME_PATH ?? '/root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell';
```

**Context Initialization & Cookie Injection Pattern** (lines 44-55, 72-76 of `scripts/docs-shots.mjs`):
```javascript
export async function createThemeContext(browser, { preset, mode, width = 1280, height = 800 }) {
  const context = await browser.newContext({
    viewport: { width, height },
    colorScheme: mode === 'dark' ? 'dark' : 'light',
  });

  // Inject cookies or pre-configure localStorage before navigation to prevent FOUC
  await context.addCookies([
    { name: 'theme_preset', value: preset, domain: 'localhost', path: '/' },
    { name: 'theme_mode', value: mode, domain: 'localhost', path: '/' },
  ]);

  return context;
}
```

**Console Error & Hydration Mismatch Trapping Pattern**:
```javascript
export function attachPageGuards(page, errors) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Filter out non-fatal or expected warnings if necessary
      errors.push({ type: 'console.error', text });
    }
  });

  page.on('pageerror', (err) => {
    errors.push({ type: 'pageerror', text: err.message });
  });
}
```

---

### `scripts/audit-matrix.mjs` (utility, batch & browser automation)

**Analog:** `scripts/smoke-routes.mjs`

**Server Lifecycle Management Pattern** (lines 81-120 of `scripts/smoke-routes.mjs`):
```javascript
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const server = spawn('pnpm', ['exec', 'next', 'start', '--hostname', host, '--port', port], {
  cwd: root,
  env: { OPENKUASA_PREVIEW: '1', ...process.env },
  stdio: ['ignore', 'pipe', 'pipe'],
});

try {
  await waitForServer();
  // execute sweep
} finally {
  server.kill('SIGTERM');
  setTimeout(() => server.kill('SIGKILL'), 2_000).unref();
}
```

**Route Iteration & Status Assertion Pattern** (lines 23-34, 101-113 of `scripts/smoke-routes.mjs`):
```javascript
import { navEntries } from './nav-routes.mjs';

function listProductRoutes() {
  const routes = [];
  for (const { key, slugs } of navEntries(root)) {
    routes.push(`/${key}`);
    for (const slug of slugs) routes.push(`/${key}/${slug}`);
  }
  return routes;
}
```

---

### `scripts/audit-contrast.mjs` (utility, batch & DOM evaluation)

**Analog:** Headless DOM evaluation pattern adapted from `scripts/docs-shots.mjs`

**WCAG 2.1 AA Luminance & Contrast Calculation Formula**:
```javascript
function sRGBtoLin(colorChannel) {
  const c = colorChannel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function getLuminance(r, g, b) {
  return 0.2126 * sRGBtoLin(r) + 0.7152 * sRGBtoLin(g) + 0.0722 * sRGBtoLin(b);
}

export function getContrastRatio(rgb1, rgb2) {
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}
```

**DOM Inspection via Playwright Evaluate**:
```javascript
const violations = await page.evaluate(() => {
  const results = [];
  const elements = document.querySelectorAll('th, td, p, span, button, a, h1, h2, h3, [data-slot="badge"]');

  for (const el of elements) {
    const style = window.getComputedStyle(el);
    const text = el.innerText?.trim();
    if (!text) continue;

    const color = style.color;
    const bg = style.backgroundColor;
    // Check computed contrast against thresholds (4.5:1 normal, 3.0:1 large/borders)
  }
  return results;
});
```

---

### `tests/theme-locks.test.ts` (test, batch assertions)

**Analog:** `tests/theme-selector.test.ts` (lines 45-75)

**Locked-Mode Verification Pattern**:
```typescript
import { describe, it, expect } from 'vitest';
import { THEME_PRESETS, type ThemePreset } from '@/lib/theme';

describe('Locked-Dark Presets Enforcement (D-06, REQ-THEME-03)', () => {
  const lockedThemes: ThemePreset[] = [
    'proxmox-hypervisor',
    'crt-phosphor',
    'tactile-rackmount',
    'irix-unix',
    'scada-command',
    'factory-plc',
    'analog-tape',
  ];

  it('verifies all 7 hardware and retro presets have lockedMode === "dark"', () => {
    for (const preset of lockedThemes) {
      expect(THEME_PRESETS[preset].lockedMode, `${preset} should have lockedMode === 'dark'`).toBe('dark');
      expect(THEME_PRESETS[preset].supportsLightDark).toBe(false);
    }
  });

  it('verifies the 5 modern/flexible themes support dual light/dark modes', () => {
    const dualThemes = (Object.keys(THEME_PRESETS) as ThemePreset[]).filter((p) => !lockedThemes.includes(p));
    expect(dualThemes).toHaveLength(5);
    for (const preset of dualThemes) {
      expect(THEME_PRESETS[preset].supportsLightDark).toBe(true);
      expect(THEME_PRESETS[preset].lockedMode).toBeUndefined();
    }
  });
});
```

---

### `src/app/themes/*.css` (config/styling, CSS custom properties)

**Analog:** `src/app/themes/crt-phosphor.css` and `src/app/themes/blueprint-cad.css`

**Token Organization & Numeric Contrast Protection Pattern** (lines 80-92 of `src/app/themes/crt-phosphor.css`):
```css
/* Ambient decorative glow restricted to headings and badges */
[data-theme='crt-phosphor'] h1,
[data-theme='crt-phosphor'] h2,
[data-theme='crt-phosphor'] h3,
[data-theme='crt-phosphor'] [data-slot='badge'] {
  text-shadow: 0 0 6px rgba(0, 255, 102, 0.65), 0 0 12px rgba(0, 255, 102, 0.25);
}

/* Numeric tables and data inputs maintain crisp edges (contrast protection per D-07) */
[data-theme='crt-phosphor'] table,
[data-theme='crt-phosphor'] input,
[data-theme='crt-phosphor'] code {
  text-shadow: none !important;
}
```

---

## Shared Patterns

### Cookie & Storage State Synchronization
**Source:** `src/lib/theme.ts` lines 120-165
**Apply to:** `scripts/audit-harness.mjs`, `scripts/audit-matrix.mjs`
```typescript
// Synchronize both cookie and localStorage to guarantee zero-FOUC in headless browser runs
document.cookie = `theme_preset=${preset}; path=/; max-age=31536000; SameSite=Lax`;
document.cookie = `theme_mode=${mode}; path=/; max-age=31536000; SameSite=Lax`;
window.localStorage.setItem('theme_preset', preset);
window.localStorage.setItem('theme_mode', mode);
```

### Preview Server Spawning & Cleanup
**Source:** `scripts/smoke-routes.mjs` lines 81-120
**Apply to:** All test/audit scripts requiring live Next.js instance
- Set `env: { OPENKUASA_PREVIEW: '1', ...process.env }` to run without live Supabase database.
- Always wrap in `try ... finally` block killing the child process with `SIGTERM` followed by a timeout fallback `SIGKILL`.

---

## No Analog Found

None. All files have concrete, git-tracked analogs within `scripts/`, `tests/`, and `src/app/themes/`.

---

## Metadata

**Analog search scope:** `scripts/`, `tests/`, `src/app/themes/`, `src/lib/`
**Files scanned:** 18
**Pattern extraction date:** 2026-11-05
