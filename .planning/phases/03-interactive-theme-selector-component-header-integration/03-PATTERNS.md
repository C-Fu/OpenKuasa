# Phase 03: Interactive Theme Selector Component & Header Integration - Pattern Map

**Mapped:** 2026-11-05
**Files analyzed:** 10 (6 new, 4 modified)
**Analogs found:** 10 / 10

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/components/ui/popover.tsx` | component (UI primitive) | request-response | `src/components/ui/tooltip.tsx` & `src/components/ui/dropdown-menu.tsx` | exact |
| `src/components/theme/theme-selector.tsx` | component (interactive popover) | request-response / event-driven | `src/components/theme/theme-toggle.tsx` | exact |
| `src/components/theme/theme-mockup-card.tsx` | component (visual preview card) | transform / request-response | `src/components/ui/card.tsx` & `src/components/ui/tabs.tsx` | role-match |
| `src/app/account/appearance/page.tsx` | route (SSR page) | request-response | `src/app/account/security/page.tsx` | exact |
| `src/app/account/appearance/appearance-client.tsx` | component (client gallery & settings) | request-response / event-driven | `src/components/theme/theme-toggle.tsx` & `src/components/account/settings-form.tsx` | role-match |
| `src/components/app/app-topbar.tsx` | component (app header) | request-response / presentation | `src/components/app/app-topbar.tsx` (in-place modification) | exact |
| `src/components/marketing/marketing-header.tsx` | component (marketing header) | request-response / presentation | `src/components/marketing/marketing-header.tsx` (in-place modification) | exact |
| `src/components/account/account-shell.tsx` | component (account shell header) | request-response / presentation | `src/components/account/account-shell.tsx` (in-place modification) | exact |
| `src/config/account-nav.ts` | config | transform / request-response | `src/config/account-nav.ts` (in-place registration) | exact |
| `tests/theme-selector.test.ts` | test | batch / request-response | `tests/account-nav.test.ts` & `tests/theme.test.ts` | exact |

---

## Pattern Assignments

### 1. `src/components/ui/popover.tsx` (component, UI primitive)

**Analog:** `src/components/ui/dropdown-menu.tsx` & `src/components/ui/tooltip.tsx`

**Imports Pattern** (`src/components/ui/dropdown-menu.tsx` lines 1-6):
```typescript
"use client"

import * as React from "react"
import { cn } from "cn"
import { Popover as PopoverPrimitive } from "radix-ui"
```

**Core Radix Primitive Pattern** (`src/components/ui/dropdown-menu.tsx` lines 8-49):
```typescript
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      {...props}
    />
  )
}

