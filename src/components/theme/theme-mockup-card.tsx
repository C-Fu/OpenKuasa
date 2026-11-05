'use client';

import * as React from 'react';
import { Check, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ThemePreset } from '@/lib/theme';

export interface ThemePaletteDefinition {
  brand: string;
  surface: string;
  border: string;
  accent: string;
}

export const THEME_PALETTES: Record<ThemePreset, ThemePaletteDefinition> = {
  'kuasa-emerald': {
    brand: '#059669',
    surface: '#0f172a',
    border: '#1e293b',
    accent: '#10b981',
  },
  'proxmox-hypervisor': {
    brand: '#f59e0b',
    surface: '#0a0a0a',
    border: '#262626',
    accent: '#d97706',
  },
  'swiss-monochrome': {
    brand: '#ffffff',
    surface: '#09090b',
    border: '#27272a',
    accent: '#e4e4e7',
  },
  'crt-phosphor': {
    brand: '#00ff66',
    surface: '#050806',
    border: '#003314',
    accent: '#33ff85',
  },
  'executive-editorial': {
    brand: '#c29b38',
    surface: '#0f1418',
    border: '#232d35',
    accent: '#e2ba55',
  },
  'tactile-rackmount': {
    brand: '#00e5ff',
    surface: '#121417',
    border: '#222831',
    accent: '#ff6b35',
  },
  'blueprint-cad': {
    brand: '#0284c7',
    surface: '#070e1c',
    border: '#0f294a',
    accent: '#38bdf8',
  },
  'irix-unix': {
    brand: '#ffd54f',
    surface: '#1c2b36',
    border: '#2c4355',
    accent: '#5c6bc0',
  },
  'scada-command': {
    brand: '#f59e0b',
    surface: '#05090f',
    border: '#162b47',
    accent: '#10b981',
  },
  'factory-plc': {
    brand: '#eab308',
    surface: '#191e1b',
    border: '#2f3b33',
    accent: '#ef4444',
  },
  'brutalist-ledger': {
    brand: '#f8fafc',
    surface: '#020617',
    border: '#334155',
    accent: '#94a3b8',
  },
  'analog-tape': {
    brand: '#ffaa33',
    surface: '#1c1815',
    border: '#3b322b',
    accent: '#ffd580',
  },
};

export interface ThemeMockupCardProps {
  presetId: ThemePreset;
  name: string;
  description?: string;
  archetypeBadge?: string;
  palette?: ThemePaletteDefinition;
  isActive: boolean;
  lockedMode?: 'light' | 'dark';
  variant?: 'mini' | 'rich' | 'large';
  onSelect?: () => void;
  className?: string;
}

