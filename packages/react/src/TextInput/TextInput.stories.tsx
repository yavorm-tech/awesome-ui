import { createTheme, flowbite, ThemeProvider } from '@awesome-ui/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentType, type ReactNode, useState } from 'react';
import { fn } from 'storybook/test';

import { MailIcon, SearchIcon } from '../__stories__/icons';
import { TextInput } from './TextInput';
import type { TextInputProps } from './TextInput.types';

/**
 * TextInput's props require a label *or* an aria-label (a union). Storybook's args typing needs a
 * single object type, so stories use this looser shape; every story still passes a label.
 */
type StoryArgs = Omit<TextInputProps, 'label'> & { label?: ReactNode };
const StoryTextInput = TextInput as ComponentType<StoryArgs>;

const meta = {
  title: 'Inputs/TextInput',
  component: StoryTextInput,
  parameters: { padded: true },
  args: {
    label: 'Full name',
    placeholder: 'Jane Doe',
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
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
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { helperText: 'As it appears on your ID.' },
};

export const HelperText: Story = {
  args: { label: 'Username', helperText: '3 to 16 letters, digits or dashes.', placeholder: '' },
};

/** The error replaces the helper text, sets `aria-invalid` and is announced when it appears. */
export const Error: Story = {
  args: {
    label: 'Email',
    type: 'email',
    defaultValue: 'jane@',
    helperText: 'We never share it.',
    errorMessage: 'Enter a complete email address.',
  },
};

/** Native `required`; the asterisk is visual only. */
export const Required: Story = {
  args: { label: 'Company', required: true, placeholder: '' },
};

export const Counter: Story = {
  args: {
    label: 'Bio',
    showCount: true,
    maxLength: 40,
    defaultValue: 'Building things for the web.',
    placeholder: '',
  },
};

export const WithAdornments: Story = {
  render: (args) => (
    <div className="grid gap-4">
      <TextInput
        {...args}
        label="Search"
        startAdornment={<SearchIcon />}
        clearable
        placeholder="Search projects"
      />
      <TextInput
        {...args}
        label="Work email"
        type="email"
        startAdornment={<MailIcon />}
        endAdornment="@company.com"
        placeholder="name"
      />
    </div>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState('');
  const error = value.length > 0 && value.length < 3 ? 'At least 3 characters.' : undefined;
  return (
    <TextInput
      label="Project name"
      helperText="Shown on the dashboard."
      errorMessage={error}
      showCount
      maxLength={24}
      clearable
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
    />
  );
}

/** Controlled value with live validation: type one or two characters to see the error. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-4">
      <TextInput {...args} size="sm" label="Small" helperText="Small helper" />
      <TextInput {...args} size="md" label="Medium" helperText="Medium helper" />
      <TextInput {...args} size="lg" label="Large" helperText="Large helper" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Jane Doe', helperText: 'Contact support to change it.' },
};

const formTheme = createTheme(flowbite, {
  name: 'text-input-story-overrides',
  components: {
    TextInput: { slots: { label: 'text-xs tracking-wide text-fg-muted uppercase' } },
    Input: { slots: { root: 'bg-surface' } },
  },
});

/** Theme overrides for TextInput and its inner Input, and instance slot classes. */
export const Overrides: Story = {
  render: (args) => (
    <div className="grid gap-4">
      <ThemeProvider theme={formTheme}>
        <TextInput {...args} label="Theme override" helperText="Uppercase label, plain field" />
      </ThemeProvider>
      <TextInput
        {...args}
        label="Instance override"
        helperText="Square field, bold label"
        slotClassNames={{ field: 'rounded-none', label: 'font-bold' }}
      />
    </div>
  ),
};

/** All three themes in light and dark. */
export const Themes: Story = {
  parameters: { themeMatrix: true },
  render: (args) => (
    <div className="grid gap-4">
      <TextInput {...args} label="Name" helperText="Helper text" required />
      <TextInput {...args} label="Email" defaultValue="jane@" errorMessage="Enter a valid email." />
      <TextInput {...args} label="Disabled" disabled defaultValue="Locked" />
    </div>
  ),
};
