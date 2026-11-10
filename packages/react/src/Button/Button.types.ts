import type { ComponentOverride, PolymorphicProps, StyleProps } from '@awesome-ui/core';
import type { ControlSize, Intent } from '@awesome-ui/tokens';
import type { ElementType, ReactNode } from 'react';

export const BUTTON_VARIANTS = ['solid', 'outline', 'ghost', 'link'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonColor = Intent;
export type ButtonSize = ControlSize;

/** Styleable parts of a Button. */
export type ButtonSlot = 'root' | 'label' | 'startIcon' | 'endIcon' | 'spinner';

/** Props Button defines itself; everything else goes to the rendered element. */
export interface ButtonOwnProps extends StyleProps<ButtonSlot> {
  /** Visual style. @default 'solid' */
  variant?: ButtonVariant | undefined;
  /** Color intent. @default 'primary' */
  color?: ButtonColor | undefined;
  /** Height, padding and font size, from the theme's density tokens. @default 'md' */
  size?: ButtonSize | undefined;
  /**
   * Shows a spinner and blocks activation while keeping the button focusable. Sets `aria-busy`
   * and `aria-disabled`.
   */
  loading?: boolean | undefined;
  /** Replaces the label while `loading` (not with `loadingPosition="center"`). */
  loadingText?: ReactNode;
  /**
   * Where the spinner goes while loading. `start`/`end` replace the matching icon; `center`
   * hides the content visually (it stays in the accessible name) and keeps the button's width.
   * @default 'start'
   */
  loadingPosition?: 'start' | 'end' | 'center' | undefined;
  /** Icon before the label. Decorative: it is hidden from assistive technology. */
  startIcon?: ReactNode;
  /** Icon after the label. Decorative: it is hidden from assistive technology. */
  endIcon?: ReactNode;
  /** Stretch to the width of the container. */
  fullWidth?: boolean | undefined;
  /** Disables the button. Native buttons get `disabled`; other elements `aria-disabled`. */
  disabled?: boolean | undefined;
  /**
   * Render the single child element instead of a `<button>`, merging Button's props and
   * classes into it, e.g. `<Button asChild><Link to="/">Home</Link></Button>`.
   */
  asChild?: boolean | undefined;
  children?: ReactNode;
}

/** Button props when rendered as `E` (`'button'` unless `as` is set). */
export type ButtonProps<E extends ElementType = 'button'> = PolymorphicProps<E, ButtonOwnProps>;

declare module '@awesome-ui/core' {
  interface ComponentOverrideMap {
    Button: ComponentOverride<ButtonProps, ButtonSlot>;
  }
}
