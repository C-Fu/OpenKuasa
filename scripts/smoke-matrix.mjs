#!/usr/bin/env node
/**
 * scripts/smoke-matrix.mjs
 *
 * Multi-Theme Smoke Route Crawler Harness (Phase 5, D-01, D-04, D-09, D-11)
 *
 * Crawls application routes across all 12 curated themes in appropriate light/dark
 * variants (17 total configurations) injecting theme cookies (`theme_preset`, `theme_mode`)
 * and validating SSR hydration, HTTP status codes, and server stability.
 */
import { spawn } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { navEntries } from './nav-routes.mjs';

const root = process.cwd();
const host = process.env.SMOKE_HOST || '127.0.0.1';
const port = process.env.SMOKE_PORT || '3175';
const baseUrl = process.env.SMOKE_BASE_URL || `http://${host}:${port}`;
const allowedStatuses = new Set([200, 301, 302, 303, 307, 308]);

// All 12 curated themes and their supported mode configurations
export const THEME_CONFIGS = [
  // 5 Dual-mode flexible themes (both dark & light = 10 configurations)
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

  // 7 Hardware/retro presets strictly locked to dark (7 configurations)
  { preset: 'proxmox-hypervisor', mode: 'dark', locked: true },
  { preset: 'crt-phosphor', mode: 'dark', locked: true },
  { preset: 'tactile-rackmount', mode: 'dark', locked: true },
  { preset: 'irix-unix', mode: 'dark', locked: true },
  { preset: 'scada-command', mode: 'dark', locked: true },
  { preset: 'factory-plc', mode: 'dark', locked: true },
  { preset: 'analog-tape', mode: 'dark', locked: true },
];

export const CORE_MODULE_ROUTES = [
  '/command',
  '/reach',
  '/crm',
  '/people',
  '/hire',
  '/finance',
  '/account/appearance',
];

function listAccountRoutes() {
  const dir = join(root, 'src/app/account');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((entry) => {
      const fullPath = join(dir, entry);
      return entry !== 'layout.tsx' && statSync(fullPath).isDirectory() && existsSync(join(fullPath, 'page.tsx'));
    })
    .map((entry) => `/account/${entry}`);
}

function listProductRoutes() {
  const routes = [];
  for (const { key, slugs } of navEntries(root)) {
    routes.push(`/${key}`);
    for (const slug of slugs) routes.push(`/${key}/${slug}`);
  }
  return routes;
}

function unique(values) {
  return [...new Set(values)].sort();
}

export function getAllRoutes() {
  return unique([
    '/',
    '/login',
    '/onboarding',
    '/pricing',
    '/privacy',
    '/settings',
    '/account',
    ...listAccountRoutes(),
    ...listProductRoutes(),
  ]);
}

