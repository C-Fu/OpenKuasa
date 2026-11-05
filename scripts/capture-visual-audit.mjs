#!/usr/bin/env node
/**
 * scripts/capture-visual-audit.mjs
 *
 * Playwright Visual Screenshot Capture Harness (Phase 5, Task 1)
 *
 * Captures high-resolution visual screenshots across all 17 theme/mode variants
 * on the 6 representative core screens per D-04, D-06, and D-10:
 *   - /finance
 *   - /crm
 *   - /command
 *   - /people
 *   - /reach
 *   - /account/appearance
 *
 * Output: .planning/phases/05-full-application-audit-visual-verification/screenshots/{theme}/{mode}/{screen}.png
 * (Total 102 captures)
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

// Locate playwright-core
const PW_CANDIDATES = [
  process.env.PLAYWRIGHT_CORE,
  '/root/.cache/pnpm/dlx/a22d3c450bc2b9b728685c96a1951453/mw3hl4x1-1gp8y/node_modules/.pnpm/node_modules/playwright-core',
  '/root/.npm/_npx/705bc6b22212b352/node_modules/playwright-core',
  'playwright-core',
].filter(Boolean);

let pwCore = null;
for (const cand of PW_CANDIDATES) {
  try {
    pwCore = require(cand);
    break;
  } catch {}
}

if (!pwCore || !pwCore.chromium) {
  console.error('Fatal: Failed to load playwright-core. Please ensure it is present.');
  process.exit(1);
}

const { chromium } = pwCore;

const CHROME =
  process.env.CHROME_PATH ??
  '/root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell';

const host = process.env.AUDIT_HOST || '127.0.0.1';
const port = process.env.AUDIT_PORT || '3180';
const baseUrl = (process.env.AUDIT_BASE_URL || `http://${host}:${port}`).replace(/\/$/, '');

// 17 theme/mode variants (D-04, D-06)
export const THEME_VARIANTS = [
  // 5 dual-mode themes in light and dark
  { preset: 'kuasa-emerald', mode: 'light', locked: false },
  { preset: 'kuasa-emerald', mode: 'dark', locked: false },
  { preset: 'swiss-monochrome', mode: 'light', locked: false },
  { preset: 'swiss-monochrome', mode: 'dark', locked: false },
  { preset: 'executive-editorial', mode: 'light', locked: false },
  { preset: 'executive-editorial', mode: 'dark', locked: false },
  { preset: 'blueprint-cad', mode: 'light', locked: false },
  { preset: 'blueprint-cad', mode: 'dark', locked: false },
  { preset: 'brutalist-ledger', mode: 'light', locked: false },
  { preset: 'brutalist-ledger', mode: 'dark', locked: false },

  // 7 locked-mode themes in dark only
  { preset: 'proxmox-hypervisor', mode: 'dark', locked: true },
  { preset: 'crt-phosphor', mode: 'dark', locked: true },
  { preset: 'tactile-rackmount', mode: 'dark', locked: true },
  { preset: 'irix-unix', mode: 'dark', locked: true },
  { preset: 'scada-command', mode: 'dark', locked: true },
  { preset: 'factory-plc', mode: 'dark', locked: true },
  { preset: 'analog-tape', mode: 'dark', locked: true },
];

// 6 core representative screens (D-10)
export const CORE_SCREENS = [
  '/finance',
  '/crm',
  '/command',
  '/people',
  '/reach',
  '/account/appearance',
];

export const HIDE_ASSISTANT_FAB_CSS = 'button[aria-label="Ask Taming Sari"] { display: none !important; }';

async function isServerUp(targetUrl) {
  try {
    const res = await fetch(`${targetUrl}/api/health`, { redirect: 'manual' });
    return res.ok || res.status < 400;
  } catch {
    return false;
  }
}

async function waitForServer(targetUrl, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await isServerUp(targetUrl)) return;
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server failed to start within ${timeoutMs}ms at ${targetUrl}`);
}

function parseCliArgs() {
  const args = process.argv.slice(2);
  const options = {
    theme: null,
    screen: null,
    limit: null,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--theme' && args[i + 1]) {
      options.theme = args[++i];
    } else if (args[i] === '--screen' && args[i + 1]) {
      options.screen = args[++i];
    } else if (args[i] === '--limit' && args[i + 1]) {
      options.limit = parseInt(args[++i], 10);
    } else if (args[i] === '--help' || args[i] === '-h') {
      options.help = true;
    }
  }

  return options;
}

async function main() {
  const options = parseCliArgs();

  if (options.help) {
    console.log(`
Usage: node scripts/capture-visual-audit.mjs [options]

Options:
  --theme <name>     Capture only specified theme (e.g. crt-phosphor)
  --screen <route>   Capture only specified screen (e.g. /command)
  --limit <n>        Limit to first N captures
  --help, -h         Show help
`);
    process.exit(0);
  }

  // Filter variants and screens
  let variants = THEME_VARIANTS;
  if (options.theme) {
    variants = variants.filter((v) => v.preset === options.theme);
    if (variants.length === 0) {
      console.error(`Error: Unknown theme "${options.theme}". Available: ${THEME_VARIANTS.map((v) => v.preset).join(', ')}`);
      process.exit(1);
    }
  }

  let screens = CORE_SCREENS;
  if (options.screen) {
    const s = options.screen.startsWith('/') ? options.screen : `/${options.screen}`;
    screens = [s];
  }

  let tasks = [];
  for (const variant of variants) {
    for (const screen of screens) {
      tasks.push({ variant, screen });
    }
  }

  if (options.limit && options.limit > 0) {
    tasks = tasks.slice(0, options.limit);
  }

  console.log(`OpenKuasa Visual Audit Capture Harness`);
  console.log(`Targeting: ${tasks.length} capture task(s) (${variants.length} theme/mode variant(s), ${screens.length} screen(s))`);

  // Server management
  let serverProcess = null;
  const running = await isServerUp(baseUrl);

  if (!running) {
    console.log(`Spawning Next.js preview server at ${baseUrl}...`);
    serverProcess = spawn('pnpm', ['exec', 'next', 'start', '--hostname', host, '--port', port], {
      cwd: process.cwd(),
      env: { OPENKUASA_PREVIEW: '1', ...process.env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    serverProcess.stderr.on('data', (d) => {
      const msg = d.toString();
      if (!msg.includes('ExperimentalWarning')) {
        process.stderr.write(msg);
      }
    });

    await waitForServer(baseUrl);
    console.log(`Preview server ready at ${baseUrl}.`);
  } else {
    console.log(`Reusing active server at ${baseUrl}.`);
  }

  let browser;
  try {
    browser = await chromium.launch({
      executablePath: CHROME,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
  } catch (err) {
    console.error(`Failed to launch chromium from ${CHROME}:`, err);
    if (serverProcess) serverProcess.kill('SIGTERM');
    process.exit(1);
  }

  const outputBase = join(process.cwd(), '.planning/phases/05-full-application-audit-visual-verification/screenshots');
  mkdirSync(outputBase, { recursive: true });

  const errors = [];
  let capturedCount = 0;
  const startTime = Date.now();

  try {
    for (const { variant, screen } of tasks) {
      const screenSlug = screen.replace(/^\//, '').replace(/\//g, '-');
      const outDir = join(outputBase, variant.preset, variant.mode);
      mkdirSync(outDir, { recursive: true });
      const outFile = join(outDir, `${screenSlug}.png`);

      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        colorScheme: variant.mode === 'dark' ? 'dark' : 'light',
        deviceScaleFactor: 1,
      });

      // Inject theme cookies for SSR consistency
      await context.addCookies([
        { name: 'theme_preset', value: variant.preset, domain: host, path: '/' },
        { name: 'theme_mode', value: variant.mode, domain: host, path: '/' },
      ]);

      const page = await context.newPage();

      // Pre-seed localStorage before navigation to ensure zero-FOUC
      await page.addInitScript(({ p, m }) => {
        try {
          localStorage.setItem('theme_preset', p);
          localStorage.setItem('theme_mode', m);
        } catch {}
      }, { p: variant.preset, m: variant.mode });

      const pageErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Filter known benign hydration or third-party log noise if any
          pageErrors.push(`[Console Error] ${text}`);
        }
      });
      page.on('pageerror', (err) => {
        pageErrors.push(`[Page Error] ${err.message}`);
      });

      try {
        const url = `${baseUrl}${screen}`;
        const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
        const status = response ? response.status() : 0;

        if (status >= 400) {
          throw new Error(`HTTP ${status} returned for ${url}`);
        }

        // Hide assistant floating action button to avoid obscuring UI
        await page.addStyleTag({ content: HIDE_ASSISTANT_FAB_CSS });

        // Ensure theme attribute on html matches expected
        await page.evaluate(({ p, m }) => {
          document.documentElement.setAttribute('data-theme', p);
          if (m === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }, { p: variant.preset, m: variant.mode });

        // Settle render
        await page.waitForTimeout(300);

        await page.screenshot({ path: outFile, fullPage: false });
        capturedCount++;

        if (pageErrors.length > 0) {
          console.warn(`[WARN] ${variant.preset} (${variant.mode}) ${screen}: ${pageErrors.length} client error(s)`);
          errors.push({ variant, screen, pageErrors });
        } else {
          console.log(`[OK]   ${variant.preset.padEnd(20)} [${variant.mode.padEnd(5)}] ${screen.padEnd(20)} -> ${outFile.replace(process.cwd() + '/', '')}`);
        }
      } catch (err) {
        console.error(`[FAIL] ${variant.preset} (${variant.mode}) ${screen}: ${err.message}`);
        errors.push({ variant, screen, error: err.message });
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
    if (serverProcess) {
      console.log('Shutting down preview server...');
      serverProcess.kill('SIGTERM');
      setTimeout(() => serverProcess.kill('SIGKILL'), 2000).unref();
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nCapture completed in ${durationSec}s. Captured: ${capturedCount}/${tasks.length} screenshots.`);

  if (errors.length > 0) {
    console.error(`Encountered ${errors.length} issue(s) during capture.`);
    // Exit with non-zero if actual failures occurred
    const fatalFails = errors.filter((e) => e.error);
    if (fatalFails.length > 0) {
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error('Fatal error in capture-visual-audit:', err);
  process.exit(1);
});
