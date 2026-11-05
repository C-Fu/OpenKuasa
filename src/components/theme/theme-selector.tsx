'use client';

import * as React from 'react';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useTheme } from '@/lib/use-theme';
import {
  THEME_PRESETS,
  isValidPreset,
  type ThemePreset,
  type ThemeMode,
} from '@/lib/theme';
import { sliceTheme, preloadKeris } from '@/components/theme/keris-slice';
import { ThemeMockupCard } from '@/components/theme/theme-mockup-card';
import { cn } from '@/lib/utils';

export type ThemeCategory = 'All' | 'Modern' | 'Datacenter' | 'Technical' | 'Retro';

export const THEME_CATEGORIES: Record<Exclude<ThemeCategory, 'All'>, ThemePreset[]> = {
  Modern: [
    'kuasa-emerald',
    'swiss-monochrome',
    'executive-editorial',
  ],
  Datacenter: [
    'proxmox-hypervisor',
    'tactile-rackmount',
  ],
  Technical: [
    'blueprint-cad',
    'brutalist-ledger',
    'factory-plc',
  ],
  Retro: [
    'crt-phosphor',
    'irix-unix',
    'scada-command',
    'analog-tape',
  ],
};

export function getThemeCategory(preset: ThemePreset): Exclude<ThemeCategory, 'All'> {
  for (const [category, presets] of Object.entries(THEME_CATEGORIES) as [Exclude<ThemeCategory, 'All'>, ThemePreset[]][]) {
    if (presets.includes(preset)) {
      return category;
    }
  }
  return 'Modern';
}

export interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { preset, mode, effectiveMode, meta, setPreset, setMode } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<ThemeCategory>('All');

  // Pre-load keris knife illustration on mount for lag-free View Transition
  React.useEffect(() => {
    preloadKeris();
  }, []);

  const handleSelectPreset = (nextPreset: ThemePreset) => {
    // Whitelist mitigation T-03-01
    if (!isValidPreset(nextPreset)) return;
    if (nextPreset === preset) return;

    const nextMeta = THEME_PRESETS[nextPreset];

    // Auto-switch to dark if target theme is locked-dark and user is in light mode per D-15
    if (nextMeta.lockedMode === 'dark' && effectiveMode === 'light') {
      void sliceTheme(() => {
        setPreset(nextPreset);
        setMode('dark');
      });
    } else {
      void sliceTheme(() => {
        setPreset(nextPreset);
      });
    }
    // D-05: Stays open for rapid previewing and comparison
  };

  const handleSelectMode = (nextMode: ThemeMode) => {
    if (nextMode === mode) return;
    void sliceTheme(() => {
      setMode(nextMode);
    });
  };

  // Filter themes based on search query (T-03-02 pure client array filter) and category
  const filteredPresets = React.useMemo(() => {
    const allPresets = Object.keys(THEME_PRESETS) as ThemePreset[];
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return allPresets.filter((p) => {
      // Whitelist check
      if (!isValidPreset(p)) return false;

      // Category filter
      if (selectedCategory !== 'All') {
        const categoryThemes = THEME_CATEGORIES[selectedCategory];
        if (!categoryThemes.includes(p)) {
          return false;
        }
      }

      // Keyword search
      if (!normalizedQuery) return true;

      const itemMeta = THEME_PRESETS[p];
      const matchName = itemMeta.name.toLowerCase().includes(normalizedQuery);
      const matchDesc = itemMeta.description.toLowerCase().includes(normalizedQuery);
      const matchId = p.toLowerCase().includes(normalizedQuery);

      return matchName || matchDesc || matchId;
    });
  }, [searchQuery, selectedCategory]);

  const activeMeta = THEME_PRESETS[preset] || meta;
  const isCurrentThemeLockedDark = activeMeta.lockedMode === 'dark';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Customize theme & appearance"
                aria-haspopup="dialog"
                className={cn('relative max-md:size-11', className)}
              >
                <Palette className="size-5" />
                <span className="sr-only">Customize theme & appearance</span>
                {/* Active Theme Indicator Dot */}
                <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary" />
              </Button>
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent side="bottom">
            Customize theme & appearance (current: {activeMeta.name})
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-88 p-3 flex flex-col gap-2.5 shadow-xl border bg-popover"
      >
        {/* Header: Title and Search */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold tracking-tight">
              Design Systems
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              12 presets
            </span>
          </div>

          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 12 themes..."
            className="h-8 text-xs bg-muted/50"
            aria-label="Search themes"
          />

          {/* Segmented Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
            {(['All', 'Modern', 'Datacenter', 'Technical', 'Retro'] as ThemeCategory[]).map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'rounded-md px-2 py-0.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer',
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>

        {/* Scrollable 2-Column Mockup Grid */}
        <div className="max-h-72 overflow-y-auto p-0.5 pr-1">
          {filteredPresets.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground flex flex-col items-center justify-center gap-1">
              <p className="text-xs font-medium text-foreground">No matching themes</p>
              <p className="text-[11px]">No curated design systems match your query. Try clearing your search.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-2 text-xs text-primary underline underline-offset-2 cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {filteredPresets.map((presetId) => {
                const itemMeta = THEME_PRESETS[presetId];
                return (
                  <ThemeMockupCard
                    key={presetId}
                    presetId={presetId}
                    name={itemMeta.name}
                    isActive={presetId === preset}
                    lockedMode={itemMeta.lockedMode}
                    variant="mini"
                    onSelect={() => handleSelectPreset(presetId)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="border-t my-0.5" />

        {/* Footer: Quick Mode Switcher or Locked Notice */}
        <div className="flex flex-col gap-1.5 pt-0.5">
          {isCurrentThemeLockedDark ? (
            <div className="flex items-center justify-between rounded-lg bg-muted/60 px-2.5 py-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Moon className="size-3.5 text-primary" />
                Dark mode locked
              </span>
              <span className="text-[10px] text-muted-foreground">Hardware aesthetic</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Appearance</span>
              <div className="inline-flex rounded-lg border bg-muted/40 p-0.5">
                <button
                  type="button"
                  onClick={() => handleSelectMode('light')}
                  className={cn(
                    'flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors cursor-pointer',
                    mode === 'light'
                      ? 'bg-background text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  aria-pressed={mode === 'light'}
                >
                  <Sun className="size-3.5" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMode('dark')}
                  className={cn(
                    'flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors cursor-pointer',
                    mode === 'dark'
                      ? 'bg-background text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  aria-pressed={mode === 'dark'}
                >
                  <Moon className="size-3.5" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMode('system')}
                  className={cn(
                    'flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors cursor-pointer',
                    mode === 'system'
                      ? 'bg-background text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  aria-pressed={mode === 'system'}
                >
                  <Monitor className="size-3.5" />
                  <span>System</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
