import { createTheme, flowbite, ThemeProvider } from '@awesome-ui/core';
import { INTENTS } from '@awesome-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ArrowRightIcon, PlusIcon, TrashIcon } from '../__stories__/icons';
import { Button } from './Button';
import { BUTTON_VARIANTS } from './Button.types';

const meta = {
  title: 'Inputs/Button',
  component: Button,
  parameters: { padded: true },
  args: {
    children: 'Button',
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: BUTTON_VARIANTS },
    color: { control: 'select', options: INTENTS },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    loadingPosition: { control: 'inline-radio', options: ['start', 'end', 'center'] },
    startIcon: { control: false },
    endIcon: { control: false },
    as: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = 'flex flex-wrap items-center gap-3';

/** Every prop is editable in the Controls panel. */
export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className={row}>
      {BUTTON_VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

/** Every variant in every color intent. Colors come from the intent role tokens. */
export const Colors: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {BUTTON_VARIANTS.map((variant) => (
        <div key={variant} className={row}>
          {INTENTS.map((color) => (
            <Button key={color} {...args} variant={variant} color={color}>
              {color}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className={row}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

/** Icons are decorative (`aria-hidden`); the label names the button. */
export const WithIcons: Story = {
  render: (args) => (
    <div className={row}>
      <Button {...args} startIcon={<PlusIcon />}>
        New project
      </Button>
      <Button {...args} variant="outline" endIcon={<ArrowRightIcon />}>
        Continue
      </Button>
      <Button {...args} variant="ghost" color="danger" startIcon={<TrashIcon />}>
        Delete
      </Button>
    </div>
  ),
};

/**
 * Loading buttons stay focusable, announce `aria-busy` and ignore activation. `center` keeps
 * the width and the accessible name.
 */
export const Loading: Story = {
  render: (args) => (
    <div className={row}>
      <Button {...args} loading>
        Save
      </Button>
      <Button {...args} loading loadingText="Saving…" variant="outline">
        Save
      </Button>
      <Button {...args} loading loadingPosition="end" endIcon={<ArrowRightIcon />}>
        Next
      </Button>
      <Button {...args} loading loadingPosition="center" variant="ghost">
        Refresh
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className={row}>
      {BUTTON_VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant} disabled>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true, children: 'Sign in' },
  render: (args) => (
    <div className="max-w-sm">
      <Button {...args} />
    </div>
  ),
};

/**
 * `as="a"` renders a link styled as a button. `asChild` styles your own element, e.g. a router
 * link. Disabled links lose their `href` and leave the tab order.
 */
export const AsLink: Story = {
  render: () => (
    <div className={row}>
      <Button as="a" href="#as-link" endIcon={<ArrowRightIcon />}>
        as=&quot;a&quot;
      </Button>
      <Button asChild variant="outline">
        <a href="#as-child">asChild</a>
      </Button>
      <Button as="a" href="#disabled" disabled variant="ghost">
        Disabled link
      </Button>
    </div>
  ),
};

const brandTheme = createTheme(flowbite, {
  name: 'button-story-overrides',
  components: {
    Button: {
      defaultProps: { variant: 'outline' },
      slots: { root: 'tracking-wide uppercase' },
      variants: { size: { lg: { root: 'shadow-md' } } },
    },
  },
});

/**
 * The three override levels: theme (`components.Button`), instance (`className`,
 * `slotClassNames`) and token (CSS variables in `style`).
 */
export const Overrides: Story = {
  render: () => (
    <div className="grid gap-6">
      <ThemeProvider theme={brandTheme}>
        <div className={row}>
          <Button>Theme default: outline</Button>
          <Button size="lg">Theme variant: lg adds a shadow</Button>
        </div>
      </ThemeProvider>
      <div className={row}>
        <Button className="rounded-none">className</Button>
        <Button slotClassNames={{ label: 'italic underline' }}>slotClassNames</Button>
        <Button
          style={{ '--color-primary-solid': 'var(--color-success-700)' } as React.CSSProperties}
        >
          Token override
        </Button>
      </div>
    </div>
  ),
};

/** All three themes in light and dark. `soft` uses pill-shaped buttons. */
export const Themes: Story = {
  parameters: { themeMatrix: true },
  render: (args) => (
    <div className="grid gap-3">
      <div className={row}>
        {BUTTON_VARIANTS.map((variant) => (
          <Button key={variant} {...args} variant={variant}>
            {variant}
          </Button>
        ))}
      </div>
      <div className={row}>
        <Button {...args} color="danger" startIcon={<TrashIcon />}>
          Delete
        </Button>
        <Button {...args} color="neutral" variant="outline" size="sm">
          Small
        </Button>
        <Button {...args} loading>
          Loading
        </Button>
        <Button {...args} disabled>
          Disabled
        </Button>
      </div>
    </div>
  ),
};
