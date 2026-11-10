import { tv, type VariantProps } from '@awesome-ui/core';

/**
 * Button recipe. Colors come from the intent roles, sizes from the density tokens. Every class
 * is written out literally so Tailwind can find it.
 */
export const buttonStyles = tv({
  slots: {
    root: [
      'relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2',
      'rounded-control border border-transparent font-medium whitespace-nowrap select-none',
      'transition-colors duration-(--duration-fast) ease-standard motion-reduce:transition-none',
      'focus-visible:ring-4 focus-visible:ring-focus-ring focus-visible:outline-none',
      'data-disabled:pointer-events-none data-disabled:opacity-50',
      'data-loading:pointer-events-none',
    ],
    label: '',
    startIcon: 'inline-flex shrink-0 items-center justify-center [&>svg]:size-full',
    endIcon: 'inline-flex shrink-0 items-center justify-center [&>svg]:size-full',
    spinner: 'shrink-0 motion-safe:animate-spin motion-reduce:animate-pulse',
  },
  variants: {
    variant: {
      solid: {},
      outline: {},
      ghost: {},
      link: { root: 'underline-offset-4 hover:underline' },
    },
    color: {
      primary: {},
      secondary: {},
      neutral: {},
      success: {},
      warning: {},
      danger: {},
      info: {},
    },
    size: {
      sm: {
        root: 'h-control-sm gap-1.5 px-control-px-sm text-sm',
        startIcon: 'size-3.5',
        endIcon: 'size-3.5',
        spinner: 'size-3.5',
      },
      md: {
        root: 'h-control-md px-control-px-md text-sm',
        startIcon: 'size-4',
        endIcon: 'size-4',
        spinner: 'size-4',
      },
      lg: {
        root: 'h-control-lg px-control-px-lg text-base',
        startIcon: 'size-5',
        endIcon: 'size-5',
        spinner: 'size-5',
      },
    },
    fullWidth: {
      true: { root: 'w-full' },
    },
    loadingCenter: {
      true: {
        label: 'opacity-0',
        startIcon: 'opacity-0',
        endIcon: 'opacity-0',
        spinner: 'absolute inset-0 m-auto',
      },
    },
  },
  compoundVariants: [
    {
      variant: 'solid',
      color: 'primary',
      class: {
        root: 'bg-primary-solid text-primary-on-solid hover:bg-primary-solid-hover active:bg-primary-solid-hover',
      },
    },
    {
      variant: 'outline',
      color: 'primary',
      class: { root: 'border-primary-outline text-primary-on-soft hover:bg-primary-soft' },
    },
    {
      variant: 'ghost',
      color: 'primary',
      class: { root: 'text-primary-on-soft hover:bg-primary-soft' },
    },
    { variant: 'link', color: 'primary', class: { root: 'text-primary-on-soft' } },
    {
      variant: 'solid',
      color: 'secondary',
      class: {
        root: 'bg-secondary-solid text-secondary-on-solid hover:bg-secondary-solid-hover active:bg-secondary-solid-hover',
      },
    },
    {
      variant: 'outline',
      color: 'secondary',
      class: { root: 'border-secondary-outline text-secondary-on-soft hover:bg-secondary-soft' },
    },
    {
      variant: 'ghost',
      color: 'secondary',
      class: { root: 'text-secondary-on-soft hover:bg-secondary-soft' },
    },
    { variant: 'link', color: 'secondary', class: { root: 'text-secondary-on-soft' } },
    {
      variant: 'solid',
      color: 'neutral',
      class: {
        root: 'bg-neutral-solid text-neutral-on-solid hover:bg-neutral-solid-hover active:bg-neutral-solid-hover',
      },
    },
    {
      variant: 'outline',
      color: 'neutral',
      class: { root: 'border-neutral-outline text-neutral-on-soft hover:bg-neutral-soft' },
    },
    {
      variant: 'ghost',
      color: 'neutral',
      class: { root: 'text-neutral-on-soft hover:bg-neutral-soft' },
    },
    { variant: 'link', color: 'neutral', class: { root: 'text-neutral-on-soft' } },
    {
      variant: 'solid',
      color: 'success',
      class: {
        root: 'bg-success-solid text-success-on-solid hover:bg-success-solid-hover active:bg-success-solid-hover',
      },
    },
    {
      variant: 'outline',
      color: 'success',
      class: { root: 'border-success-outline text-success-on-soft hover:bg-success-soft' },
    },
    {
      variant: 'ghost',
      color: 'success',
      class: { root: 'text-success-on-soft hover:bg-success-soft' },
    },
    { variant: 'link', color: 'success', class: { root: 'text-success-on-soft' } },
    {
      variant: 'solid',
      color: 'warning',
      class: {
        root: 'bg-warning-solid text-warning-on-solid hover:bg-warning-solid-hover active:bg-warning-solid-hover',
      },
    },
    {
      variant: 'outline',
      color: 'warning',
      class: { root: 'border-warning-outline text-warning-on-soft hover:bg-warning-soft' },
    },
    {
      variant: 'ghost',
      color: 'warning',
      class: { root: 'text-warning-on-soft hover:bg-warning-soft' },
    },
    { variant: 'link', color: 'warning', class: { root: 'text-warning-on-soft' } },
    {
      variant: 'solid',
      color: 'danger',
      class: {
        root: 'bg-danger-solid text-danger-on-solid hover:bg-danger-solid-hover active:bg-danger-solid-hover',
      },
    },
    {
      variant: 'outline',
      color: 'danger',
      class: { root: 'border-danger-outline text-danger-on-soft hover:bg-danger-soft' },
    },
    {
      variant: 'ghost',
      color: 'danger',
      class: { root: 'text-danger-on-soft hover:bg-danger-soft' },
    },
    { variant: 'link', color: 'danger', class: { root: 'text-danger-on-soft' } },
    {
      variant: 'solid',
      color: 'info',
      class: {
        root: 'bg-info-solid text-info-on-solid hover:bg-info-solid-hover active:bg-info-solid-hover',
      },
    },
    {
      variant: 'outline',
      color: 'info',
      class: { root: 'border-info-outline text-info-on-soft hover:bg-info-soft' },
    },
    { variant: 'ghost', color: 'info', class: { root: 'text-info-on-soft hover:bg-info-soft' } },
    { variant: 'link', color: 'info', class: { root: 'text-info-on-soft' } },
    // `link` sits in running text: no control height or padding, whatever the size.
    { variant: 'link', size: ['sm', 'md', 'lg'], class: { root: 'h-auto px-0' } },
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: 'md',
  },
});

export type ButtonStyleProps = VariantProps<typeof buttonStyles>;
