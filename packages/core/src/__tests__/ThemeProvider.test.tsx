import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode } from 'react';
import { axe } from 'vitest-axe';

import { createTheme } from '../theme/createTheme';
import { ThemeProvider } from '../theme/ThemeProvider';
import { flowbite, slatePro, soft } from '../theme/themes';
import { useTheme } from '../theme/useTheme';

function mockMatchMedia(dark: boolean) {
  const listeners = new Set<() => void>();
  const media = {
    matches: dark,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_: string, cb: () => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
  };
  vi.stubGlobal('matchMedia', () => media);
  return {
    set(next: boolean) {
      media.matches = next;
      listeners.forEach((cb) => {
        cb();
      });
    },
  };
}

function ModeProbe({ id = 'probe' }: { id?: string }) {
  const { theme, mode, resolvedMode, setMode } = useTheme();
  return (
    <div data-testid={id}>
      {theme.name}:{mode}:{resolvedMode}
      <button type="button" onClick={() => setMode('dark')}>
        dark-{id}
      </button>
    </div>
  );
}

const wrapperOf = (el: HTMLElement) => el.closest('[data-aui-theme]');

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ThemeProvider', () => {
  it('defaults to flowbite, light, and sets data attributes on a wrapper', () => {
    render(
      <ThemeProvider>
        <ModeProbe />
      </ThemeProvider>,
    );
    const probe = screen.getByTestId('probe');
    expect(probe).toHaveTextContent('flowbite:light:light');
    const wrapper = wrapperOf(probe);
    expect(wrapper).toHaveAttribute('data-aui-theme', 'flowbite');
    expect(wrapper).toHaveAttribute('data-mode', 'light');
    expect(wrapper).toHaveClass('aui-root');
  });

  it('injects the theme CSS variables as a style tag', () => {
    render(<ThemeProvider theme={slatePro}>content</ThemeProvider>);
    const css = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent)
      .join('\n');
    expect(css).toContain('[data-aui-theme="slate-pro"]');
    expect(css).toContain('--radius-control: 3px;');
    expect(css).toContain('.aui-root');
  });

  it('injects a custom theme with its own values', () => {
    const brand = createTheme(flowbite, {
      name: 'brand',
      tokens: { shared: { radii: { control: '0.125rem' } } },
    });
    render(<ThemeProvider theme={brand}>content</ThemeProvider>);
    const css = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent)
      .join('\n');
    expect(css).toContain('[data-aui-theme="brand"]');
    expect(css).toContain('--radius-control: 0.125rem;');
  });

  it('can skip style injection', () => {
    document.head.innerHTML = '';
    render(
      <ThemeProvider theme={soft} injectStyles={false}>
        content
      </ThemeProvider>,
    );
    expect(document.querySelector('style')).toBeNull();
  });

  it('supports uncontrolled mode with setMode and onModeChange', async () => {
    const onModeChange = vi.fn();
    render(
      <ThemeProvider defaultMode="light" onModeChange={onModeChange}>
        <ModeProbe />
      </ThemeProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'dark-probe' }));
    expect(screen.getByTestId('probe')).toHaveTextContent('flowbite:dark:dark');
    expect(wrapperOf(screen.getByTestId('probe'))).toHaveAttribute('data-mode', 'dark');
    expect(onModeChange).toHaveBeenCalledWith('dark');
  });

  it('supports controlled mode', async () => {
    const onModeChange = vi.fn();
    const { rerender } = render(
      <ThemeProvider mode="light" onModeChange={onModeChange}>
        <ModeProbe />
      </ThemeProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'dark-probe' }));
    expect(onModeChange).toHaveBeenCalledWith('dark');
    // Still light until the parent passes the new mode.
    expect(screen.getByTestId('probe')).toHaveTextContent('flowbite:light:light');
    rerender(
      <ThemeProvider mode="dark" onModeChange={onModeChange}>
        <ModeProbe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('probe')).toHaveTextContent('flowbite:dark:dark');
  });

  it('resolves system mode from prefers-color-scheme and follows changes', () => {
    const media = mockMatchMedia(false);
    render(
      <ThemeProvider defaultMode="system">
        <ModeProbe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('probe')).toHaveTextContent('flowbite:system:light');
    expect(wrapperOf(screen.getByTestId('probe'))).toHaveAttribute('data-mode', 'system');
    act(() => {
      media.set(true);
    });
    expect(screen.getByTestId('probe')).toHaveTextContent('flowbite:system:dark');
  });

  it('nested providers override the theme and inherit the parent mode', async () => {
    render(
      <ThemeProvider theme={flowbite} defaultMode="light">
        <ModeProbe id="outer" />
        <ThemeProvider theme={soft}>
          <ModeProbe id="inner" />
        </ThemeProvider>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('inner')).toHaveTextContent('soft:light:light');
    expect(wrapperOf(screen.getByTestId('inner'))).toHaveAttribute('data-aui-theme', 'soft');

    // setMode in the inheriting child changes the parent's mode.
    await userEvent.click(screen.getByRole('button', { name: 'dark-inner' }));
    expect(screen.getByTestId('outer')).toHaveTextContent('flowbite:dark:dark');
    expect(screen.getByTestId('inner')).toHaveTextContent('soft:dark:dark');
  });

  it('a nested provider with its own mode keeps it', () => {
    render(
      <ThemeProvider mode="dark">
        <ThemeProvider mode="light">
          <ModeProbe id="inner" />
        </ThemeProvider>
      </ThemeProvider>,
    );
    expect(wrapperOf(screen.getByTestId('inner'))).toHaveAttribute('data-mode', 'light');
  });

  it('does not re-render children that do not read the theme when the mode changes', async () => {
    const onRender = vi.fn();
    function Static({ children }: { children?: ReactNode }) {
      onRender();
      return <p>static {children}</p>;
    }
    render(
      <ThemeProvider defaultMode="light">
        <Static />
        <ModeProbe />
      </ThemeProvider>,
    );
    const before = onRender.mock.calls.length;
    await userEvent.click(screen.getByRole('button', { name: 'dark-probe' }));
    expect(screen.getByTestId('probe')).toHaveTextContent('dark');
    expect(onRender).toHaveBeenCalledTimes(before);
  });

  it('useTheme throws outside a provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<ModeProbe />)).toThrow(/inside <ThemeProvider>/);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ThemeProvider theme={soft} defaultMode="dark">
        <main>
          <h1>Тема</h1>
          <p>Content in a themed scope.</p>
        </main>
      </ThemeProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
