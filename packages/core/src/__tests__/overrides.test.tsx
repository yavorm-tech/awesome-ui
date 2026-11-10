import { render, screen } from '@testing-library/react';

import { createTheme } from '../theme/createTheme';
import { ThemeProvider } from '../theme/ThemeProvider';
import { flowbite, soft } from '../theme/themes';
import type { Theme } from '../theme/types';
import { cn } from '../utils/tv';
import { TestBox } from './TestBox';

const classesOf = (id: string) => screen.getByTestId(id).className.split(' ');

function renderIn(theme: Theme, ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('cn', () => {
  it('knows token utilities conflict with each other', () => {
    expect(cn('rounded-control', 'rounded-pill')).toBe('rounded-pill');
    expect(cn('shadow-md', 'shadow-overlay')).toBe('shadow-overlay');
    expect(cn('h-control-md', 'h-control-lg')).toBe('h-control-lg');
    expect(cn('px-control-px-sm', 'px-4')).toBe('px-4');
    expect(cn('ease-standard', 'ease-emphasized')).toBe('ease-emphasized');
  });

  it('keeps text color and text size apart', () => {
    expect(cn('text-sm text-fg', 'text-fg-muted')).toBe('text-sm text-fg-muted');
    expect(cn('text-sm text-fg', 'text-lg')).toBe('text-fg text-lg');
  });
});

describe('override system', () => {
  it('renders the recipe without a provider', () => {
    render(<TestBox />);
    expect(classesOf('root')).toEqual(['rounded-control', 'p-4', 'bg-surface-sunken']);
  });

  it('applies theme defaultProps under instance props', () => {
    const theme = createTheme(flowbite, {
      name: 'defaults',
      components: { TestBox: { defaultProps: { tone: 'brand', label: 'From theme' } } },
    });
    const { rerender } = renderIn(theme, <TestBox />);
    expect(classesOf('root')).toContain('bg-primary-solid');
    expect(screen.getByTestId('label')).toHaveTextContent('From theme');

    rerender(
      <ThemeProvider theme={theme}>
        <TestBox tone="quiet" label="Instance" />
      </ThemeProvider>,
    );
    expect(classesOf('root')).toContain('bg-surface-sunken');
    expect(screen.getByTestId('label')).toHaveTextContent('Instance');
  });

  it('applies theme slot and variant classes', () => {
    const theme = createTheme(flowbite, {
      name: 'slots',
      components: {
        TestBox: {
          slots: { root: 'rounded-pill', label: 'font-bold' },
          variants: {
            tone: { brand: { root: 'shadow-overlay' } },
            raised: { true: { label: 'italic' } },
          },
        },
      },
    });
    renderIn(theme, <TestBox tone="brand" raised />);
    expect(classesOf('root')).toEqual(
      expect.arrayContaining(['rounded-pill', 'shadow-overlay', 'bg-primary-solid']),
    );
    expect(classesOf('root')).not.toContain('rounded-control');
    // Theme variant class wins over the recipe's raised shadow.
    expect(classesOf('root')).not.toContain('shadow-md');
    expect(classesOf('label')).toEqual(expect.arrayContaining(['font-bold', 'italic']));
  });

  it('instance slotClassNames win over theme, className wins over everything on root', () => {
    const theme = createTheme(flowbite, {
      name: 'precedence',
      components: { TestBox: { slots: { root: 'rounded-pill', label: 'text-lg' } } },
    });
    renderIn(
      theme,
      <TestBox
        slotClassNames={{ root: 'rounded-sm p-2', label: 'text-xs' }}
        className="rounded-none"
      />,
    );
    expect(classesOf('root')).toEqual(expect.arrayContaining(['rounded-none', 'p-2']));
    expect(classesOf('root')).not.toContain('rounded-pill');
    expect(classesOf('root')).not.toContain('rounded-sm');
    expect(classesOf('root')).not.toContain('p-4');
    expect(classesOf('label')).toContain('text-xs');
    expect(classesOf('label')).not.toContain('text-lg');
  });

  it('a nested provider uses its own theme overrides', () => {
    render(
      <ThemeProvider theme={flowbite}>
        <ThemeProvider
          theme={createTheme(soft, {
            name: 'inner',
            components: { TestBox: { slots: { root: 'shadow-lg' } } },
          })}
        >
          <TestBox />
        </ThemeProvider>
      </ThemeProvider>,
    );
    expect(classesOf('root')).toContain('shadow-lg');
  });

  it('token-level overrides are plain CSS variables on any element', () => {
    render(
      <ThemeProvider>
        <div data-testid="scoped" style={{ ['--color-primary-600' as string]: '#ff0000' }} />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('scoped').style.getPropertyValue('--color-primary-600')).toBe(
      '#ff0000',
    );
  });
});
