import { createContext } from 'react';

import type { ResolvedMode, Theme, ThemeMode } from './types';

/** Attributes that make an element pick up the active theme (used by portals). */
export interface ThemeScope {
  'data-aui-theme': string;
  'data-mode': ThemeMode;
}

export interface ThemeContextValue {
  theme: Theme;
  /** Requested mode. */
  mode: ThemeMode;
  /** Mode in effect (`system` resolved via `prefers-color-scheme`). */
  resolvedMode: ResolvedMode;
  setMode: (mode: ThemeMode) => void;
  /** Spread onto portaled content so it renders in this theme and mode. */
  scope: ThemeScope;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
ThemeContext.displayName = 'AwesomeUIThemeContext';