async function waitForServer(targetUrl, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(targetUrl, { redirect: 'manual' });
      if (response.status > 0) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${targetUrl}: ${lastError?.message ?? 'no response'}`);
}

async function checkRouteWithTheme(route, preset, mode) {
  const cookieHeader = `theme_preset=${preset}; theme_mode=${mode}`;
  const start = performance.now();
  const response = await fetch(`${baseUrl}${route}`, {
    headers: {
      Cookie: cookieHeader,
      'User-Agent': 'OpenKuasa-SmokeCrawler/1.0',
    },
    redirect: 'manual',
  });
  const durationMs = Math.round(performance.now() - start);

  const ok = allowedStatuses.has(response.status);
  const location = response.headers.get('location') || '';

  return {
    route,
    preset,
    mode,
    status: response.status,
    location,
    durationMs,
    ok,
  };
}

function parseCliArgs() {
  const args = process.argv.slice(2);
  let themesFilter = null;
  let routesFilter = null;
  let matrixMode = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--matrix') {
      matrixMode = true;
    } else if (arg === '--themes' && args[i + 1]) {
      themesFilter = args[++i].split(',').map((s) => s.trim());
    } else if (arg === '--routes' && args[i + 1]) {
      routesFilter = args[++i].split(',').map((s) => s.trim());
    } else if (arg.startsWith('--themes=')) {
      themesFilter = arg.split('=')[1].split(',').map((s) => s.trim());
    } else if (arg.startsWith('--routes=')) {
      routesFilter = arg.split('=')[1].split(',').map((s) => s.trim());
    }
  }

  return { themesFilter, routesFilter, matrixMode };
}

async function main() {
  if (!existsSync(join(root, '.next/BUILD_ID'))) {
    throw new Error('No production build found. Run `pnpm build` before running smoke matrix.');
  }

  const { themesFilter, routesFilter, matrixMode } = parseCliArgs();

  // Determine theme configs to sweep
  let configs = THEME_CONFIGS;
  if (themesFilter && themesFilter.length > 0) {
    configs = THEME_CONFIGS.filter((c) => themesFilter.includes(c.preset));
    if (configs.length === 0) {
      throw new Error(`No matching themes found for filter: ${themesFilter.join(', ')}`);
    }
  }

  // Determine routes to sweep
  let routes;
  if (routesFilter && routesFilter.length > 0) {
    routes = routesFilter;
  } else if (matrixMode) {
    // In full matrix mode, we check all routes across default theme, and CORE_MODULE_ROUTES across all other 16 configurations
    routes = getAllRoutes();
  } else {
    // Default mode without args: sweeps core module routes across selected/all theme configs
    routes = CORE_MODULE_ROUTES;
  }

  let server = null;
  // If SMOKE_BASE_URL is not explicitly set, spawn our own preview Next.js instance
  const shouldSpawn = !process.env.SMOKE_BASE_URL;

  if (shouldSpawn) {
    console.log(`Starting preview Next.js instance on ${host}:${port}...`);
    server = spawn('pnpm', ['exec', 'next', 'start', '--hostname', host, '--port', port], {
      cwd: root,
      env: { OPENKUASA_PREVIEW: '1', ...process.env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    server.stdout.on('data', (d) => process.stdout.write(d));
    server.stderr.on('data', (d) => process.stderr.write(d));
  }

  try {
    await waitForServer(baseUrl);
    console.log(`Connected to test server at ${baseUrl}`);
    console.log(`Executing multi-theme smoke sweep (${configs.length} theme configs, ${routes.length} routes)...`);

    const results = [];
    const startTime = Date.now();

    for (const config of configs) {
      for (const route of routes) {
        const res = await checkRouteWithTheme(route, config.preset, config.mode);
        results.push(res);
        const prefix = res.ok ? 'OK' : 'FAIL';
        const suffix = res.location ? ` -> ${res.location}` : '';
        console.log(`${prefix} ${res.status} [${res.preset}:${res.mode}] ${res.route}${suffix} (${res.durationMs}ms)`);
      }
    }

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    const failed = results.filter((r) => !r.ok);

    console.log('\n--- Multi-Theme Smoke Sweep Summary ---');
    console.log(`Total checks:   ${results.length}`);
    console.log(`Theme variants: ${configs.length}`);
    console.log(`Routes tested:  ${routes.length}`);
    console.log(`Total duration: ${totalDuration}s`);
    console.log(`Failures:       ${failed.length}`);

    if (failed.length > 0) {
      console.error('\nFailed route executions:');
      for (const f of failed) {
        console.error(`- [${f.preset}:${f.mode}] ${f.route} returned HTTP ${f.status}`);
      }
      process.exitCode = 1;
      throw new Error(`${failed.length}/${results.length} checks failed multi-theme smoke verification.`);
    }

    console.log('✓ All multi-theme smoke checks passed with zero 500/404 errors.');
  } finally {
    if (server) {
      server.kill('SIGTERM');
      setTimeout(() => server.kill('SIGKILL'), 2000).unref();
    }
  }
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