function PopoverPortal({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Portal>) {
  return (
    <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />
  )
}

function PopoverContent({
  className,
  align = "end",
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "z-50 w-88 rounded-xl border bg-popover p-3 text-popover-foreground shadow-xl outline-none ring-1 ring-foreground/10 duration-150 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverTrigger, PopoverContent, PopoverPortal }
```

---

### 2. `src/components/theme/theme-selector.tsx` (component, interactive popover)

**Analog:** `src/components/theme/theme-toggle.tsx`

**Imports Pattern** (`src/components/theme/theme-toggle.tsx` lines 1-15):
```typescript
'use client';

import { useState } from 'react';
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { THEME_PRESETS, type ThemePreset, type ThemeMode } from '@/lib/theme';
import { sliceTheme, preloadKeris } from '@/components/theme/keris-slice';
import { cn } from '@/lib/utils';
```

**Core Slice & State Transition Pattern** (`src/components/theme/theme-toggle.tsx` lines 27-31):
```typescript
const handleSelectPreset = (nextPreset: ThemePreset) => {
  if (nextPreset === preset) return;
  const meta = THEME_PRESETS[nextPreset];
  
  void sliceTheme(() => {
    setPreset(nextPreset);
    if (meta.lockedMode && mode !== meta.lockedMode) {
      setMode(meta.lockedMode);
    }
  });
};

const handleSelectMode = (nextMode: ThemeMode) => {
  if (nextMode === mode) return;
  void sliceTheme(() => {
    setMode(nextMode);
  });
};
```

**Trigger & Responsive Target Pattern** (`src/components/theme/theme-toggle.tsx` lines 33-45):
```typescript
<TooltipProvider delayDuration={300}>
  <Tooltip>
    <PopoverTrigger asChild>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Customize theme & appearance"
          className={cn('relative max-md:size-11', className)}
        >
          <Palette className="size-5" />
          <span className="sr-only">Customize theme & appearance</span>
          {/* Active Accent Dot */}
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary" />
        </Button>
      </TooltipTrigger>
    </PopoverTrigger>
    <TooltipContent side="bottom">
      Customize theme & appearance ({meta.name})
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

### 3. `src/components/theme/theme-mockup-card.tsx` (component, visual preview card)

**Analog:** `src/components/ui/card.tsx` & `src/components/ui/tabs.tsx`

**Imports Pattern**:
```typescript
'use client';

import * as React from 'react';
import { Check, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { ThemePreset } from '@/lib/theme';
```

**Core Mini/Large Variant Component Pattern**:
```typescript
interface ThemeMockupCardProps {
  presetId: ThemePreset;
  name: string;
  description: string;
  archetypeBadge: string;
  palette: {
    brand: string;
    surface: string;
    border: string;
    accent: string;
  };
  isActive: boolean;
  lockedMode?: 'dark';
  variant?: 'mini' | 'large';
  onSelect: () => void;
}

export function ThemeMockupCard({
  presetId,
  name,
  description,
  archetypeBadge,
  palette,
  isActive,
  lockedMode,
  variant = 'mini',
  onSelect,
}: ThemeMockupCardProps) {
  if (variant === 'mini') {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "group relative flex flex-col rounded-lg border p-1.5 text-left transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive ? "border-primary ring-2 ring-primary bg-accent/30" : "border-border bg-card"
        )}
      >
        {/* Mockup Canvas */}
        <div
          className="relative h-14 w-full overflow-hidden rounded border"
          style={{ backgroundColor: palette.surface, borderColor: palette.border }}
        >
          {/* Header strip */}
          <div className="flex h-3 w-full items-center px-1 border-b" style={{ borderColor: palette.border }}>
            <div className="size-1.5 rounded-full" style={{ backgroundColor: palette.brand }} />
          </div>
          {/* Sidebar & content */}
          <div className="flex h-full">
            <div className="w-3 border-r h-full" style={{ borderColor: palette.border, backgroundColor: palette.surface }} />
            <div className="p-1 flex flex-col gap-0.5">
              <div className="h-1 w-6 rounded-full" style={{ backgroundColor: palette.brand }} />
              <div className="h-1 w-4 rounded-full opacity-40" style={{ backgroundColor: palette.accent }} />
            </div>
          </div>
          {isActive && (
            <div className="absolute top-1 right-1 rounded-full bg-primary p-0.5 text-primary-foreground shadow">
              <Check className="size-2.5" />
            </div>
          )}
        </div>
        {/* Title */}
        <div className="mt-1 flex items-center justify-between text-xs font-medium">
          <span className="truncate">{name}</span>
          {lockedMode === 'dark' && <Moon className="size-2.5 text-muted-foreground shrink-0 ml-1" />}
        </div>
      </button>
    );
  }

  // Large Gallery Variant for /account/appearance
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-card p-5 text-card-foreground shadow-sm transition-all",
        isActive ? "ring-2 ring-primary border-primary" : "hover:border-foreground/20"
      )}
    >
      {/* Authentic Large Canvas */}
      <div
        className="relative h-36 w-full overflow-hidden rounded-lg border p-3 flex flex-col justify-between"
        style={{ backgroundColor: palette.surface, borderColor: palette.border }}
      >
        <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: palette.border }}>
          <span className="text-xs font-semibold" style={{ color: palette.brand }}>OpenKuasa</span>
          <div className="size-2 rounded-full" style={{ backgroundColor: palette.accent }} />
        </div>
        <div className="flex gap-2 items-center">
          <div className="h-3 w-16 rounded" style={{ backgroundColor: palette.brand }} />
          <div className="h-3 w-10 rounded opacity-60" style={{ backgroundColor: palette.accent }} />
        </div>
      </div>
      {/* Metadata, Swatches, and Apply Button */}
    </div>
  );
}
```

---

### 4. `src/app/account/appearance/page.tsx` (route, SSR page)

**Analog:** `src/app/account/security/page.tsx`

**Metadata and Page Shell Structure** (`src/app/account/security/page.tsx` lines 43-51):
```typescript
import { Metadata } from 'next';
import { AppearanceClient } from './appearance-client';

export const metadata: Metadata = {
  title: 'Appearance & Themes · OpenKuasa',
  description: 'Customize your workspace aesthetics, color palettes, and display modes.',
};

export default function AppearancePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Appearance & Themes</h1>
        <p className="text-sm text-muted-foreground">
          Choose a curated design system and display mode for your workspace.
        </p>
      </div>

      <AppearanceClient />
    </div>
  );
}
```

---

### 5. `src/app/account/appearance/appearance-client.tsx` (component, client gallery)

**Analog:** `src/components/theme/theme-toggle.tsx` & `src/components/account/security-forms.tsx`

**Mode Card and Gallery Pattern**:
```typescript
'use client';

import { useTheme } from '@/lib/use-theme';
import { THEME_PRESETS, type ThemePreset, type ThemeMode } from '@/lib/theme';
import { sliceTheme } from '@/components/theme/keris-slice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeMockupCard } from '@/components/theme/theme-mockup-card';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppearanceClient() {
  const { preset, mode, setPreset, setMode } = useTheme();

  const handleApplyPreset = (targetPreset: ThemePreset) => {
    if (targetPreset === preset) return;
    const meta = THEME_PRESETS[targetPreset];
    void sliceTheme(() => {
      setPreset(targetPreset);
      if (meta.lockedMode && mode !== meta.lockedMode) {
        setMode(meta.lockedMode);
      }
    });
  };

  const handleApplyMode = (targetMode: ThemeMode) => {
    if (targetMode === mode) return;
    void sliceTheme(() => {
      setMode(targetMode);
    });
  };

  return (
    <div className="space-y-8">
      {/* Mode Card */}
      <Card>
        <CardHeader>
          <CardTitle>Interface Mode</CardTitle>
          <CardDescription>Select your preferred light or dark mode behavior.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Segmented Mode Selector */}
        </CardContent>
      </Card>

      {/* 12 Design Systems Gallery */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Curated Themes</h2>
          <p className="text-sm text-muted-foreground">
            12 bespoke design engines tailored for enterprise, engineering, and retro ergonomics.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ThemeMockupCards with variant="large" */}
        </div>
      </div>
    </div>
  );
}
```

---

### 6. Header Integrations (`AppTopbar`, `MarketingHeader`, `AccountShell`)

**Analogs:**
- `src/components/app/app-topbar.tsx` lines 9 & 83
- `src/components/marketing/marketing-header.tsx` lines 14 & 66
- `src/components/account/account-shell.tsx` lines 11 & 62

**Header Swap Pattern:**
```typescript
// Replace import
- import { ThemeToggle } from '@/components/theme/theme-toggle';
+ import { ThemeSelector } from '@/components/theme/theme-selector';

// In JSX:
- <ThemeToggle className="..." />
+ <ThemeSelector className="..." />
```

---

### 7. `src/config/account-nav.ts` (config registration)

**Analog:** `src/config/account-nav.ts` lines 36-44

**Navigation Section Registration Pattern:**
```typescript
import { Palette, ... } from 'lucide-react';

export const ACCOUNT_SECTIONS: AccountNavSection[] = [
  {
    label: 'Account',
    items: [
      { label: 'My profile', href: '/account/profile', icon: UserRound },
      { label: 'Appearance', href: '/account/appearance', icon: Palette },
      { label: 'Security', href: '/account/security', icon: Lock },
      { label: 'Notifications', href: '/account/notifications', icon: Bell },
    ],
  },
  // ...
];
```

---

### 8. `tests/theme-selector.test.ts` (test)

**Analog:** `tests/account-nav.test.ts` & `tests/theme.test.ts`

**Vitest Suite Setup & Assertions Pattern** (`tests/theme.test.ts` lines 1-43):
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { THEME_PRESETS, isValidPreset } from '@/lib/theme';
import { ACCOUNT_SECTIONS } from '@/config/account-nav';

describe('Theme Selector Integration', () => {
  it('registers all 12 presets in the system', () => {
    expect(Object.keys(THEME_PRESETS)).toHaveLength(12);
  });

  it('Appearance route is present in account nav under Account section', () => {
    const accountSection = ACCOUNT_SECTIONS.find((s) => s.label === 'Account');
    expect(accountSection?.items.map((i) => i.href)).toContain('/account/appearance');
  });
});
```

---

## Shared Patterns

### 1. View Transition Theme Switching (`sliceTheme`)
**Source:** `src/components/theme/keris-slice.ts` lines 59-71
**Apply to:** `ThemeSelector`, `AppearanceClient`, mode toggles
```typescript
import { sliceTheme } from '@/components/theme/keris-slice';

void sliceTheme(() => {
  // Synchronous DOM and state mutation
  setPreset(nextPreset);
  if (isLockedDark) {
    setMode('dark');
  }
});
```

### 2. Reactive Theme State Subscription (`useTheme`)
**Source:** `src/lib/use-theme.ts` lines 19-48
**Apply to:** All client components interacting with themes
```typescript
import { useTheme } from '@/lib/use-theme';

const { preset, mode, isDark, meta, setPreset, setMode } = useTheme();
```

### 3. Touch Target Compliance on Mobile
**Source:** `src/components/theme/theme-toggle.tsx` lines 40-41
**Apply to:** Header triggers across `AppTopbar`, `MarketingHeader`, and `AccountShell`
```typescript
// 44px on touch-sized screens (< 768px)
className={cn('relative max-md:size-11', className)}
```

---

## No Analog Found

None. All 10 files have direct or high-fidelity structural analogs within the project.

---

## Metadata

**Analog search scope:** `src/components/ui/`, `src/components/theme/`, `src/components/app/`, `src/components/account/`, `src/app/account/`, `src/config/`, `tests/`
**Files scanned:** 35
**Pattern extraction date:** 2026-11-05
