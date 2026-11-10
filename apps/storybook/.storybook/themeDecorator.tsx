import {
  type BuiltInThemeName,
  builtInThemes,
  type ThemeMode,
  ThemeProvider,
} from '@awesome-ui/core';
import type { Decorator } from '@storybook/react-vite';

export const THEME_NAMES = Object.keys(builtInThemes) as BuiltInThemeName[];
export const MODES: ThemeMode[] = ['light', 'dark', 'system'];

/** Wraps every story in the real ThemeProvider, driven by the Theme / Mode toolbar. */
export const withTheme: Decorator = (Story, context) => {
  const name = (context.globals.theme as BuiltInThemeName | undefined) ?? 'flowbite';
  const mode = (context.globals.mode as ThemeMode | undefined) ?? 'light';
  const fullscreen = context.parameters.layout === 'fullscreen';

  return (
    <ThemeProvider
      theme={builtInThemes[name]}
      mode={mode}
      className={fullscreen ? 'min-h-screen' : 'min-h-screen p-4'}
    >
      <Story />
    </ThemeProvider>
  );
};
