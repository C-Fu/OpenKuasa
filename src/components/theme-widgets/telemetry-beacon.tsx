'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type BeaconStatus = 'healthy' | 'warning' | 'critical' | 'offline';

export interface TelemetryBeaconProps {
  /** Health status of the beacon */
  status?: BeaconStatus;
  /** Label describing the telemetry state */
  label?: string;
  /** Beacon size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to render animated concentric radar sweep/pulse rings */
  showRadar?: boolean;
  /** Custom className */
  className?: string;
}

const STATUS_CONFIG: Record<
  BeaconStatus,
  {
    color: string;
    glow: string;
    radarColor: string;
    bgRing: string;
    labelDefault: string;
  }
> = {
  healthy: {
    color: 'bg-[#00ff66]',
    glow: 'shadow-[0_0_10px_#00ff66]',
    radarColor: 'border-[#00ff66]/40',
    bgRing: 'bg-[#00ff66]/15',
    labelDefault: 'NOMINAL',
  },
  warning: {
    color: 'bg-[#ffaa00]',
    glow: 'shadow-[0_0_10px_#ffaa00]',
    radarColor: 'border-[#ffaa00]/40',
    bgRing: 'bg-[#ffaa00]/15',
    labelDefault: 'WARNING',
  },
  critical: {
    color: 'bg-[#ff2233]',
    glow: 'shadow-[0_0_12px_#ff2233]',
    radarColor: 'border-[#ff2233]/50',
    bgRing: 'bg-[#ff2233]/20',
    labelDefault: 'CRITICAL',
  },
  offline: {
    color: 'bg-neutral-500',
    glow: 'shadow-none',
    radarColor: 'border-neutral-700/30',
    bgRing: 'bg-neutral-800/10',
    labelDefault: 'OFFLINE',
  },
};

export function TelemetryBeacon({
  status = 'healthy',
  label,
  size = 'md',
  showRadar = true,
  className,
}: TelemetryBeaconProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.healthy;
  const isPulsing = status !== 'offline';

  const containerSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }[size];

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }[size];

  return (
    <div
      role="status"
      aria-label={`Telemetry status: ${label || config.labelDefault} (${status})`}
      className={cn('inline-flex items-center gap-2 select-none', className)}
    >
      <div className={cn('relative flex items-center justify-center', containerSizes)}>
        {/* Outer Pulsing Radar Waves */}
        {showRadar && isPulsing && (
          <>
            <span
              className={cn(
                'absolute inset-0 rounded-full border animate-ping duration-1000',
                config.radarColor,
                config.bgRing
              )}
            />
            <span
              className={cn(
                'absolute -inset-1 rounded-full border border-dashed opacity-40',
                config.radarColor
              )}
            />
          </>
        )}

        {/* Outer Protective Bezel */}
        <div className="relative rounded-full p-[2px] bg-gradient-to-b from-[#2a3038] to-[#121519] border border-[#3b434e] shadow-md flex items-center justify-center">
          {/* Diode Dome */}
          <div
            className={cn(
              'rounded-full transition-all duration-200 border border-white/20',
              dotSizes,
              config.color,
              config.glow
            )}
          />
        </div>
      </div>

      {label !== undefined && (
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
          {label || config.labelDefault}
        </span>
      )}
    </div>
  );
}
