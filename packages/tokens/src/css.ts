import {
  CONTROL_SIZES,
  DURATIONS,
  EASINGS,
  FONT_WEIGHTS,
  type IntentRoles,
  INTENTS,
  type ModeTokens,
  PALETTE_STEPS,
  RADII,
  SEMANTIC_COLORS,
  SHADOWS,
  type SharedTokens,
  TEXT_SIZES,
  type TokenTheme,
  Z_LAYERS,
} from './types';

/** CSS variable declarations, e.g. `{ '--color-primary-600': '#1C64F2' }`. */
export type CssVariables = Record<`--${string}`, string>;

const kebab = (value: string) => value.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const ROLE_KEYS = [
  'solid',
  'solidHover',
  'onSolid',
  'soft',
  'onSoft',
  'outline',
] as const satisfies readonly (keyof IntentRoles)[];

/**
 * CSS variable names, so code never spells them by hand. They match Tailwind v4's theme
 * namespaces, which is what makes `bg-primary-600`, `rounded-control`, `shadow-overlay`,
 * `h-control-md` etc. resolve to the active theme.
 */
export const cssVar = {
  palette: (intent: string, step: number) => `--color-${intent}-${step}` as const,
  color: (name: string) => `--color-${kebab(name)}` as const,
  role: (intent: string, role: keyof IntentRoles) => `--color-${intent}-${kebab(role)}` as const,
  radius: (name: string) => `--radius-${name}` as const,
  shadow: (name: string) => `--shadow-${name}` as const,
  font: (name: string) => `--font-${name}` as const,
  text: (size: string) => `--text-${size}` as const,
  lineHeight: (size: string) => `--text-${size}--line-height` as const,
  fontWeight: (name: string) => `--font-weight-${name}` as const,
  spacing: '--spacing' as const,
  controlHeight: (size: string) => `--spacing-control-${size}` as const,
  controlPaddingX: (size: string) => `--spacing-control-px-${size}` as const,
  cardPadding: '--spacing-card-p' as const,
  duration: (name: string) => `--duration-${name}` as const,
  ease: (name: string) => `--ease-${name}` as const,
  zIndex: (layer: string) => `--z-${layer}` as const,
};

/** Variables that are the same in light and dark mode. */
export function sharedVariables(shared: SharedTokens): CssVariables {
  const vars: CssVariables = {};
  for (const intent of INTENTS) {
    for (const step of PALETTE_STEPS) {
      vars[cssVar.palette(intent, step)] = shared.palettes[intent][step];
    }
  }
  for (const radius of RADII) vars[cssVar.radius(radius)] = shared.radii[radius];
  vars[cssVar.font('sans')] = shared.fonts.sans;
  vars[cssVar.font('mono')] = shared.fonts.mono;
  for (const size of TEXT_SIZES) {
    vars[cssVar.text(size)] = shared.text[size].size;
    vars[cssVar.lineHeight(size)] = shared.text[size].lineHeight;
  }
  for (const weight of FONT_WEIGHTS) vars[cssVar.fontWeight(weight)] = shared.fontWeights[weight];
  vars[cssVar.spacing] = shared.spacing;
  for (const size of CONTROL_SIZES) {
    vars[cssVar.controlHeight(size)] = shared.density.controlHeight[size];
    vars[cssVar.controlPaddingX(size)] = shared.density.controlPaddingX[size];
  }
  vars[cssVar.cardPadding] = shared.density.cardPadding;
  for (const d of DURATIONS) vars[cssVar.duration(d)] = shared.motion.durations[d];
  for (const e of EASINGS) vars[cssVar.ease(e)] = shared.motion.easings[e];
  for (const layer of Z_LAYERS) vars[cssVar.zIndex(layer)] = String(shared.zIndex[layer]);
  return vars;
}

/** Variables that change between light and dark mode. */
export function modeVariables(mode: ModeTokens): CssVariables {
  const vars: CssVariables = {};
  for (const name of SEMANTIC_COLORS) vars[cssVar.color(name)] = mode.colors[name];
  for (const intent of INTENTS) {
    for (const role of ROLE_KEYS) vars[cssVar.role(intent, role)] = mode.intents[intent][role];
  }
  for (const shadow of SHADOWS) vars[cssVar.shadow(shadow)] = mode.shadows[shadow];
  return vars;
}

/** All variables for one theme in one mode. */
export function themeVariables(theme: TokenTheme, mode: 'light' | 'dark' = 'light'): CssVariables {
  return { ...sharedVariables(theme.tokens.shared), ...modeVariables(theme.tokens[mode]) };
}

const declarations = (vars: CssVariables, indent: string) =>
  Object.entries(vars)
    .map(([name, value]) => `${indent}${name}: ${value};`)
    .join('\n');

/** Selector a ThemeProvider wrapper matches for the given theme name. */
export const themeSelector = (name: string) => `[data-aui-theme="${name}"]`;

/**
 * CSS for one theme, scoped to `selector`. The wrapper's `data-mode` attribute picks light,
 * dark or system (system follows `prefers-color-scheme` in pure CSS).
 */
export function themeToCss(theme: TokenTheme, selector = themeSelector(theme.name)): string {
  const light = { ...sharedVariables(theme.tokens.shared), ...modeVariables(theme.tokens.light) };
  const dark = modeVariables(theme.tokens.dark);
  return [
    `${selector} {\n${declarations(light, '  ')}\n  color-scheme: light;\n}`,
    `${selector}[data-mode="dark"] {\n${declarations(dark, '  ')}\n  color-scheme: dark;\n}`,
    `@media (prefers-color-scheme: dark) {\n  ${selector}[data-mode="system"] {\n${declarations(dark, '    ')}\n    color-scheme: dark;\n  }\n}`,
  ].join('\n\n');
}

/**
 * Tailwind v4 `@theme` block registering every token as a utility namespace. Values are the
 * given theme's light mode; ThemeProvider overrides them on its wrapper.
 */
export function tailwindThemeCss(theme: TokenTheme): string {
  return `@theme {\n${declarations(themeVariables(theme, 'light'), '  ')}\n}`;
}

/** Base styles for the ThemeProvider wrapper element. */
export const ROOT_CSS = `.aui-root {
  background-color: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`;
