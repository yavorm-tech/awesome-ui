import { ROOT_CSS, themeToCss } from '@awesome-ui/tokens';
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
  version,
} from 'react';

import { cn } from '../utils/tv';
import { ThemeContext, type ThemeContextValue } from './context';
import { flowbite } from './themes';
import type { Theme, ThemeMode } from './types';
import { usePrefersDark } from './usePrefersDark';

export interface ThemeProviderProps {
  /** Theme to apply. Defaults to the parent provider's theme, or `flowbite` at the top level. */
  theme?: Theme | undefined;
  /** Controlled mode. */
  mode?: ThemeMode | undefined;
  /** Initial mode when uncontrolled. Without it, a nested provider follows its parent's mode. */
  defaultMode?: ThemeMode | undefined;
  /** Called when `setMode` is used. */
  onModeChange?: ((mode: ThemeMode) => void) | undefined;
  /**
   * Inject the theme's CSS variables as a `<style>` tag (default `true`). Turn off only if the
   * app imports `@awesome-ui/tokens/themes.css` and uses built-in themes exclusively.
   */
  injectStyles?: boolean | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  children?: ReactNode;
}

const SUPPORTS_STYLE_HOISTING = Number.parseInt(version, 10) >= 19;

/** Short, stable hash so different themes with the same name get different style tags. */
function hash(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = (h * 33) ^ text.charCodeAt(i);
  return (h >>> 0).toString(36);
}

function ThemeStyle({ id, css }: { id: string; css: string }) {
  // React 19 hoists and de-duplicates <style href precedence>; React 18 renders it inline.
  return SUPPORTS_STYLE_HOISTING ? (
    <style href={id} precedence="aui">
      {css}
    </style>
  ) : (
    <style data-aui-style={id}>{css}</style>
  );
}

/**
 * Applies a theme and color mode to everything inside it by setting CSS variables on a
 * wrapper element. Providers can be nested to theme part of a page differently.
 *
 * Switching theme or mode only changes the wrapper's attributes and the CSS variables; the
 * subtree is not re-rendered (only `useTheme()` consumers are).
 */
export function ThemeProvider({
  theme: themeProp,
  mode: modeProp,
  defaultMode,
  onModeChange,
  injectStyles = true,
  className,
  style,
  children,
}: ThemeProviderProps) {
  const parent = useContext(ThemeContext);
  const theme = themeProp ?? parent?.theme ?? flowbite;

  const followsParent = modeProp === undefined && defaultMode === undefined && parent !== null;
  const [ownMode, setOwnMode] = useState<ThemeMode>(defaultMode ?? 'light');
  const mode: ThemeMode = modeProp ?? (followsParent ? parent.mode : ownMode);

  const parentSetMode = parent?.setMode;
  const setMode = useCallback(
    (next: ThemeMode) => {
      if (modeProp === undefined) {
        if (followsParent && parentSetMode) parentSetMode(next);
        else setOwnMode(next);
      }
      onModeChange?.(next);
    },
    [modeProp, followsParent, parentSetMode, onModeChange],
  );

  const prefersDark = usePrefersDark(mode === 'system');
  const resolvedMode = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;

  const css = useMemo(() => themeToCss(theme), [theme]);
  const styleId = `aui-theme-${theme.name}-${hash(css)}`;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      resolvedMode,
      setMode,
      scope: { 'data-aui-theme': theme.name, 'data-mode': mode },
    }),
    [theme, mode, resolvedMode, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      {injectStyles && <ThemeStyle id="aui-root" css={ROOT_CSS} />}
      {injectStyles && <ThemeStyle id={styleId} css={css} />}
      <div
        data-aui-theme={theme.name}
        data-mode={mode}
        className={cn('aui-root', className)}
        style={style}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
