import {
  createTheme,
  flowbite,
  type StyleProps,
  ThemeProvider,
  tv,
  useComponentProps,
  useSlotClasses,
} from '@awesome-ui/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';

type DemoSlot = 'root' | 'title' | 'body';

interface DemoCardProps extends StyleProps<DemoSlot> {
  tone?: 'neutral' | 'primary' | undefined;
  title?: string | undefined;
  children?: ReactNode;
  style?: CSSProperties | undefined;
}

const demoCardStyles = tv({
  slots: {
    root: 'max-w-xs rounded-card border p-card-p shadow-sm',
    title: 'mb-1 font-semibold',
    body: 'text-sm',
  },
  variants: {
    tone: {
      neutral: { root: 'border-border bg-surface-raised text-fg', body: 'text-fg-muted' },
      primary: { root: 'border-primary-outline bg-primary-soft text-primary-on-soft' },
    },
  },
  defaultVariants: { tone: 'neutral' },
});

/** Demo of how every library component consumes the override system. */
function DemoCard(inProps: DemoCardProps) {
  const {
    tone,
    title = 'Card',
    children,
    className,
    slotClassNames,
    style,
  } = useComponentProps('DemoCard', inProps);
  const c = useSlotClasses(
    'DemoCard',
    demoCardStyles({ tone }),
    { tone },
    { className, slotClassNames },
  );
  return (
    <div className={c.root} style={style}>
      <div className={c.title}>{title}</div>
      <div className={c.body}>{children}</div>
    </div>
  );
}

const themed = createTheme(flowbite, {
  name: 'overrides-demo',
  components: {
    DemoCard: {
      defaultProps: { tone: 'primary' },
      slots: { root: 'rounded-none shadow-overlay', title: 'uppercase tracking-wide' },
    },
  },
});

const meta = {
  title: 'Foundations/Overrides',
  parameters: { padded: true },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** The three override levels, applied to the same demo component. */
export const ThreeLevels: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <DemoCard title="Default">No overrides.</DemoCard>

      <ThemeProvider theme={themed}>
        <DemoCard title="1 · Theme level">
          <code>theme.components.DemoCard</code> sets <code>tone</code>, square corners and a bigger
          shadow.
        </DemoCard>
      </ThemeProvider>

      <DemoCard
        title="2 · Instance level"
        className="rotate-1"
        slotClassNames={{ title: 'text-danger-on-soft', body: 'italic' }}
      >
        <code>className</code> on the root and <code>slotClassNames</code> per slot.
      </DemoCard>

      <DemoCard
        title="3 · Token level"
        tone="primary"
        style={
          {
            '--color-primary-soft': 'var(--color-success-soft)',
            '--color-primary-on-soft': 'var(--color-success-on-soft)',
            '--color-primary-outline': 'var(--color-success-outline)',
            '--radius-card': '0px',
          } as CSSProperties
        }
      >
        CSS variables overridden on the element.
      </DemoCard>
    </div>
  ),
};
