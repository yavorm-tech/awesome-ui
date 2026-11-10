import {
  type BuiltInThemeName,
  builtInThemes,
  type ThemeMode,
  ThemeProvider,
} from '@awesome-ui/core';
import type { Decorator } from '@storybook/react-vite';

export const THEME_NAMES = Object.keys(builtInThemes) as BuiltInThemeName[];
export const MODES: ThemeMode[] = ['light', 'dark', 'system'];

/**
 * Wraps every story in the real ThemeProvider, driven by the Theme / Mode toolbar.
 *
 * Story parameters:
 * - `padded: true` adds padding around the story (component stories).
 * - `themeMatrix: true` renders the story in every built-in theme, light and dark, side by side
 *   (each component's "Themes" story). The toolbar is ignored for these.
 */
export const withTheme: Decorator = (Story, context) => {
  const name = (context.globals.theme as BuiltInThemeName | undefined) ?? 'flowbite';
  const mode = (context.globals.mode as ThemeMode | undefined) ?? 'light';
  const padded = context.parameters.padded === true;

  if (context.parameters.themeMatrix === true) {
    return (
      <div className="grid min-h-screen bg-border lg:grid-cols-2" style={{ gap: 1 }}>
        {THEME_NAMES.flatMap((themeName) =>
          (['light', 'dark'] as const).map((themeMode) => (
            <ThemeProvider
              key={`${themeName}-${themeMode}`}
              theme={builtInThemes[themeName]}
              mode={themeMode}
              className="p-6"
            >
              <p
                className="mb-4 font-mono text-xs text-fg-muted"
                data-testid={`matrix-${themeName}-${themeMode}`}
              >
                {themeName} · {themeMode}
              </p>
              <Story />
            </ThemeProvider>
          )),
        )}
      </div>
    );
  }

  return (
    <ThemeProvider
      theme={builtInThemes[name]}
      mode={mode}
      className={padded ? 'min-h-screen p-6' : 'min-h-screen'}
    >
      <Story />
    </ThemeProvider>
  );
};
