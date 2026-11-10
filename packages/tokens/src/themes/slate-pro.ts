import { amber, cyan, emerald, indigo, red, sky, slate } from '../palettes';
import type { TokenTheme } from '../types';
import { roles, WHITE } from './helpers';

/** A hairline instead of a drop shadow: slate-pro separates layers with 1px borders. */
const hairline = (color: string) => `0 0 0 1px ${color}`;

/**
 * `slate-pro`: dense and sharp, for dashboards and admin tools. Indigo primary, slate
 * neutrals, 2–4px radii, 1px borders instead of shadows, compact controls, IBM Plex Sans
 * and a 13px base font.
 */
export const slateProTokens: TokenTheme = {
  name: 'slate-pro',
  tokens: {
    shared: {
      palettes: {
        primary: indigo,
        secondary: cyan,
        neutral: slate,
        success: emerald,
        warning: amber,
        danger: red,
        info: sky,
      },
      radii: { none: '0px', sm: '2px', control: '3px', card: '4px', pill: '9999px' },
      fonts: {
        sans: '"IBM Plex Sans Variable", "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
        mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      },
      text: {
        xs: { size: '0.6875rem', lineHeight: '1rem' },
        sm: { size: '0.75rem', lineHeight: '1.125rem' },
        base: { size: '0.8125rem', lineHeight: '1.25rem' },
        lg: { size: '0.9375rem', lineHeight: '1.375rem' },
        xl: { size: '1.0625rem', lineHeight: '1.5rem' },
        '2xl': { size: '1.25rem', lineHeight: '1.75rem' },
        '3xl': { size: '1.5rem', lineHeight: '2rem' },
      },
      fontWeights: { normal: '400', medium: '500', semibold: '600', bold: '700' },
      spacing: '0.25rem',
      density: {
        controlHeight: { sm: '1.75rem', md: '2rem', lg: '2.5rem' },
        controlPaddingX: { sm: '0.5rem', md: '0.75rem', lg: '1rem' },
        cardPadding: '1rem',
      },
      motion: {
        durations: { fast: '75ms', normal: '120ms', slow: '200ms' },
        easings: {
          standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
          emphasized: 'cubic-bezier(0.3, 0, 0, 1)',
        },
      },
      zIndex: { dropdown: 10, sticky: 20, modal: 40, popover: 50, snackbar: 60, tooltip: 70 },
    },
    light: {
      colors: {
        surface: WHITE,
        surfaceRaised: WHITE,
        surfaceSunken: slate[50],
        border: slate[200],
        borderStrong: slate[300],
        text: slate[900],
        textMuted: slate[500],
        textDisabled: slate[400],
        focusRing: indigo[500],
        backdrop: 'rgb(15 23 42 / 0.6)',
      },
      intents: {
        primary: roles(indigo, {
          solid: 600,
          solidHover: 700,
          onSolid: WHITE,
          soft: 50,
          onSoft: 700,
          outline: 600,
        }),
        secondary: roles(cyan, {
          solid: 700,
          solidHover: 800,
          onSolid: WHITE,
          soft: 50,
          onSoft: 800,
          outline: 700,
        }),
        neutral: roles(slate, {
          solid: 700,
          solidHover: 800,
          onSolid: WHITE,
          soft: 100,
          onSoft: 700,
          outline: 300,
        }),
        success: roles(emerald, {
          solid: 700,
          solidHover: 800,
          onSolid: WHITE,
          soft: 50,
          onSoft: 800,
          outline: 700,
        }),
        warning: roles(amber, {
          solid: 400,
          solidHover: 500,
          onSolid: slate[950],
          soft: 50,
          onSoft: 800,
          outline: 600,
        }),
        danger: roles(red, {
          solid: 600,
          solidHover: 700,
          onSolid: WHITE,
          soft: 50,
          onSoft: 700,
          outline: 600,
        }),
        info: roles(sky, {
          solid: 700,
          solidHover: 800,
          onSolid: WHITE,
          soft: 50,
          onSoft: 800,
          outline: 700,
        }),
      },
      shadows: {
        sm: hairline(slate[200]),
        md: hairline(slate[200]),
        lg: hairline(slate[300]),
        overlay: `${hairline(slate[300])}, 0 4px 8px -2px rgb(15 23 42 / 0.08)`,
      },
    },
    dark: {
      colors: {
        surface: slate[950],
        surfaceRaised: slate[900],
        surfaceSunken: slate[800],
        border: slate[800],
        borderStrong: slate[700],
        text: slate[100],
        textMuted: slate[400],
        textDisabled: slate[600],
        focusRing: indigo[400],
        backdrop: 'rgb(2 6 23 / 0.7)',
      },
      intents: {
        primary: roles(indigo, {
          solid: 600,
          solidHover: 700,
          onSolid: WHITE,
          soft: slate[900],
          onSoft: 300,
          outline: 500,
        }),
        secondary: roles(cyan, {
          solid: 400,
          solidHover: 300,
          onSolid: slate[950],
          soft: slate[900],
          onSoft: 300,
          outline: 500,
        }),
        neutral: roles(slate, {
          solid: 700,
          solidHover: 600,
          onSolid: WHITE,
          soft: slate[800],
          onSoft: 200,
          outline: 600,
        }),
        success: roles(emerald, {
          solid: 400,
          solidHover: 300,
          onSolid: slate[950],
          soft: slate[900],
          onSoft: 300,
          outline: 500,
        }),
        warning: roles(amber, {
          solid: 400,
          solidHover: 300,
          onSolid: slate[950],
          soft: slate[900],
          onSoft: 300,
          outline: 500,
        }),
        danger: roles(red, {
          solid: 600,
          solidHover: 700,
          onSolid: WHITE,
          soft: slate[900],
          onSoft: 300,
          outline: 500,
        }),
        info: roles(sky, {
          solid: 400,
          solidHover: 300,
          onSolid: slate[950],
          soft: slate[900],
          onSoft: 300,
          outline: 500,
        }),
      },
      shadows: {
        sm: hairline(slate[800]),
        md: hairline(slate[800]),
        lg: hairline(slate[700]),
        overlay: `${hairline(slate[700])}, 0 4px 12px -2px rgb(0 0 0 / 0.5)`,
      },
    },
  },
};
