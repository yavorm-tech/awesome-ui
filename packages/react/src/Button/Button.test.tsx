import { createTheme, flowbite, soft, ThemeProvider } from '@awesome-ui/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, forwardRef, type ReactNode } from 'react';
import { axe } from 'vitest-axe';

import { Button } from './Button';
import { BUTTON_VARIANTS } from './Button.types';

const classesOf = (element: HTMLElement) => element.className.split(' ');

describe('Button', () => {
  it('renders a native button with type="button" and forwards the ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
    expect(ref.current).toBe(button);
  });

  it('keeps an explicit type', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('defaults to solid, primary, md', () => {
    render(<Button>Go</Button>);
    expect(classesOf(screen.getByRole('button'))).toEqual(
      expect.arrayContaining([
        'bg-primary-solid',
        'text-primary-on-solid',
        'hover:bg-primary-solid-hover',
        'h-control-md',
        'px-control-px-md',
        'rounded-control',
      ]),
    );
  });

  it.each([
    ['solid', ['bg-danger-solid', 'text-danger-on-solid']],
    ['outline', ['border-danger-outline', 'text-danger-on-soft']],
    ['ghost', ['text-danger-on-soft', 'hover:bg-danger-soft']],
    ['link', ['text-danger-on-soft', 'hover:underline', 'h-auto', 'px-0']],
  ] as const)('maps variant %s to intent role classes', (variant, expected) => {
    render(
      <Button variant={variant} color="danger">
        Delete
      </Button>,
    );
    expect(classesOf(screen.getByRole('button'))).toEqual(expect.arrayContaining([...expected]));
  });

  it.each(['sm', 'md', 'lg'] as const)('maps size %s to density tokens', (size) => {
    render(<Button size={size}>Sized</Button>);
    expect(classesOf(screen.getByRole('button'))).toEqual(
      expect.arrayContaining([`h-control-${size}`, `px-control-px-${size}`]),
    );
  });

  it('applies fullWidth', () => {
    render(<Button fullWidth>Wide</Button>);
    expect(classesOf(screen.getByRole('button'))).toContain('w-full');
  });

  it('activates with click, Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('renders decorative icons hidden from assistive technology', () => {
    render(
      <Button startIcon={<svg data-testid="start" />} endIcon={<svg data-testid="end" />}>
        Next
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveAccessibleName('Next');
    expect(screen.getByTestId('start').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('end').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  describe('disabled', () => {
    it('is natively disabled and blocks clicks', async () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Save
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('data-disabled');
      await userEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('loading', () => {
    it('stays focusable, is busy and blocks activation', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Save
        </Button>,
      );
      const button = screen.getByRole('button', { name: 'Save' });
      expect(button).not.toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('data-loading');

      await user.tab();
      expect(button).toHaveFocus();
      await user.keyboard('{Enter}');
      button.click();
      expect(onClick).not.toHaveBeenCalled();
    });

    it('replaces the start icon with a spinner by default', () => {
      const { container } = render(
        <Button loading startIcon={<svg data-testid="icon" />}>
          Save
        </Button>,
      );
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
      expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    });

    it('shows loadingText', () => {
      render(
        <Button loading loadingText="Saving…">
          Save
        </Button>,
      );
      expect(screen.getByRole('button')).toHaveAccessibleName('Saving…');
    });

    it('keeps the label in the accessible name when centered', () => {
      render(
        <Button loading loadingPosition="center" loadingText="ignored">
          Save
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAccessibleName('Save');
      expect(screen.getByText('Save')).toHaveClass('opacity-0');
    });
  });

  describe('as / asChild', () => {
    it('renders as a link with link props', () => {
      render(
        <Button as="a" href="/docs">
          Docs
        </Button>,
      );
      const link = screen.getByRole('link', { name: 'Docs' });
      expect(link).toHaveAttribute('href', '/docs');
      expect(link).not.toHaveAttribute('type');
      expect(link).not.toHaveAttribute('role');
    });

    it('disables a link: no href, aria-disabled, out of the tab order, no clicks', async () => {
      const onClick = vi.fn();
      render(
        <Button as="a" href="/docs" disabled onClick={onClick}>
          Docs
        </Button>,
      );
      const link = screen.getByText('Docs').closest('a');
      expect(link).not.toHaveAttribute('href');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabindex', '-1');
      if (link) await userEvent.click(link);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('gives non-interactive elements role="button" and keyboard activation', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button as="div" onClick={onClick}>
          Div button
        </Button>,
      );
      const button = screen.getByRole('button', { name: 'Div button' });
      expect(button).toHaveAttribute('tabindex', '0');
      await user.tab();
      expect(button).toHaveFocus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('renders a custom component through `as`', () => {
      const RouterLink = forwardRef<HTMLAnchorElement, { to: string; children?: ReactNode }>(
        function RouterLink({ to, children, ...rest }, ref) {
          return (
            <a ref={ref} href={to} {...rest}>
              {children}
            </a>
          );
        },
      );
      render(
        <Button as={RouterLink} to="/home">
          Home
        </Button>,
      );
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/home');
    });

    it('merges into the child with asChild', async () => {
      // The ref receives the child element; its static type stays the default element's.
      const ref = createRef<HTMLButtonElement>();
      const onClick = vi.fn((event: React.MouseEvent) => {
        event.preventDefault();
      });
      render(
        <Button asChild ref={ref} variant="outline" startIcon={<svg data-testid="icon" />}>
          <a href="/next" className="tracking-wide" onClick={onClick}>
            Next
          </a>
        </Button>,
      );
      const link = screen.getByRole('link', { name: 'Next' });
      expect(link).toHaveAttribute('href', '/next');
      expect(classesOf(link)).toEqual(
        expect.arrayContaining(['tracking-wide', 'border-primary-outline']),
      );
      expect(link).toContainElement(screen.getByTestId('icon'));
      expect(ref.current).toBe(link);
      await userEvent.click(link);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('drops the child link target and click handler when disabled', async () => {
      const onClick = vi.fn();
      render(
        <Button asChild disabled>
          <a href="/next" onClick={onClick}>
            Next
          </a>
        </Button>,
      );
      const link = screen.getByText('Next').closest('a');
      expect(link).not.toHaveAttribute('href');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      if (link) await userEvent.click(link);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('overrides', () => {
    it('applies theme defaultProps, slots and variants', () => {
      const theme = createTheme(flowbite, {
        name: 'button-overrides',
        components: {
          Button: {
            defaultProps: { variant: 'outline', size: 'lg' },
            slots: { root: 'tracking-wide', label: 'uppercase' },
            variants: { color: { danger: { root: 'font-bold' } } },
          },
        },
      });
      render(
        <ThemeProvider theme={theme}>
          <Button color="danger">Delete</Button>
        </ThemeProvider>,
      );
      const button = screen.getByRole('button');
      expect(classesOf(button)).toEqual(
        expect.arrayContaining([
          'border-danger-outline',
          'h-control-lg',
          'tracking-wide',
          'font-bold',
        ]),
      );
      expect(screen.getByText('Delete')).toHaveClass('uppercase');
    });

    it('uses pill buttons in the soft theme', () => {
      render(
        <ThemeProvider theme={soft}>
          <Button>Soft</Button>
        </ThemeProvider>,
      );
      const classes = classesOf(screen.getByRole('button'));
      expect(classes).toContain('rounded-pill');
      expect(classes).not.toContain('rounded-control');
    });

    it('lets instance classes win over theme and recipe classes', () => {
      render(
        <ThemeProvider theme={soft}>
          <Button className="rounded-none" slotClassNames={{ label: 'italic' }}>
            Square
          </Button>
        </ThemeProvider>,
      );
      const classes = classesOf(screen.getByRole('button'));
      expect(classes).toContain('rounded-none');
      expect(classes).not.toContain('rounded-pill');
      expect(screen.getByText('Square')).toHaveClass('italic');
    });
  });

  it('has no axe violations in any variant or state', async () => {
    const { container } = render(
      <div>
        {BUTTON_VARIANTS.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
        <Button as="a" href="/x">
          Link
        </Button>
        <Button as="div">Div</Button>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
