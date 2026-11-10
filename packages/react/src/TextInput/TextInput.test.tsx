import { createTheme, flowbite, ThemeProvider } from '@awesome-ui/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { axe } from 'vitest-axe';

import { TextInput } from './TextInput';
import type { TextInputProps } from './TextInput.types';

const getInput = () => screen.getByRole<HTMLInputElement>('textbox');

describe('TextInput', () => {
  it('associates the label and forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextInput ref={ref} label="Full name" />);
    const input = screen.getByLabelText('Full name');
    expect(input).toBe(getInput());
    expect(ref.current).toBe(input);
  });

  it('keeps a given id', () => {
    render(<TextInput id="email" label="Email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email');
  });

  it('describes the input with the helper text and merges aria-describedby', () => {
    render(
      <>
        <span id="extra">Extra</span>
        <TextInput label="Username" helperText="3 to 16 characters" aria-describedby="extra" />
      </>,
    );
    expect(getInput()).toHaveAccessibleDescription('3 to 16 characters Extra');
  });

  it('swaps in the error message and marks the field invalid', () => {
    const { rerender } = render(<TextInput label="Email" helperText="Work email" />);
    expect(getInput()).not.toHaveAttribute('aria-invalid');
    expect(getInput()).not.toHaveAttribute('aria-errormessage');

    rerender(
      <TextInput label="Email" helperText="Work email" errorMessage="Enter a valid email" />,
    );
    const input = getInput();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter a valid email');
    expect(input).toHaveAccessibleErrorMessage('Enter a valid email');
    expect(screen.queryByText('Work email')).not.toBeInTheDocument();
    expect(screen.getByText('Enter a valid email')).toHaveAttribute('aria-live', 'polite');
  });

  it('keeps the live region mounted before the error appears', () => {
    const { container } = render(<TextInput label="Email" />);
    const region = container.querySelector('[aria-live="polite"]');
    expect(region).toBeInTheDocument();
    expect(region).toBeEmptyDOMElement();
  });

  it('can be invalid without a message, or keep the message hidden when valid', () => {
    const { rerender } = render(<TextInput label="Code" invalid />);
    expect(getInput()).toHaveAttribute('aria-invalid', 'true');
    rerender(<TextInput label="Code" invalid={false} errorMessage="Wrong" />);
    expect(getInput()).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText('Wrong')).not.toBeInTheDocument();
  });

  it('marks required fields natively and hides the visual marker', () => {
    render(<TextInput label="Name" required />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toBeRequired();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('counts characters uncontrolled and flags the limit', async () => {
    render(<TextInput label="Bio" showCount maxLength={5} defaultValue="ab" />);
    const counter = screen.getByText('2/5');
    expect(getInput()).toHaveAccessibleDescription('2/5');
    await userEvent.type(getInput(), 'cdefg');
    expect(getInput()).toHaveValue('abcde');
    expect(counter).toHaveTextContent('5/5');
    expect(counter).toHaveClass('text-danger-on-soft');
  });

  it('counts characters controlled', async () => {
    function Controlled() {
      const [value, setValue] = useState('hi');
      return (
        <TextInput
          label="Note"
          showCount
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      );
    }
    render(<Controlled />);
    expect(screen.getByText('2')).toBeInTheDocument();
    await userEvent.type(getInput(), '!!');
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('updates the count when cleared', async () => {
    render(<TextInput label="Search" clearable showCount defaultValue="abc" />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('passes Input props through', () => {
    render(
      <TextInput
        label="Price"
        size="lg"
        startAdornment="$"
        placeholder="0.00"
        slotClassNames={{ field: 'max-w-xs', input: 'text-end' }}
      />,
    );
    const input = getInput();
    expect(input).toHaveAttribute('placeholder', '0.00');
    expect(input).toHaveClass('text-end');
    expect(input.parentElement).toHaveClass('h-control-lg', 'max-w-xs');
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('dims the label but keeps the helper text readable when disabled', () => {
    render(<TextInput label="Locked" disabled helperText="Cannot change" />);
    expect(getInput()).toBeDisabled();
    expect(screen.getByText('Locked')).toHaveClass('text-fg-disabled');
    expect(screen.getByText('Cannot change')).toHaveClass('text-fg-muted');
  });

  it('applies TextInput and Input theme overrides', () => {
    const theme = createTheme(flowbite, {
      name: 'text-input-overrides',
      components: {
        TextInput: { slots: { label: 'uppercase' } },
        Input: { slots: { root: 'rounded-none' } },
      },
    });
    render(
      <ThemeProvider theme={theme}>
        <TextInput label="Code" className="max-w-md" />
      </ThemeProvider>,
    );
    expect(screen.getByText('Code')).toHaveClass('uppercase');
    expect(getInput().parentElement).toHaveClass('rounded-none');
    expect(getInput().closest('.max-w-md')).not.toBeNull();
  });

  it('requires a label or an aria-label in its types', () => {
    expectTypeOf<{ label: 'Name' }>().toExtend<TextInputProps>();
    expectTypeOf<{ 'aria-label': 'Name' }>().toExtend<TextInputProps>();
    expectTypeOf<{ 'aria-labelledby': 'heading' }>().toExtend<TextInputProps>();
    expectTypeOf<{ placeholder: 'Name' }>().not.toExtend<TextInputProps>();
  });

  it('works without a visible label', () => {
    render(<TextInput aria-label="Search" />);
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('has no axe violations in any state', async () => {
    const { container } = render(
      <div>
        <TextInput label="Plain" />
        <TextInput label="Helper" helperText="Some help" />
        <TextInput label="Error" errorMessage="Something is wrong" />
        <TextInput label="Required" required />
        <TextInput label="Counter" showCount maxLength={10} />
        <TextInput label="Disabled" disabled helperText="Locked" />
        <TextInput label="Clearable" clearable defaultValue="x" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('TextInput in a form', () => {
  it('resyncs the counter and clear button after a form reset', async () => {
    const user = userEvent.setup();
    render(
      <form>
        <TextInput label="Bio" showCount clearable defaultValue="ab" />
        <button type="reset">Reset</button>
      </form>,
    );
    await user.type(getInput(), 'cd');
    expect(screen.getByText('4')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(getInput()).toHaveValue('ab');
    expect(await screen.findByText('2')).toBeInTheDocument();

    await user.clear(getInput());
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(await screen.findByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });
});
