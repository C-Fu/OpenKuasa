'use client';

import { useSyncExternalStore } from 'react';
import {
  DEFAULT_PRESET,
  DEFAULT_MODE,
  THEME_PRESETS,
  resolveThemeMode,
  resolveThemePreset,
  saveThemeState,
  subscribeTheme,
  isDarkSnapshot,
  presetSnapshot,
  type Theme,
  type ThemeMode,
  type ThemePreset,
} from '@/lib/theme';

export function useTheme() {
  const isDark = useSyncExternalStore(subscribeTheme, isDarkSnapshot, () => false);
  const currentPreset = useSyncExternalStore(subscribeTheme, presetSnapshot, () => DEFAULT_PRESET);

  const setPreset = (nextPreset: ThemePreset) => {
    const currentMode = resolveThemeMode();
    saveThemeState(nextPreset, currentMode);
  };

  const setMode = (nextMode: ThemeMode) => {
    const preset = resolveThemePreset();
    saveThemeState(preset, nextMode);
  };

  const toggleMode = () => {
    const nextMode: Theme = isDark ? 'light' : 'dark';
    const preset = resolveThemePreset();
    saveThemeState(preset, nextMode);
  };

  return {
    preset: currentPreset,
    mode: resolveThemeMode(),
    effectiveMode: (isDark ? 'dark' : 'light') as Theme,
    isDark,
    meta: THEME_PRESETS[currentPreset] || THEME_PRESETS[DEFAULT_PRESET],
    setPreset,
    setMode,
    toggleMode,
  };
}
