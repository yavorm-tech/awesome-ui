import { tv, type VariantProps } from '@awesome-ui/core';

/** TextInput recipe: label, field and footer. The field itself is styled by Input. */
export const textInputStyles = tv({
  slots: {
    root: 'flex w-full min-w-0 flex-col',
    label: 'mb-2 block font-medium text-fg',
    requiredMarker: 'ms-0.5 text-danger-on-soft',
    field: '',
    input: '',
    footer: 'flex items-start gap-2',
    helperText: 'text-fg-muted',
    // Kept mounted as a live region; while empty it must not take a flex gap.
    errorMessage: 'text-danger-on-soft empty:sr-only',
    counter: 'ms-auto shrink-0 text-fg-muted tabular-nums',
  },
  variants: {
    size: {
      sm: { label: 'text-xs', footer: 'text-xs' },
      md: { label: 'text-sm', footer: 'text-sm' },
      lg: { label: 'text-base', footer: 'text-sm' },
    },
    hasFooter: {
      true: { footer: 'mt-2' },
    },
    disabled: {
      // Only the label dims: it belongs to the inactive control. Helper text and the counter
      // stay readable (they must still meet text contrast).
      true: { label: 'text-fg-disabled' },
    },
    atLimit: {
      true: { counter: 'text-danger-on-soft' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type TextInputStyleProps = VariantProps<typeof textInputStyles>;
