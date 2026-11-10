/** Steps of every color palette, 50 (lightest) to 950 (darkest). */
export const PALETTE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type PaletteStep = (typeof PALETTE_STEPS)[number];
export type Palette = Readonly<Record<PaletteStep, string>>;

/** Color intents. Each has a full palette and a set of per-mode roles. */
export const INTENTS = [
  'primary',
  'secondary',
  'neutral',
  'success',
  'warning',
  'danger',
  'info',
] as const;
export type Intent = (typeof INTENTS)[number];

/** Per-mode roles for an intent. Components use these instead of raw palette steps. */
export interface IntentRoles {
  /** Background of solid controls (e.g. a solid Button). */
  solid: string;
  /** Hover / pressed background of solid controls. */
  solidHover: string;
  /** Text and icons on top of `solid`. */
  onSolid: string;
  /** Subtle tinted background (alerts, chips, selected rows). */
  soft: string;
  /** Text and icons on top of `soft`; also outline/ghost text. */
  onSoft: string;
  /** Border color of outline controls. */
  outline: string;
}

export const SEMANTIC_COLORS = [
  'surface',
  'surfaceRaised',
  'surfaceSunken',
  'border',
  'borderStrong',
  'fg',
  'fgMuted',
  'fgDisabled',
  'focusRing',
  'backdrop',
] as const;
export type SemanticColor = (typeof SEMANTIC_COLORS)[number];

export const SHADOWS = ['sm', 'md', 'lg', 'overlay'] as const;
export type Shadow = (typeof SHADOWS)[number];

export const RADII = ['none', 'sm', 'control', 'card', 'pill'] as const;
export type Radius = (typeof RADII)[number];

export const TEXT_SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const;
export type TextSize = (typeof TEXT_SIZES)[number];

export const FONT_WEIGHTS = ['normal', 'medium', 'semibold', 'bold'] as const;
export type FontWeight = (typeof FONT_WEIGHTS)[number];

export const CONTROL_SIZES = ['sm', 'md', 'lg'] as const;
export type ControlSize = (typeof CONTROL_SIZES)[number];

export const DURATIONS = ['fast', 'normal', 'slow'] as const;
export type Duration = (typeof DURATIONS)[number];

export const EASINGS = ['standard', 'emphasized'] as const;
export type Easing = (typeof EASINGS)[number];

export const Z_LAYERS = ['dropdown', 'sticky', 'modal', 'popover', 'snackbar', 'tooltip'] as const;
export type ZLayer = (typeof Z_LAYERS)[number];

/** Tokens whose values differ between light and dark mode. */
export interface ModeTokens {
  colors: Readonly<Record<SemanticColor, string>>;
  intents: Readonly<Record<Intent, IntentRoles>>;
  shadows: Readonly<Record<Shadow, string>>;
}

/** Tokens shared by both modes. */
export interface SharedTokens {
  palettes: Readonly<Record<Intent, Palette>>;
  radii: Readonly<Record<Radius, string>>;
  fonts: {
    sans: string;
    mono: string;
  };
  /** Font size and line height per step. */
  text: Readonly<Record<TextSize, { size: string; lineHeight: string }>>;
  fontWeights: Readonly<Record<FontWeight, string>>;
  /** Base of Tailwind's spacing scale (`p-4` = 4 × spacing). */
  spacing: string;
  density: {
    controlHeight: Readonly<Record<ControlSize, string>>;
    controlPaddingX: Readonly<Record<ControlSize, string>>;
    cardPadding: string;
  };
  motion: {
    durations: Readonly<Record<Duration, string>>;
    easings: Readonly<Record<Easing, string>>;
  };
  zIndex: Readonly<Record<ZLayer, number>>;
}

/** A complete set of design tokens: shared values plus light and dark mode values. */
export interface ThemeTokens {
  shared: SharedTokens;
  light: ModeTokens;
  dark: ModeTokens;
}

/** Token-only theme definition. `@awesome-ui/core` adds component overrides on top. */
export interface TokenTheme {
  /** Unique name; used in the `data-aui-theme` attribute. Lowercase letters, digits and dashes. */
  name: string;
  tokens: ThemeTokens;
}

export type ColorMode = 'light' | 'dark';
