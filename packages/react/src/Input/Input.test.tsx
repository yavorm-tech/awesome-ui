import { createTheme, flowbite, ThemeProvider } from '@awesome-ui/core';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { axe } from 'vitest-axe';

import { Input } from './Input';

const getInput = () => screen.getByRole<HTMLInputElement>('textbox');
const root = () => {
  const element = getInput().parentElement;
  if (!element) throw new Error('Input has no root element');
  return element;
};

describe('Input', () => {
  it('forwards the ref and native props to the input, className and style to the root', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Input
        ref={ref}
        aria-label="Name"
        id="name"
        name="name"
        placeholder="Jane"
        className="max-w-sm"
        style={{ marginTop: 4 }}
      />,
    );
    const input = getInput();
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('id', 'name');
    expect(input).toHaveAttribute('name', 'name');
    expect(input).toHaveAttribute('type', 'text');
    expect(root()).toHaveClass('max-w-sm', 'rounded-control', 'h-control-md');
    expect(root().style.marginTop).toBe('4px');
  });

  it('maps size to density tokens and htmlSize to the native attribute', () => {
    render(<Input aria-label="Code" size="lg" htmlSize={6} />);
    expect(root()).toHaveClass('h-control-lg', 'px-control-px-lg');
    expect(getInput()).toHaveAttribute('size', '6');
  });

  it('works uncontrolled', async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Name" defaultValue="A" onChange={onChange} />);
    await userEvent.type(getInput(), 'da');
    expect(getInput()).toHaveValue('Ada');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('works controlled', async () => {
    function Controlled() {
      const [value, setValue] = useState('');
      return (
        <Input
          aria-label="Name"
          value={value}
          onChange={(event) => {
            setValue(event.target.value.toUpperCase());
          }}
        />
      );
    }
    render(<Controlled />);
    await userEvent.type(getInput(), 'ada');
    expect(getInput()).toHaveValue('ADA');
  });

  it('sets aria-invalid and danger styling when invalid', () => {
    render(<Input aria-label="Email" invalid />);
    expect(getInput()).toHaveAttribute('aria-invalid', 'true');
    expect(root()).toHaveClass('border-danger-outline');
    expect(root()).toHaveAttribute('data-invalid');
  });

  it('renders adornments and focuses the input when one is clicked', () => {
    render(
      <Input
        aria-label="Website"
        startAdornment={<span>https://</span>}
        endAdornment={<span>.com</span>}
      />,
    );
    fireEvent.mouseDown(screen.getByText('https://'));
    expect(getInput()).toHaveFocus();
  });

  describe('clearable', () => {
    it('shows the clear button only when there is a value', async () => {
      render(<Input aria-label="Search" clearable />);
      expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
      await userEvent.type(getInput(), 'x');
      expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    });

    it('hides it when disabled or read-only', () => {
      const { rerender } = render(
        <Input aria-label="Search" clearable disabled defaultValue="x" />,
      );
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      rerender(<Input aria-label="Search" clearable readOnly defaultValue="x" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('clears an uncontrolled value, fires onChange and onClear, and refocuses', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onClear = vi.fn();
      render(
        <Input
          aria-label="Search"
          clearable
          clearLabel="Clear search"
          defaultValue="query"
          onChange={onChange}
          onClear={onClear}
        />,
      );
      await user.click(screen.getByRole('button', { name: 'Clear search' }));
      expect(getInput()).toHaveValue('');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.lastCall?.[0]).toMatchObject({ target: { value: '' } });
      expect(onClear).toHaveBeenCalledTimes(1);
      expect(getInput()).toHaveFocus();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('clears a controlled value through onChange', async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [value, setValue] = useState('query');
        return (
          <Input
            aria-label="Search"
            clearable
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
        );
      }
      render(<Controlled />);
      await user.click(screen.getByRole('button', { name: 'Clear' }));
      expect(getInput()).toHaveValue('');
      expect(getInput()).toHaveFocus();
    });

    it('is reachable with the keyboard', async () => {
      const user = userEvent.setup();
      render(<Input aria-label="Search" clearable defaultValue="query" />);
      await user.tab();
      expect(getInput()).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Clear' })).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(getInput()).toHaveValue('');
      expect(getInput()).toHaveFocus();
    });
  });

  it('applies theme and instance overrides', () => {
    const theme = createTheme(flowbite, {
      name: 'input-overrides',
      components: {
        Input: {
          defaultProps: { size: 'sm' },
          slots: { root: 'rounded-none', input: 'font-mono' },
          variants: { invalid: { true: { root: 'border-2' } } },
        },
      },
    });
    render(
      <ThemeProvider theme={theme}>
        <Input aria-label="Code" invalid slotClassNames={{ input: 'font-sans' }} />
      </ThemeProvider>,
    );
    expect(root()).toHaveClass('h-control-sm', 'rounded-none', 'border-2');
    expect(getInput()).toHaveClass('font-sans');
    expect(getInput()).not.toHaveClass('font-mono');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Input aria-label="Plain" />
        <Input aria-label="Clearable" clearable defaultValue="x" />
        <Input aria-label="Invalid" invalid />
        <Input aria-label="Disabled" disabled />
        <Input aria-label="With adornments" startAdornment="$" endAdornment="USD" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
