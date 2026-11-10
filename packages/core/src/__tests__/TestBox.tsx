/* Test-only component exercising the override system the way real components will. */
import type { ComponentOverride, StyleProps } from '../overrides/types';
import { useComponentProps } from '../overrides/useComponentProps';
import { useSlotClasses } from '../overrides/useSlotClasses';
import { tv } from '../utils/tv';

export type TestBoxSlot = 'root' | 'label';

export interface TestBoxProps extends StyleProps<TestBoxSlot> {
  tone?: 'brand' | 'quiet' | undefined;
  raised?: boolean | undefined;
  label?: string | undefined;
}

declare module '../overrides/types' {
  interface ComponentOverrideMap {
    TestBox: ComponentOverride<TestBoxProps, TestBoxSlot>;
  }
}

const testBoxStyles = tv({
  slots: {
    root: 'rounded-control bg-surface p-4',
    label: 'text-sm text-text',
  },
  variants: {
    tone: {
      brand: { root: 'bg-primary-solid', label: 'text-primary-on-solid' },
      quiet: { root: 'bg-surface-sunken' },
    },
    raised: { true: { root: 'shadow-md' } },
  },
  defaultVariants: { tone: 'quiet' },
});

export function TestBox(inProps: TestBoxProps) {
  const props = useComponentProps('TestBox', inProps);
  const { tone, raised, label = 'Label', className, slotClassNames } = props;
  const classes = useSlotClasses(
    'TestBox',
    testBoxStyles({ tone, raised }),
    { tone, raised },
    { className, slotClassNames },
  );
  return (
    <div data-testid="root" className={classes.root}>
      <span data-testid="label" className={classes.label}>
        {label}
      </span>
    </div>
  );
}
