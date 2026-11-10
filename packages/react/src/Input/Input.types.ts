import type { ComponentOverride, StyleProps } from '@awesome-ui/core';
import type { ControlSize } from '@awesome-ui/tokens';
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';

export const INPUT_TYPES = ['text', 'email', 'password', 'search', 'tel', 'url', 'number'] as const;
export type InputType = (typeof INPUT_TYPES)[number];
export type InputSize = ControlSize;

/** Styleable parts of an Input. */
export type InputSlot = 'root' | 'input' | 'startAdornment' | 'endAdornment' | 'clearButton';

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'className' | 'style' | 'children'
>;

export interface InputProps extends NativeInputProps, StyleProps<InputSlot> {
  /** Input type. Checkbox, radio, range, file and date inputs have their own components. */
  type?: InputType | undefined;
  /** Height, padding and font size, from the theme's density tokens. @default 'md' */
  size?: InputSize | undefined;
  /** The native `size` attribute (visible width in characters). */
  htmlSize?: number | undefined;
  /** Marks the value as invalid: sets `aria-invalid` and the danger styling. */
  invalid?: boolean | undefined;
  /** Content before the field, e.g. an icon or a prefix such as "https://". Presentational. */
  startAdornment?: ReactNode;
  /** Content after the field, e.g. a unit such as "kg". Presentational. */
  endAdornment?: ReactNode;
  /** Shows a button that clears the value while the field is not empty. */
  clearable?: boolean | undefined;
  /** Called after the clear button has cleared the value. `onChange` fires too. */
  onClear?: (() => void) | undefined;
  /** Accessible name of the clear button. @default 'Clear' */
  clearLabel?: string | undefined;
  /** Inline style for the root (the bordered box), e.g. CSS variable overrides. */
  style?: CSSProperties | undefined;
}

declare module '@awesome-ui/core' {
  interface ComponentOverrideMap {
    Input: ComponentOverride<InputProps, InputSlot>;
  }
}
