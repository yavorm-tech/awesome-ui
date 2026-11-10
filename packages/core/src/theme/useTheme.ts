import { useContext } from 'react';

import { ThemeContext, type ThemeContextValue } from './context';

/**
 * Current theme and mode, plus `setMode`. Must be called inside a `ThemeProvider`.
 *
 * ```tsx
 * const { theme, resolvedMode, setMode } = useTheme();
 * ```
 */
export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme() must be used inside <ThemeProvider>.');
  }
  return value;
}

/** Like `useTheme`, but returns `null` outside a provider. Components use this. */
export function useOptionalTheme(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
