import type { ThemeTokens } from '@awesome-ui/tokens';

import { createTheme } from '../theme/createTheme';
import { flowbite, soft } from '../theme/themes';
import type { Theme, ThemeOverrides } from '../theme/types';

describe('createTheme', () => {
  it('deep-merges tokens without mutating the base', () => {
    const theme = createTheme(flowbite, {
      name: 'brand',
      tokens: {
        shared: { radii: { control: '2px' }, palettes: { primary: { 600: '#123456' } } },
        dark: { colors: { surface: '#000000' } },
      },
    });
    expect(theme.name).toBe('brand');
    expect(theme.tokens.shared.radii.control).toBe('2px');
    expect(theme.tokens.shared.radii.card).toBe(flowbite.tokens.shared.radii.card);
    expect(theme.tokens.shared.palettes.primary[600]).toBe('#123456');
    expect(theme.tokens.shared.palettes.primary[700]).toBe(
      flowbite.tokens.shared.palettes.primary[700],
    );
    expect(theme.tokens.dark.colors.surface).toBe('#000000');
    expect(theme.tokens.light.colors.surface).toBe(flowbite.tokens.light.colors.surface);
    expect(flowbite.tokens.shared.radii.control).toBe('0.5rem');
  });

  it('merges component overrides from base and override', () => {
    const theme = createTheme(soft, {
      name: 'softer',
      components: {
        Button: { slots: { root: 'shadow-lg' }, defaultProps: { size: 'lg' } },
      },
    });
    expect(theme.components.Button?.slots?.root).toBe('rounded-pill shadow-lg');
    expect(theme.components.Button?.defaultProps).toEqual({ size: 'lg' });
    expect(soft.components.Button?.slots?.root).toBe('rounded-pill');
  });

  it('rejects names that are not valid attribute values', () => {
    expect(() => createTheme(flowbite, { name: 'My Theme' })).toThrow(/invalid theme name/);
  });

  it('is fully typed', () => {
    expectTypeOf(createTheme).returns.toEqualTypeOf<Theme>();
    expectTypeOf<ThemeOverrides['tokens']>().toExtend<
      { shared?: { radii?: { control?: string } } } | undefined
    >();
    expectTypeOf(flowbite.tokens).toEqualTypeOf<ThemeTokens>();
    // @ts-expect-error unknown token group
    createTheme(flowbite, { name: 'x', tokens: { shared: { nope: 1 } } });
  });
});
