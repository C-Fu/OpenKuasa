'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/use-theme';
import type { ThemePreset } from '@/lib/theme';

export type VuMeterVariant = 'needle' | 'led' | 'strip' | 'auto';

export interface VuMeterProps {
  /** Value from 0 to 100 */
  value?: number;
  /** Display variant: needle dial, segmented LED bar, minimalist strip, or auto based on theme */
  variant?: VuMeterVariant;
  /** Primary label under or above the meter */
  label?: string;
  /** Secondary subtitle or unit (e.g. dB, kHz, %) */
  unit?: string;
  /** Number of channels (1 or 2) */
  channels?: 1 | 2;
  /** Optional secondary channel value (0 to 100) */
  valueRight?: number;
  /** Custom className */
  className?: string;
  /** Visual size override */
  size?: 'sm' | 'md' | 'lg';
}

function resolvePresetVariant(preset: ThemePreset): 'needle' | 'led' | 'strip' {
  switch (preset) {
    case 'analog-tape':
    case 'executive-editorial':
      return 'needle';
    case 'scada-command':
    case 'crt-phosphor':
    case 'tactile-rackmount':
    case 'proxmox-hypervisor':
    case 'factory-plc':
      return 'led';
    case 'swiss-monochrome':
    case 'kuasa-emerald':
    case 'blueprint-cad':
    case 'brutalist-ledger':
    case 'irix-unix':
    default:
      return 'strip';
  }
}

