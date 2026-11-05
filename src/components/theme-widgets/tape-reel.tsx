'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TapeReelProps {
  /** Whether the reels are currently spinning */
  spinning?: boolean;
  /** Playback or rotation speed */
  speed?: 'standard' | 'fast';
  /** Tape reel diameter size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
}

export function TapeReel({
  spinning = false,
  speed = 'standard',
  size = 'md',
  className,
}: TapeReelProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
  }[size];

  return (
    <div
      role="img"
      aria-label={spinning ? 'Spinning tape reels' : 'Paused tape reels'}
      className={cn('inline-flex items-center gap-4 select-none', className)}
    >
      {/* Supply Reel (Left) */}
      <ReelHub spinning={spinning} speed={speed} sizeClass={sizeClasses} isLeft />

      {/* Center Tape Guide / Tension Roller */}
      <div className="flex flex-col items-center gap-1 opacity-70">
        <div className="w-2.5 h-2.5 rounded-full bg-[#3a424e] border border-black shadow-inner" />
        <div className="w-8 h-[2px] bg-[#222830] shadow-xs" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#3a424e] border border-black shadow-inner" />
      </div>

      {/* Takeup Reel (Right) */}
      <ReelHub spinning={spinning} speed={speed} sizeClass={sizeClasses} isLeft={false} />
    </div>
  );
}

function ReelHub({
  spinning,
  speed,
  sizeClass,
  isLeft,
}: {
  spinning: boolean;
  speed: 'standard' | 'fast';
  sizeClass: string;
  isLeft: boolean;
}) {
  const duration = speed === 'fast' ? '1s' : '2.8s';

  return (
    <div
      className={cn(
        'relative rounded-full border-2 border-[#2b313a] p-1 shadow-[0_8px_16px_rgba(0,0,0,0.8),inset_0_0_12px_rgba(0,0,0,0.9)]',
        'bg-gradient-to-tr from-[#16191e] via-[#2a3038] to-[#121519]',
        sizeClass
      )}
    >
      {/* Magnetic Tape Ribbon Outer Ring */}
      <div
        className={cn(
          'absolute inset-1.5 rounded-full border border-neutral-700/50 shadow-inner',
          isLeft ? 'bg-[#2b1810]' : 'bg-[#18110c]'
        )}
      />

      {/* Anodized Aluminum 3-Flange Reel Spool */}
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center transition-transform"
        style={{
          animation: spinning ? `spin ${duration} linear infinite` : 'none',
        }}
      >
        {/* Three Cutout Flanges (120deg apart) */}
        <div className="absolute w-full h-1 bg-[#121518] rounded-full transform rotate-0" />
        <div className="absolute w-full h-1 bg-[#121518] rounded-full transform rotate-60" />
        <div className="absolute w-full h-1 bg-[#121518] rounded-full transform -rotate-60" />

        {/* Brushed Center Hub */}
        <div className="w-[36%] h-[36%] rounded-full bg-gradient-to-b from-[#8a94a0] via-[#505862] to-[#343a42] border border-[#a8b2be] shadow-md flex items-center justify-center z-10">
          {/* Spindle Spline Teeth */}
          <div className="w-[45%] h-[45%] rounded-full bg-[#14171a] border border-[#23272d] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[#404750] rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
