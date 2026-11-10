import { contrastRatio } from '../color';
import { modeVariables, sharedVariables, themeToCss } from '../css';
import { flowbiteTokens, slateProTokens, softTokens } from '../index';
import { INTENTS, type ModeTokens, PALETTE_STEPS, type TokenTheme } from '../types';

const THEMES: TokenTheme[] = [flowbiteTokens, slateProTokens, softTokens];
const MODES = ['light', 'dark'] as const;

/** WCAG AA for normal-size text. */
const AA = 4.5;

describe.each(THEMES.map((t) => [t.name, t] as const))('%s theme', (_name, theme) => {
  it('defines every palette step for every intent', () => {
    for (const intent of INTENTS) {
      for (const step of PALETTE_STEPS) {
        expect(theme.tokens.shared.palettes[intent][step], `${intent}-${step}`).toMatch(
          /^#[0-9a-f]{6}$/i,
        );
      }
    }
  });

  it('produces the same variable names as every other theme', () => {
    const names = (t: TokenTheme, m: (typeof MODES)[number]) =>
      Object.keys({ ...sharedVariables(t.tokens.shared), ...modeVariables(t.tokens[m]) }).sort();
    expect(names(theme, 'light')).toEqual(names(flowbiteTokens, 'light'));
    expect(names(theme, 'dark')).toEqual(names(flowbiteTokens, 'light'));
  });

  describe.each(MODES)('%s mode', (mode) => {
    const tokens: ModeTokens = theme.tokens[mode];
    const c = tokens.colors;

    it.each([
      ['text', 'surface'],
      ['text', 'surfaceRaised'],
      ['text', 'surfaceSunken'],
      ['textMuted', 'surface'],
      ['textMuted', 'surfaceRaised'],
    ] as const)('%s on %s meets AA', (fg, bg) => {
      expect(contrastRatio(c[fg], c[bg])).toBeGreaterThanOrEqual(AA);
    });

    it.each(INTENTS)('%s: onSolid on solid and solidHover meets AA', (intent) => {
      const r = tokens.intents[intent];
      expect(contrastRatio(r.onSolid, r.solid)).toBeGreaterThanOrEqual(AA);
      expect(contrastRatio(r.onSolid, r.solidHover)).toBeGreaterThanOrEqual(AA);
    });

    it.each(INTENTS)('%s: onSoft on soft and on surfaces meets AA', (intent) => {
      const r = tokens.intents[intent];
      expect(contrastRatio(r.onSoft, r.soft)).toBeGreaterThanOrEqual(AA);
      expect(contrastRatio(r.onSoft, c.surface)).toBeGreaterThanOrEqual(AA);
      expect(contrastRatio(r.onSoft, c.surfaceRaised)).toBeGreaterThanOrEqual(AA);
    });
  });
});

describe('the three built-in themes look different', () => {
  const v = (t: TokenTheme) => ({
    ...sharedVariables(t.tokens.shared),
    ...modeVariables(t.tokens.light),
  });
  const keys = [
    '--color-primary-solid',
    '--radius-control',
    '--font-sans',
    '--spacing-control-md',
    '--shadow-md',
    '--text-base',
  ] as const;

  it.each(keys)('%s differs between all themes', (key) => {
    const values = new Set(THEMES.map((t) => v(t)[key]));
    expect(values.size).toBe(3);
  });
});

describe('themeToCss', () => {
  it('scopes light, dark and system variables to the theme selector', () => {
    const css = themeToCss(flowbiteTokens);
    expect(css).toContain('[data-aui-theme="flowbite"] {');
    expect(css).toContain('[data-aui-theme="flowbite"][data-mode="dark"] {');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain('[data-aui-theme="flowbite"][data-mode="system"]');
    expect(css).toContain('--color-primary-600: #1C64F2;');
  });

  it('matches the snapshot', () => {
    expect(themeToCss(slateProTokens, '.scope')).toMatchSnapshot();
  });
});
