import { type BuiltInThemeName, builtInThemes, ThemeProvider } from '@awesome-ui/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SampleCard } from './SampleCard';
import { TokenPage } from './TokenPage';

const meta = {
  title: 'Foundations/Theme tokens',
  component: TokenPage,
} satisfies Meta<typeof TokenPage>;

export default meta;

type Story = StoryObj<typeof meta>;

/** All tokens of the theme and mode selected in the toolbar. */
export const Tokens: Story = {};

/** The same markup in all three themes, light and dark (nested ThemeProviders). */
export const Compare: Story = {
  render: () => (
    <div className="bg-border grid gap-px lg:grid-cols-3">
      {(Object.keys(builtInThemes) as BuiltInThemeName[]).flatMap((name) =>
        (['light', 'dark'] as const).map((mode) => (
          <ThemeProvider
            key={`${name}-${mode}`}
            theme={builtInThemes[name]}
            mode={mode}
            className="p-6"
          >
            <p
              className="text-text-muted mb-3 font-mono text-xs"
              data-testid={`label-${name}-${mode}`}
            >
              {name} · {mode}
            </p>
            <SampleCard />
          </ThemeProvider>
        )),
      )}
    </div>
  ),
};
