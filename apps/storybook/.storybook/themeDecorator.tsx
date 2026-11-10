import type { Decorator } from '@storybook/react-vite';
import { type ReactNode, useEffect, useState } from 'react';

export const THEMES = ['flowbite', 'slate-pro', 'soft'] as const;
export type ThemeName = (typeof THEMES)[number];

export const MODES = ['light', 'dark', 'system'] as const;
export type Mode = (typeof MODES)[number];

function useResolvedMode(mode: Mode): 'light' | 'dark' {
  const query = '(prefers-color-scheme: dark)';
  const [systemDark, setSystemDark] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => {
      setSystemDark(event.matches);
    };
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, []);

  if (mode === 'system') return systemDark ? 'dark' : 'light';
  return mode;
}

interface ThemeFrameProps {
  theme: ThemeName;
  mode: Mode;
  children: ReactNode;
}

/**
 * Phase 0 placeholder: writes `data-theme` / `data-mode` onto a wrapper.
 * Phase 1 replaces this with the real `<ThemeProvider>`; the toolbar stays the same.
 */
function ThemeFrame({ theme, mode, children }: ThemeFrameProps) {
  const resolvedMode = useResolvedMode(mode);
  return (
    <div
      data-theme={theme}
      data-mode={resolvedMode}
      data-testid="theme-root"
      style={{ padding: '1rem' }}
    >
      {children}
    </div>
  );
}

export const withTheme: Decorator = (Story, context) => (
  <ThemeFrame
    theme={(context.globals.theme as ThemeName | undefined) ?? 'flowbite'}
    mode={(context.globals.mode as Mode | undefined) ?? 'light'}
  >
    <Story />
  </ThemeFrame>
);
