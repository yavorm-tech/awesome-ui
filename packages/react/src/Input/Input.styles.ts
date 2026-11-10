import { tv, type VariantProps } from '@awesome-ui/core';

/**
 * Input recipe. The root is the visible field box; the native input inside it is unstyled.
 * Focus styling uses `focus-within` so adornments and the clear button sit inside the ring.
 */
export const inputStyles = tv({
  slots: {
    root: [
      'flex w-full min-w-0 items-center gap-2 rounded-control border border-border-strong',
      'bg-surface-sunken text-fg',
      'transition-[border-color,box-shadow] duration-(--duration-fast) ease-standard',
      'motion-reduce:transition-none',
      'focus-within:border-primary-solid focus-within:ring-1 focus-within:ring-primary-solid',
    ],
    input: [
      'h-full min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-fg-muted',
      'disabled:cursor-not-allowed',
    ],
    startAdornment: 'flex shrink-0 items-center text-fg-muted [&>svg]:size-4',
    endAdornment: 'flex shrink-0 items-center text-fg-muted [&>svg]:size-4',
    clearButton: [
      'inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm',
      'text-fg-muted hover:text-fg',
      'focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none',
      '[&>svg]:size-4',
    ],
  },
  variants: {
    size: {
      sm: { root: 'h-control-sm px-control-px-sm text-sm', input: 'text-sm' },
      md: { root: 'h-control-md px-control-px-md text-sm', input: 'text-sm' },
      lg: { root: 'h-control-lg px-control-px-lg text-base', input: 'text-base' },
    },
    invalid: {
      true: {
        root: 'border-danger-outline focus-within:border-danger-solid focus-within:ring-danger-solid',
      },
    },
    disabled: {
      true: { root: 'cursor-not-allowed opacity-60', input: 'text-fg-disabled' },
    },
    readOnly: {
      true: { root: 'border-border bg-surface' },
    },
    clearable: {
      // The native WebKit search "x" would duplicate our clear button.
      true: { input: '[&::-webkit-search-cancel-button]:appearance-none' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type InputStyleProps = VariantProps<typeof inputStyles>;
