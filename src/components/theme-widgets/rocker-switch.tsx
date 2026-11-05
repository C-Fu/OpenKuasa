'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RockerSwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function RockerSwitch({
  checked = false,
  onCheckedChange,
  label,
  disabled = false,
  className,
  id,
}: RockerSwitchProps) {
  const switchId = id || React.useId();

  const handleToggle = () => {
    if (disabled) return;
    onCheckedChange?.(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onCheckedChange?.(!checked);
    }
  };

  return (
    <div className={cn('inline-flex flex-col items-center gap-2 select-none', className)}>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label || 'Tactile Rocker Switch'}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative w-12 h-20 rounded-md p-1.5 cursor-pointer outline-none transition-shadow',
          'bg-gradient-to-b from-[#15191e] via-[#0d0f12] to-[#1a1f26]',
          'border-2 border-[#2d333b] shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),0_2px_4px_rgba(0,0,0,0.4)]',
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
        )}
      >
        {/* Physical Rocker Paddle Housing */}
        <div className="relative w-full h-full rounded-[3px] overflow-hidden flex flex-col justify-between">
          {/* Top Half of Rocker */}
          <div
            className={cn(
              'h-[48%] w-full rounded-t-[2px] transition-all duration-150 flex items-center justify-center relative',
              checked
                ? 'bg-gradient-to-b from-[#ff6b22] via-[#e64a19] to-[#bf360c] shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.5)] border-t border-orange-400'
                : 'bg-gradient-to-b from-[#2b313a] to-[#1c2128] opacity-60 border-t border-[#3d4550]'
            )}
          >
            {/* Active Indicator Pip / Light Bar */}
            <div
              className={cn(
                'w-4 h-1 rounded-full transition-all duration-150',
                checked
                  ? 'bg-white shadow-[0_0_8px_#ff9e80]'
                  : 'bg-[#12151a] shadow-inner'
              )}
            />
          </div>

          {/* Center Physical Pivot Seam */}
          <div className="h-[4%] w-full bg-[#0a0c0f] shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />

          {/* Bottom Half of Rocker */}
          <div
            className={cn(
              'h-[48%] w-full rounded-b-[2px] transition-all duration-150 flex items-center justify-center relative',
              checked
                ? 'bg-gradient-to-b from-[#1a1e24] to-[#121519] opacity-60 border-b border-[#0a0c0e]'
                : 'bg-gradient-to-b from-[#3a424e] via-[#2d333d] to-[#22272e] shadow-[inset_0_-1px_2px_rgba(255,255,255,0.2),0_-2px_4px_rgba(0,0,0,0.5)] border-b border-[#181c22]'
            )}
          >
            {/* OFF Zero Stamp Symbol */}
            <div
              className={cn(
                'w-2 h-2 rounded-full border transition-colors',
                checked ? 'border-[#363d47]' : 'border-neutral-300 shadow-[0_0_2px_rgba(255,255,255,0.3)]'
              )}
            />
          </div>
        </div>
      </button>

      {label && (
        <label
          htmlFor={switchId}
          className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground cursor-pointer text-center select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
}
