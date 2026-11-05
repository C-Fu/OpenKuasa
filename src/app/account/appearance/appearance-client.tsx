'use client';

import * as React from 'react';
import { Sun, Moon, Monitor, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { useTheme } from '@/lib/use-theme';
import {
  THEME_PRESETS,
  isValidPreset,
  type ThemePreset,
  type ThemeMode,
} from '@/lib/theme';
import { sliceTheme, preloadKeris } from '@/components/theme/keris-slice';
import { ThemeMockupCard } from '@/components/theme/theme-mockup-card';
import {
  THEME_CATEGORIES,
  type ThemeCategory,
} from '@/components/theme/theme-selector';
import {
  VuMeter,
  TelemetryBeacon,
  RockerSwitch,
  CadCrosshair,
  TapeReel,
  type BeaconStatus,
  type VuMeterVariant,
} from '@/components/theme-widgets';
import { cn } from '@/lib/utils';

const ARCHETYPE_BADGES: Record<ThemePreset, string> = {
  'kuasa-emerald': 'Malaysian Jade',
  'proxmox-hypervisor': 'Hypervisor Amber',
  'swiss-monochrome': 'Swiss Monospace',
  'crt-phosphor': 'Phosphor CRT',
  'executive-editorial': 'Editorial Serif',
  'tactile-rackmount': 'Euro-Rack Steel',
  'blueprint-cad': 'Drafting CAD',
  'irix-unix': 'Motif 4Dwm',
  'scada-command': 'Tactical DEFCON',
  'factory-plc': 'Industrial HMI',
  'brutalist-ledger': 'Financial Ledger',
  'analog-tape': 'Mastering Deck',
};

const CATEGORY_TABS: { id: ThemeCategory; label: string }[] = [
  { id: 'All', label: 'All' },
  { id: 'Modern', label: 'Modern & Minimal' },
  { id: 'Datacenter', label: 'Datacenter & Hypervisor' },
  { id: 'Technical', label: 'Engineering & Technical' },
  { id: 'Retro', label: 'Retro & Workstation' },
];

export function AppearanceClient() {
  const { preset, mode, effectiveMode, meta, setPreset, setMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = React.useState<ThemeCategory>('All');

  // Interactive Tactile Hardware Showcase state
  const [isRockerActive, setIsRockerActive] = React.useState(true);
  const [meterValue, setMeterValue] = React.useState(68);
  const [selectedVariant, setSelectedVariant] = React.useState<VuMeterVariant>('auto');
  const [beaconStatus, setBeaconStatus] = React.useState<BeaconStatus>('healthy');
  const [crosshairCoords, setCrosshairCoords] = React.useState({ x: '101.42', y: '03.15' });

  // Pre-load keris knife illustration on mount for smooth View Transitions
  React.useEffect(() => {
    preloadKeris();
  }, []);

  // Live telemetry pulse simulation for VuMeter and coordinates when rocker is active
  React.useEffect(() => {
    if (!isRockerActive) return;

    const interval = setInterval(() => {
      // Natural oscillating audio/telemetry jitter
      setMeterValue((prev) => {
        const delta = (Math.random() - 0.48) * 16;
        return Math.min(96, Math.max(18, Math.round(prev + delta)));
      });

      // Minor precision coordinate drift simulation
      setCrosshairCoords({
        x: (101.42 + (Math.random() * 0.05)).toFixed(3),
        y: (3.15 + (Math.random() * 0.04)).toFixed(3),
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isRockerActive]);

  const activeMeta = THEME_PRESETS[preset] || meta;
  const isCurrentThemeLockedDark = activeMeta.lockedMode === 'dark';

  const handleSelectPreset = (nextPreset: ThemePreset) => {
    if (!isValidPreset(nextPreset)) return;
    if (nextPreset === preset) return;

    const targetMeta = THEME_PRESETS[nextPreset];

    // If target theme is locked-dark and current mode is light, auto-switch to dark per D-15
    if (targetMeta.lockedMode === 'dark' && effectiveMode === 'light') {
      void sliceTheme(() => {
        setPreset(nextPreset);
        setMode('dark');
      });
    } else {
      void sliceTheme(() => {
        setPreset(nextPreset);
      });
    }
  };

  const handleSelectMode = (nextMode: ThemeMode) => {
    if (nextMode === mode) return;
    if (isCurrentThemeLockedDark && nextMode === 'light') return;

    void sliceTheme(() => {
      setMode(nextMode);
    });
  };

  const filteredPresets = React.useMemo(() => {
    const allPresets = Object.keys(THEME_PRESETS) as ThemePreset[];
    if (selectedCategory === 'All') return allPresets;

    const categoryThemes = THEME_CATEGORIES[selectedCategory];
    return allPresets.filter((p) => categoryThemes.includes(p));
  }, [selectedCategory]);

  return (
    <div className="space-y-10">
      {/* Top Mode Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle>Interface Mode</CardTitle>
          <CardDescription>
            Choose how OpenKuasa renders surfaces and typography.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Locked-dark notice banner if active theme requires dark mode */}
          {isCurrentThemeLockedDark && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Signature Design System Notice</p>
                <p className="mt-0.5 text-muted-foreground">
                  The active theme (<strong>{activeMeta.name}</strong>) is a specialized hardware aesthetic designed exclusively for dark mode. Light mode is disabled while this preset is active.
                </p>
              </div>
            </div>
          )}

          {/* Mode options segmented cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* System Default */}
            <button
              type="button"
              onClick={() => handleSelectMode('system')}
              disabled={isCurrentThemeLockedDark}
              className={cn(
                'group flex items-center gap-3.5 rounded-lg border p-3.5 text-left transition-all cursor-pointer select-none',
                mode === 'system'
                  ? 'border-primary ring-2 ring-primary bg-primary/5'
                  : 'border-border bg-card hover:border-foreground/20',
                isCurrentThemeLockedDark && 'opacity-50 cursor-not-allowed hover:border-border'
              )}
            >
              <div
                className={cn(
                  'grid size-9 place-items-center rounded-lg border transition-colors',
                  mode === 'system'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-muted/50 text-muted-foreground group-hover:text-foreground'
                )}
              >
                <Monitor className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">System Default</span>
                <span className="text-[11px] text-muted-foreground">Sync with OS</span>
              </div>
            </button>

            {/* Light Mode */}
            <button
              type="button"
              onClick={() => handleSelectMode('light')}
              disabled={isCurrentThemeLockedDark}
              className={cn(
                'group flex items-center gap-3.5 rounded-lg border p-3.5 text-left transition-all cursor-pointer select-none',
                mode === 'light'
                  ? 'border-primary ring-2 ring-primary bg-primary/5'
                  : 'border-border bg-card hover:border-foreground/20',
                isCurrentThemeLockedDark && 'opacity-50 cursor-not-allowed hover:border-border'
              )}
            >
              <div
                className={cn(
                  'grid size-9 place-items-center rounded-lg border transition-colors',
                  mode === 'light'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-muted/50 text-muted-foreground group-hover:text-foreground'
                )}
              >
                <Sun className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Light</span>
                <span className="text-[11px] text-muted-foreground">Clean daylight surfaces</span>
              </div>
            </button>

            {/* Dark Mode */}
            <button
              type="button"
              onClick={() => handleSelectMode('dark')}
              className={cn(
                'group flex items-center gap-3.5 rounded-lg border p-3.5 text-left transition-all cursor-pointer select-none',
                mode === 'dark'
                  ? 'border-primary ring-2 ring-primary bg-primary/5'
                  : 'border-border bg-card hover:border-foreground/20'
              )}
            >
              <div
                className={cn(
                  'grid size-9 place-items-center rounded-lg border transition-colors',
                  mode === 'dark'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-muted/50 text-muted-foreground group-hover:text-foreground'
                )}
              >
                <Moon className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Dark</span>
                <span className="text-[11px] text-muted-foreground">Focused low-glare depth</span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Tactile Hardware Showcase Section */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span>Tactile Hardware Showcase</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  SKEUOMORPHIC UI
                </span>
              </CardTitle>
              <CardDescription>
                Interactive physical micro-widgets adapting dynamically to your active theme personality.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              <span className="text-xs font-mono text-muted-foreground uppercase">
                Active Theme:
              </span>
              <span className="text-xs font-bold font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                {activeMeta.name}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. VU Meter Telemetry Card */}
            <div className="rounded-lg border border-border bg-card p-4 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  1. Telemetry Gauge
                </span>
                {/* Variant Switcher Pills */}
                <div className="flex gap-1 text-[9px] font-mono">
                  {(['auto', 'needle', 'led', 'strip'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={cn(
                        'px-1.5 py-0.5 rounded cursor-pointer uppercase transition-colors',
                        selectedVariant === v
                          ? 'bg-primary text-primary-foreground font-bold'
                          : 'bg-muted/70 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-2 flex flex-col items-center justify-center">
                <VuMeter
                  value={isRockerActive ? meterValue : 0}
                  valueRight={isRockerActive ? Math.min(100, Math.max(0, meterValue - 6)) : 0}
                  variant={selectedVariant}
                  channels={2}
                  label="BUS // MONITOR LEVEL"
                  unit="dB"
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/40">
                <span>CHANNEL DYNAMICS</span>
                <span className={cn('font-bold', isRockerActive ? 'text-emerald-500' : 'text-neutral-500')}>
                  {isRockerActive ? 'ONLINE // LIVE' : 'BUS OFFLINE'}
                </span>
              </div>
            </div>

            {/* 2. Tactile Rocker Switch Card */}
            <div className="rounded-lg border border-border bg-card p-4 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  2. Power / Bus Switch
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  CLICK OR PRESS SPACE
                </span>
              </div>

              <div className="py-4 flex flex-col items-center justify-center gap-3">
                <RockerSwitch
                  checked={isRockerActive}
                  onCheckedChange={setIsRockerActive}
                  label="MAIN BUS POWER"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/40">
                <span>INTERACTION STATUS</span>
                <span className={cn('font-bold', isRockerActive ? 'text-orange-500' : 'text-neutral-500')}>
                  {isRockerActive ? 'MASTER POWER: ON' : 'MASTER POWER: STANDBY'}
                </span>
              </div>
            </div>

            {/* 3. Defense Radar Telemetry Beacon Card */}
            <div className="rounded-lg border border-border bg-card p-4 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  3. Defense Radar Beacon
                </span>
                {/* Status Switcher Pills */}
                <div className="flex gap-1 text-[9px] font-mono">
                  {(['healthy', 'warning', 'critical', 'offline'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setBeaconStatus(s)}
                      className={cn(
                        'px-1.5 py-0.5 rounded cursor-pointer uppercase transition-colors',
                        beaconStatus === s
                          ? 'bg-primary text-primary-foreground font-bold'
                          : 'bg-muted/70 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {s.slice(0, 4)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-4 flex flex-col items-center justify-center gap-2">
                <TelemetryBeacon
                  status={isRockerActive ? beaconStatus : 'offline'}
                  size="lg"
                  showRadar={isRockerActive}
                  label={isRockerActive ? undefined : 'POWER CUT'}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/40">
                <span>RADAR TELEMETRY</span>
                <span className="font-bold text-foreground uppercase">
                  {isRockerActive ? beaconStatus : 'offline'}
                </span>
              </div>
            </div>

            {/* 4. CAD Coordinate Alignment Crosshair */}
            <div className="rounded-lg border border-border bg-card p-4 flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  4. CAD Drafting Alignment
                </span>
                <span className="text-[10px] font-mono text-primary font-bold">
                  ISO-128 SPEC
                </span>
              </div>

              <div className="py-1">
                <CadCrosshair
                  xCoord={crosshairCoords.x}
                  yCoord={crosshairCoords.y}
                  drawingNo="HL-DWG-04"
                >
                  <div className="py-3 px-1 text-xs font-mono space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">TOLERANCE:</span>
                      <span className="font-semibold text-foreground">+/- 0.00% DRIFT</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">REGISTRATION:</span>
                      <span className="font-semibold text-emerald-500">LOCKED [4-CORNER]</span>
                    </div>
                  </div>
                </CadCrosshair>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/40">
                <span>COORDINATE DRIFT</span>
                <span className="font-mono text-foreground font-semibold">
                  LIVE TRACKING
                </span>
              </div>
            </div>

            {/* 5. Analog Tape Reel Hub */}
            <div className="rounded-lg border border-border bg-card p-4 flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  5. Studio Reel Transport
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">SPEED: 15 IPS</span>
                  <span className={cn('text-[9px] font-mono px-2 py-0.5 rounded font-bold', isRockerActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-muted text-muted-foreground')}>
                    {isRockerActive ? 'TRANSPORT ACTIVE' : 'TRANSPORT PAUSED'}
                  </span>
                </div>
              </div>

              <div className="py-3 flex items-center justify-center">
                <TapeReel
                  spinning={isRockerActive}
                  speed="standard"
                  size="md"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/40">
                <span>MAGNETIC SPOOL</span>
                <span>SWITCH POWER BUS (WIDGET 2) TO TOGGLE ROTATION</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Gallery Section */}
      <div className="space-y-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Theme Gallery</h2>
            <p className="text-sm text-muted-foreground">
              Explore 12 curated design systems engineered with custom typography, semantic color tokens, and unique surface textures.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer',
                selectedCategory === tab.id
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Responsive 12-theme mockup grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPresets.map((presetId) => {
            const itemMeta = THEME_PRESETS[presetId];
            return (
              <ThemeMockupCard
                key={presetId}
                presetId={presetId}
                name={itemMeta.name}
                description={itemMeta.description}
                archetypeBadge={ARCHETYPE_BADGES[presetId]}
                isActive={presetId === preset}
                lockedMode={itemMeta.lockedMode}
                variant="rich"
                onSelect={() => handleSelectPreset(presetId)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
