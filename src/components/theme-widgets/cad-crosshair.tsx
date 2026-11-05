'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CadCrosshairProps {
  /** Optional X-axis coordinate readout */
  xCoord?: number | string;
  /** Optional Y-axis coordinate readout */
  yCoord?: number | string;
  /** Reference or drawing sheet tag */
  drawingNo?: string;
  /** Corner registration crosshairs position */
  corners?: boolean;
  /** Custom inner children content */
  children?: React.ReactNode;
  /** Custom className */
  className?: string;
}

export function CadCrosshair({
  xCoord = '101.42',
  yCoord = '03.15',
  drawingNo,
  corners = true,
  children,
  className,
}: CadCrosshairProps) {
  return (
    <div
      className={cn(
        'relative border border-[var(--border)] bg-card/60 p-4 font-mono select-none overflow-hidden',
        className
      )}
    >
      {/* 4 Corner Registration Crosshairs [+] */}
      {corners && (
        <>
          {/* Top Left */}
          <div className="absolute top-1 left-1 w-3 h-3 pointer-events-none opacity-80 text-primary flex items-center justify-center font-mono text-[10px] leading-none">
            +
          </div>
          {/* Top Right */}
          <div className="absolute top-1 right-1 w-3 h-3 pointer-events-none opacity-80 text-primary flex items-center justify-center font-mono text-[10px] leading-none">
            +
          </div>
          {/* Bottom Left */}
          <div className="absolute bottom-1 left-1 w-3 h-3 pointer-events-none opacity-80 text-primary flex items-center justify-center font-mono text-[10px] leading-none">
            +
          </div>
          {/* Bottom Right */}
          <div className="absolute bottom-1 right-1 w-3 h-3 pointer-events-none opacity-80 text-primary flex items-center justify-center font-mono text-[10px] leading-none">
            +
          </div>
        </>
      )}

      {/* Top Coordinate Header Readout */}
      <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-1 mb-2">
        <div className="flex items-center gap-2">
          {drawingNo && <span className="font-semibold text-primary">{drawingNo}</span>}
          <span>ALIGN // SPEC</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-foreground font-semibold">
          <span>{`X: ${xCoord}`}</span>
          <span>{`Y: ${yCoord}`}</span>
        </div>
      </div>

      {/* Main Content Area */}
      {children}
    </div>
  );
}
