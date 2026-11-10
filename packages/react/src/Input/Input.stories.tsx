import { createTheme, flowbite, ThemeProvider } from '@awesome-ui/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { MailIcon, SearchIcon } from '../__stories__/icons';
import { Input } from './Input';
import { INPUT_TYPES } from './Input.types';

const meta = {
  title: 'Inputs/Input',
  component: Input,
  parameters: { padded: true },
  args: {
    'aria-label': 'Example',
    placeholder: 'Type something…',
    onChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    type: { control: 'select', options: INPUT_TYPES },
    startAdornment: { control: false },
    endAdornment: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The bare field. It has no label of its own: use `aria-label`, or `TextInput`. */
export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Input {...args} size="sm" aria-label="Small" placeholder="Small" />
      <Input {...args} size="md" aria-label="Medium" placeholder="Medium" />
      <Input {...args} size="lg" aria-label="Large" placeholder="Large" />
    </div>
  ),
};

/** Adornments are presentational: icons, prefixes and units inside the field. */
export const Adornments: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Input {...args} aria-label="Search" startAdornment={<SearchIcon />} placeholder="Search" />
      <Input {...args} aria-label="Website" startAdornment="https://" placeholder="example.com" />
      <Input {...args} aria-label="Weight" type="number" endAdornment="kg" placeholder="0" />
      <Input
        {...args}
        aria-label="Email"
        type="email"
        startAdornment={<MailIcon />}
        endAdornment="@company.com"
        placeholder="name"
      />
    </div>
  ),
};

function ControlledClearable() {
  const [value, setValue] = useState('Controlled value');
  return (
    <div className="grid gap-2">
      <Input
        aria-label="Controlled"
        clearable
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
      <p className="text-sm text-fg-muted">Value: {JSON.stringify(value)}</p>
    </div>
  );
}

/**
 * The clear button appears while the field has a value. It fires `onChange` with an empty value
 * (controlled and uncontrolled), then `onClear`, and returns focus to the field.
 */
export const Clearable: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Input
        {...args}
        aria-label="Uncontrolled"
        clearable
        defaultValue="Uncontrolled value"
        startAdornment={<SearchIcon />}
      />
      <ControlledClearable />
    </div>
  ),
};

export const Types: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {INPUT_TYPES.map((type) => (
        <Input key={type} {...args} type={type} aria-label={type} placeholder={type} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Input {...args} aria-label="Disabled" disabled defaultValue="Disabled" />
      <Input {...args} aria-label="Read only" readOnly defaultValue="Read only" />
      <Input {...args} aria-label="Invalid" invalid defaultValue="Invalid" />
    </div>
  ),
};

const denseTheme = createTheme(flowbite, {
  name: 'input-story-overrides',
  components: {
    Input: {
      defaultProps: { size: 'sm' },
      slots: { root: 'bg-surface', input: 'font-mono' },
    },
  },
});

/** Theme-level, instance-level and token-level overrides. */
export const Overrides: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <ThemeProvider theme={denseTheme}>
        <Input {...args} aria-label="Theme" placeholder="Theme: small, mono, plain surface" />
      </ThemeProvider>
      <Input
        {...args}
        aria-label="Instance"
        className="rounded-none"
        slotClassNames={{ input: 'text-end' }}
        placeholder="Instance: square, right-aligned"
      />
      <Input
        {...args}
        aria-label="Token"
        style={{ '--radius-control': '0.75rem' } as React.CSSProperties}
        placeholder="Token: --radius-control"
      />
    </div>
  ),
};

/** All three themes in light and dark. */
export const Themes: Story = {
  parameters: { themeMatrix: true },
  render: (args) => (
    <div className="grid gap-3">
      <Input
        {...args}
        aria-label="Search"
        startAdornment={<SearchIcon />}
        clearable
        defaultValue="Query"
      />
      <Input {...args} aria-label="Invalid" invalid defaultValue="Invalid" />
      <Input {...args} aria-label="Disabled" disabled defaultValue="Disabled" />
    </div>
  ),
};
