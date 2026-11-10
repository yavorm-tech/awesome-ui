import { flowbiteTokens, slateProTokens, softTokens } from '@awesome-ui/tokens';

import type { Theme } from './types';

/** Default theme: Flowbite's look. */
export const flowbite: Theme = { ...flowbiteTokens, components: {} };

/** Dense, sharp theme for dashboards and admin tools. */
export const slatePro: Theme = { ...slateProTokens, components: {} };

/** Friendly, spacious theme with a warm palette. */
export const soft: Theme = {
  ...softTokens,
  components: {
    Button: { slots: { root: 'rounded-pill' } },
  },
};

/** The built-in themes, keyed by name. */
export const builtInThemes = {
  flowbite,
  'slate-pro': slatePro,
  soft,
} as const satisfies Record<string, Theme>;

export type BuiltInThemeName = keyof typeof builtInThemes;