export function VuMeter({
  value = 0,
  variant = 'auto',
  label,
  unit = 'dB',
  channels = 1,
  valueRight,
  className,
  size = 'md',
}: VuMeterProps) {
  const { preset } = useTheme();

  // Threat T-04-04: sanitize bounds strictly between 0 and 100
  const safeValLeft = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
  const safeValRight = Math.min(
    100,
    Math.max(0, Number.isFinite(valueRight ?? value) ? (valueRight ?? value) : 0)
  );

  const activeVariant = variant === 'auto' ? resolvePresetVariant(preset) : variant;

  return (
    <div
      role="meter"
      aria-valuenow={safeValLeft}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ? `${label} level` : 'VU Level Meter'}
      className={cn('inline-flex flex-col items-center select-none', className)}
    >
      {label && (
        <div className="flex items-center justify-between w-full mb-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <span>{label}</span>
          {unit && <span className="opacity-75">{unit}</span>}
        </div>
      )}

      {activeVariant === 'needle' && (
        <div className="flex gap-2 items-center">
          <NeedleDisplay value={safeValLeft} size={size} channelLabel={channels === 2 ? 'L' : undefined} />
          {channels === 2 && (
            <NeedleDisplay value={safeValRight} size={size} channelLabel="R" />
          )}
        </div>
      )}

      {activeVariant === 'led' && (
        <div className="flex flex-col gap-1.5 w-full">
          <LedBarDisplay value={safeValLeft} size={size} channelLabel={channels === 2 ? 'CH-1' : undefined} />
          {channels === 2 && (
            <LedBarDisplay value={safeValRight} size={size} channelLabel="CH-2" />
          )}
        </div>
      )}

      {activeVariant === 'strip' && (
        <div className="flex flex-col gap-1 w-full">
          <StripDisplay value={safeValLeft} size={size} channelLabel={channels === 2 ? 'L' : undefined} />
          {channels === 2 && (
            <StripDisplay value={safeValRight} size={size} channelLabel="R" />
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. NEEDLE DISPLAY (Analog Hi-Fi Style)
// ---------------------------------------------------------------------------
function NeedleDisplay({
  value,
  size,
  channelLabel,
}: {
  value: number;
  size: 'sm' | 'md' | 'lg';
  channelLabel?: string;
}) {
  // Map value 0..100 to angle -40deg .. +40deg
  const angle = -40 + (value / 100) * 80;

  const sizeClasses = {
    sm: 'w-28 h-16',
    md: 'w-36 h-20',
    lg: 'w-48 h-28',
  }[size];

  return (
    <div
      className={cn(
        'relative rounded border border-[#3a2818] overflow-hidden flex flex-col justify-between p-1.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_4px_10px_rgba(0,0,0,0.5)]',
        'bg-gradient-to-b from-[#fff6d6] via-[#f7d58d] to-[#d6a54d]',
        sizeClasses
      )}
    >
      {/* Curved Dial Markings */}
      <div className="relative w-full h-full flex flex-col items-center justify-between text-[#2e1d0f] font-mono text-[8px] font-bold">
        {/* Arc Scale Labels */}
        <div className="flex justify-between w-full px-2 pt-0.5 opacity-80">
          <span>-20</span>
          <span>-10</span>
          <span>-5</span>
          <span>0</span>
          <span className="text-red-700 font-extrabold">+3</span>
        </div>

        {/* Center Logo or Channel Indicator */}
        <div className="text-[7px] tracking-widest uppercase opacity-60 font-serif">
          {channelLabel ? `CH // ${channelLabel}` : 'MASTER VU'}
        </div>

        {/* Pivot Hub */}
        <div className="w-4 h-4 rounded-full bg-[#1c140e] border border-[#523820] shadow-md z-10 -mb-2" />

        {/* Moving Needle */}
        <div
          className="absolute bottom-0 left-1/2 w-[1.5px] h-[82%] bg-[#1c1209] origin-bottom shadow-xs transition-transform duration-200 ease-out z-10 pointer-events-none"
          style={{
            transform: `translateX(-50%) rotate(${angle}deg)`,
          }}
        >
          {/* Red indicator tip on top */}
          <div className="w-1.5 h-2 -ml-[2px] bg-red-600 rounded-t-sm" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. LED SEGMENT BAR (SCADA / Rackmount Style)
// ---------------------------------------------------------------------------
const TOTAL_SEGMENTS = 16;

function LedBarDisplay({
  value,
  size,
  channelLabel,
}: {
  value: number;
  size: 'sm' | 'md' | 'lg';
  channelLabel?: string;
}) {
  const activeSegments = Math.round((value / 100) * TOTAL_SEGMENTS);

  const heightClasses = {
    sm: 'h-2.5',
    md: 'h-4',
    lg: 'h-6',
  }[size];

  return (
    <div className="flex items-center gap-2 w-full">
      {channelLabel && (
        <span className="text-[9px] font-mono text-muted-foreground w-7 shrink-0">
          {channelLabel}
        </span>
      )}
      <div
        className={cn(
          'flex-1 flex gap-[2px] p-1 bg-[#090b0e] border border-[#232830] rounded-sm shadow-inner',
          heightClasses
        )}
      >
        {Array.from({ length: TOTAL_SEGMENTS }).map((_, idx) => {
          const isActive = idx < activeSegments;
          // Segments 0-10: Green, 11-13: Amber, 14-15: Red
          let activeColor = 'bg-[#00ff66] shadow-[0_0_6px_#00ff66]';
          let inactiveColor = 'bg-[#062612]';

          if (idx >= 14) {
            activeColor = 'bg-[#ff2233] shadow-[0_0_6px_#ff2233]';
            inactiveColor = 'bg-[#29080c]';
          } else if (idx >= 11) {
            activeColor = 'bg-[#ffaa00] shadow-[0_0_6px_#ffaa00]';
            inactiveColor = 'bg-[#291b05]';
          }

          return (
            <div
              key={idx}
              className={cn(
                'flex-1 rounded-[1px] transition-colors duration-75',
                isActive ? activeColor : inactiveColor
              )}
            />
          );
        })}
      </div>
      <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
        {`${Math.round(value)}%`}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. MINIMALIST STRIP (Swiss Monochrome Style)
// ---------------------------------------------------------------------------
function StripDisplay({
  value,
  size,
  channelLabel,
}: {
  value: number;
  size: 'sm' | 'md' | 'lg';
  channelLabel?: string;
}) {
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  return (
    <div className="flex items-center gap-2 w-full">
      {channelLabel && (
        <span className="text-[9px] font-mono text-muted-foreground w-4 shrink-0">
          {channelLabel}
        </span>
      )}
      <div
        className={cn(
          'flex-1 bg-muted/60 border border-border rounded-none relative overflow-hidden',
          heightClasses
        )}
      >
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] font-mono font-medium text-foreground w-8 text-right">
        {Math.round(value)}
      </span>
    </div>
  );
}
