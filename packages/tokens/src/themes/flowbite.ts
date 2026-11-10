import {
  flowbiteBlue,
  flowbiteGray,
  flowbiteGreen,
  flowbitePurple,
  flowbiteRed,
  flowbiteYellow,
} from '../palettes';
import type { TokenTheme } from '../types';
import { roles, WHITE } from './helpers';

const gray = flowbiteGray;

/**
 * `flowbite` (default): Flowbite's default look. Blue primary, gray neutrals, Inter,
 * `rounded-lg` controls, Tailwind/Flowbite shadows and spacing.
 *
 * Deviation from Flowbite for WCAG AA: warning solid uses dark text (Flowbite uses white on
 * yellow-400), and dark-mode danger solid uses red-700 instead of red-600.
 */
export const flowbiteTokens: TokenTheme = {
  name: 'flowbite',
  tokens: {
    shared: {
      palettes: {
        primary: flowbiteBlue,
        secondary: flowbitePurple,
        neutral: gray,
        success: flowbiteGreen,
        warning: flowbiteYellow,
        danger: flowbiteRed,
        info: flowbiteBlue,
      },
      radii: { none: '0px', sm: '0.25rem', control: '0.5rem', card: '0.5rem', pill: '9999px' },
      fonts: {
        sans: '"Inter Variable", Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
        mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      },
      text: {
        xs: { size: '0.75rem', lineHeight: '1rem' },
        sm: { size: '0.875rem', lineHeight: '1.25rem' },
        base: { size: '1rem', lineHeight: '1.5rem' },
        lg: { size: '1.125rem', lineHeight: '1.75rem' },
        xl: { size: '1.25rem', lineHeight: '1.75rem' },
        '2xl': { size: '1.5rem', lineHeight: '2rem' },
        '3xl': { size: '1.875rem', lineHeight: '2.25rem' },
      },
      fontWeights: { normal: '400', medium: '500', semibold: '600', bold: '700' },
      spacing: '0.25rem',
      density: {
        controlHeight: { sm: '2.25rem', md: '2.5rem', lg: '3rem' },
        controlPaddingX: { sm: '0.75rem', md: '1.25rem', lg: '1.5rem' },
        cardPadding: '1.5rem',
      },
      motion: {
        durations: { fast: '100ms', normal: '150ms', slow: '300ms' },
        easings: {
          standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
          emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
        },
      },
      zIndex: { dropdown: 10, sticky: 20, modal: 40, popover: 50, snackbar: 60, tooltip: 70 },
    },
    light: {
      colors: {
        surface: WHITE,
        surfaceRaised: WHITE,
        surfaceSunken: gray[50],
        border: gray[200],
        borderStrong: gray[300],
        fg: gray[900],
        fgMuted: gray[500],
        fgDisabled: gray[400],
        focusRing: flowbiteBlue[300],
        backdrop: 'rgb(17 24 39 / 0.5)',
      },
      intents: {
        primary: roles(flowbiteBlue, {
          solid: 700,
          solidHover: 800,
          onSolid: WHITE,
          soft: 50,
          onSoft: 800,
          outline: 700,
        }),
        secondary: roles(flowbitePurple, {
          solid: 700,
          solidHover: 800,
          onSolid: WHITE,
          soft: 50,
          onSoft: 800,
          outline: 700,
        }),
        neutral: roles(gray, {
          solid: 800,
          solidHover: 900,
          onSolid: WHITE,
          soft: 100,
          onSoft: 800,
          outline: 300,
        }),
        success: roles(flowbiteGreen, {
          solid: 700,
          solidHover: 800,
          onSolid: WHITE,
          soft: 50,
          onSoft: 800,
          outline: 700,
        }),
        warning: roles(flowbiteYellow, {
          solid: 400,
          solidHover: 500,
          onSolid: gray[900],
          soft: 50,
          onSoft: 800,
          outline: 500,
        }),
        danger: roles(flowbiteRed, {
          solid: 700,
          solidHover: 800,
          onSolid: WHITE,
          soft: 50,
          onSoft: 800,
          outline: 700,
        }),
        info: roles(flowbiteBlue, {
          solid: 700,
          solidHover: 800,
          onSolid: WHITE,
          soft: 50,
          onSoft: 800,
          outline: 700,
        }),
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        overlay: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
    },
    dark: {
      colors: {
        surface: gray[900],
        surfaceRaised: gray[800],
        surfaceSunken: gray[700],
        border: gray[700],
        borderStrong: gray[600],
        fg: WHITE,
        fgMuted: gray[400],
        fgDisabled: gray[500],
        focusRing: flowbiteBlue[800],
        backdrop: 'rgb(17 24 39 / 0.8)',
      },
      intents: {
        primary: roles(flowbiteBlue, {
          solid: 600,
          solidHover: 700,
          onSolid: WHITE,
          soft: gray[800],
          onSoft: 400,
          outline: 500,
        }),
        secondary: roles(flowbitePurple, {
          solid: 600,
          solidHover: 700,
          onSolid: WHITE,
          soft: gray[800],
          onSoft: 400,
          outline: 500,
        }),
        neutral: roles(gray, {
          solid: 700,
          solidHover: 600,
          onSolid: WHITE,
          soft: gray[800],
          onSoft: 300,
          outline: 600,
        }),
        success: roles(flowbiteGreen, {
          solid: 600,
          solidHover: 700,
          onSolid: WHITE,
          soft: gray[800],
          onSoft: 400,
          outline: 500,
        }),
        warning: roles(flowbiteYellow, {
          solid: 300,
          solidHover: 400,
          onSolid: gray[900],
          soft: gray[800],
          onSoft: 300,
          outline: 300,
        }),
        danger: roles(flowbiteRed, {
          solid: 700,
          solidHover: 800,
          onSolid: WHITE,
          soft: gray[800],
          onSoft: 400,
          outline: 500,
        }),
        info: roles(flowbiteBlue, {
          solid: 600,
          solidHover: 700,
          onSolid: WHITE,
          soft: gray[800],
          onSoft: 400,
          outline: 500,
        }),
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.45), 0 4px 6px -4px rgb(0 0 0 / 0.45)',
        overlay: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
      },
    },
  },
};
