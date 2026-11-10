import type { ComponentOverride, StyleProps } from '@awesome-ui/core';
import type { ReactNode } from 'react';

import type { InputProps } from '../Input/Input.types';

/** Styleable parts of a TextInput. `field` and `input` style the inner Input. */
export type TextInputSlot =
  | 'root'
  | 'label'
  | 'requiredMarker'
  | 'field'
  | 'input'
  | 'footer'
  | 'helperText'
  | 'errorMessage'
  | 'counter';

export interface TextInputOwnProps extends StyleProps<TextInputSlot> {
  /** Help shown under the field. Replaced by `errorMessage` while the field is invalid. */
  helperText?: ReactNode;
  /** Shown under the field while it is invalid; announced politely when it appears. */
  errorMessage?: ReactNode;
  /** Marks the field invalid. @default Boolean(errorMessage) */
  invalid?: boolean | undefined;
  /** Shows a character counter (`count / maxLength`, or just the count). */
  showCount?: boolean | undefined;
}

type BaseProps = Omit<InputProps, keyof TextInputOwnProps> & TextInputOwnProps;

/** Every field needs an accessible name: a visible `label`, or `aria-label(ledby)`. */
type LabelProps =
  | {
      /** Visible label, rendered as a `<label>` for the input. */
      label: ReactNode;
    }
  | { label?: undefined; 'aria-label': string }
  | { label?: undefined; 'aria-labelledby': string };

export type TextInputProps = BaseProps & LabelProps;

declare module '@awesome-ui/core' {
  interface ComponentOverrideMap {
    TextInput: ComponentOverride<TextInputProps, TextInputSlot>;
  }
}