export function ThemeMockupCard({
  presetId,
  name,
  description,
  archetypeBadge,
  palette: customPalette,
  isActive,
  lockedMode,
  variant = 'mini',
  onSelect,
  className,
}: ThemeMockupCardProps) {
  const palette = customPalette || THEME_PALETTES[presetId];

  if (variant === 'mini') {
    return (
      <button
        type="button"
        role="button"
        onClick={onSelect}
        aria-pressed={isActive}
        aria-label={name}
        className={cn(
          'group relative flex flex-col rounded-lg border p-1.5 text-left transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer select-none',
          isActive
            ? 'border-primary ring-2 ring-primary bg-primary/5'
            : 'border-border bg-card hover:border-foreground/20',
          className
        )}
      >
        {/* Mockup Canvas (72px height total representation) */}
        <div
          className="relative h-14 w-full overflow-hidden rounded border"
          style={{
            backgroundColor: palette.surface,
            borderColor: palette.border,
          }}
        >
          {/* Header strip (4px height) with accent dot */}
          <div
            className="flex h-3 w-full items-center justify-between px-1.5 border-b"
            style={{ borderColor: palette.border }}
          >
            <div
              className="size-1.5 rounded-full"
              style={{ backgroundColor: palette.brand }}
            />
            <div
              className="size-1 rounded-full opacity-60"
              style={{ backgroundColor: palette.accent }}
            />
          </div>

          {/* Sidebar (12px) & content area */}
          <div className="flex h-full">
            <div
              className="w-3 border-r h-full flex flex-col items-center pt-1 gap-0.5"
              style={{
                borderColor: palette.border,
                backgroundColor: palette.surface,
              }}
            >
              <div
                className="size-1 rounded-full opacity-70"
                style={{ backgroundColor: palette.accent }}
              />
            </div>
            <div className="p-1 flex flex-col gap-1 flex-1">
              <div
                className="h-1 w-7 rounded-full"
                style={{ backgroundColor: palette.brand }}
              />
              <div
                className="h-1 w-4 rounded-full opacity-50"
                style={{ backgroundColor: palette.accent }}
              />
              {/* Miniature button chip */}
              <div
                className="mt-0.5 h-2 w-5 rounded-[2px]"
                style={{ backgroundColor: palette.brand }}
              />
            </div>
          </div>

          {/* Checkmark badge when active */}
          {isActive && (
            <div className="absolute top-1 right-1 rounded-full bg-primary p-0.5 text-primary-foreground shadow-sm">
              <Check className="size-2.5 stroke-[3]" />
            </div>
          )}
        </div>

        {/* Title label & optional locked badge */}
        <div className="mt-1 flex items-center justify-between text-xs font-medium">
          <span className="truncate">{name}</span>
          {lockedMode === 'dark' && (
            <span title="Locked Dark Theme">
              <Moon className="size-2.5 text-muted-foreground shrink-0 ml-1" />
            </span>
          )}
        </div>
      </button>
    );
  }

  // Rich / Large Mockup Card for Appearance Gallery (~144px height preview)
  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-xl border bg-card p-4 text-card-foreground shadow-sm transition-all',
        isActive ? 'ring-2 ring-primary border-primary' : 'hover:border-foreground/20',
        className
      )}
    >
      {/* Authentic preview canvas */}
      <div
        className="relative h-36 w-full overflow-hidden rounded-lg border p-3 flex flex-col justify-between"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.border,
        }}
      >
        {/* Top bar with logo and status dot */}
        <div
          className="flex items-center justify-between border-b pb-2"
          style={{ borderColor: palette.border }}
        >
          <span className="text-xs font-semibold" style={{ color: palette.brand }}>
            OpenKuasa
          </span>
          <div className="flex items-center gap-1.5">
            {lockedMode === 'dark' && (
              <Moon className="size-3 text-muted-foreground" />
            )}
            <div
              className="size-2 rounded-full"
              style={{ backgroundColor: palette.accent }}
            />
          </div>
        </div>

        {/* Simulated UI layout */}
        <div className="flex gap-3 items-center">
          <div
            className="size-8 rounded-md flex items-center justify-center font-bold text-xs"
            style={{
              backgroundColor: palette.brand,
              color: palette.surface,
            }}
          >
            OK
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <div
              className="h-2.5 w-24 rounded"
              style={{ backgroundColor: palette.brand }}
            />
            <div
              className="h-2 w-16 rounded opacity-60"
              style={{ backgroundColor: palette.accent }}
            />
          </div>
        </div>

        {/* Bottom swatch strip */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span
              className="size-3 rounded-full border"
              style={{ backgroundColor: palette.brand, borderColor: palette.border }}
              title="Brand"
            />
            <span
              className="size-3 rounded-full border"
              style={{ backgroundColor: palette.surface, borderColor: palette.border }}
              title="Surface"
            />
            <span
              className="size-3 rounded-full border"
              style={{ backgroundColor: palette.accent, borderColor: palette.border }}
              title="Accent"
            />
            <span
              className="size-3 rounded-full border"
              style={{ backgroundColor: palette.border, borderColor: palette.brand }}
              title="Border"
            />
          </div>
          {archetypeBadge && (
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {archetypeBadge}
            </span>
          )}
        </div>

        {/* Active checkmark pill */}
        {isActive && (
          <div className="absolute top-2 right-2 rounded-full bg-primary p-1 text-primary-foreground shadow">
            <Check className="size-3 stroke-[3]" />
          </div>
        )}
      </div>

      {/* Meta description & CTA */}
      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{name}</h3>
          {lockedMode === 'dark' && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Moon className="size-3" /> Dark only
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {onSelect && (
        <button
          type="button"
          onClick={onSelect}
          disabled={isActive}
          className={cn(
            'mt-3 w-full rounded-md py-1.5 text-xs font-semibold transition-colors cursor-pointer',
            isActive
              ? 'bg-muted text-muted-foreground cursor-default'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
          {isActive ? 'Active Theme' : 'Apply Theme'}
        </button>
      )}
    </div>
  );
}
