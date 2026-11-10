import type { ThemeTokens, TokenTheme } from '@awesome-ui/tokens';

import type { ThemeComponents } from '../overrides/types';
import type { DeepPartial } from '../utils/deepMerge';

/** A complete theme: design tokens plus theme-level component overrides. */
export interface Theme extends TokenTheme {
  components: ThemeComponents;
}

/** What `createTheme` accepts on top of a base theme. */
export interface ThemeOverrides {
  /** Unique name (lowercase letters, digits, dashes). Used as `data-aui-theme`. */
  name: string;
  tokens?: DeepPartial<ThemeTokens>;
  components?: ThemeComponents;
}

/** Requested color mode. `system` follows `prefers-color-scheme`. */
export type ThemeMode = 'light' | 'dark' | 'system';

/** Mode actually in effect. */
export type ResolvedMode = 'light' | 'dark';
