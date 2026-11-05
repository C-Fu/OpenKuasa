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

  // Pre-load keris knife illustration on mount for smooth View Transitions
  React.useEffect(() => {
    preloadKeris();
  }, []);

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
