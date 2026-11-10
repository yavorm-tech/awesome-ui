import { dataAttr, useComponentProps, useSlotClasses } from '@awesome-ui/core';
import { useMergedRefs } from '@awesome-ui/core';
import { type ChangeEvent, forwardRef, useId, useRef, useState } from 'react';

import { Input } from '../Input/Input';
import { useFormReset } from '../internal/useFormReset';
import { valueText } from '../internal/valueText';
import { textInputStyles } from './TextInput.styles';
import type { TextInputProps } from './TextInput.types';

/**
 * A labelled text field: `Input` plus label, helper text, error message, required marker and
 * character counter, wired up with `aria-describedby`, `aria-invalid` and `aria-errormessage`.
 *
 * `ref` and native attributes go to the `<input>`; `className` goes to the root.
 *
 * Theme key: `TextInput` (the inner field also uses the `Input` theme key). Slots: `root`,
 * `label`, `requiredMarker`, `field`, `input`, `footer`, `helperText`, `errorMessage`, `counter`.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(inProps, ref) {
    const props = useComponentProps('TextInput', inProps);
    const {
      label,
      helperText,
      errorMessage,
      invalid: invalidProp,
      required = false,
      showCount = false,
      id: idProp,
      size = 'md',
      disabled = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      className,
      slotClassNames,
      'aria-describedby': describedByProp,
      ...inputProps
    } = props;

    const autoId = useId();
    const id = idProp ?? autoId;
    const labelId = `${id}-label`;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const counterId = `${id}-counter`;

    const invalid = invalidProp ?? errorMessage != null;
    const showError = invalid && errorMessage != null;
    const showHelper = !showError && helperText != null;

    // The counter follows `value` when controlled, the typed text otherwise.
    const [uncontrolledLength, setUncontrolledLength] = useState(
      () => valueText(defaultValue).length,
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(ref, inputRef);
    useFormReset(inputRef, (resetValue) => {
      if (value === undefined) setUncontrolledLength(resetValue.length);
    });
    const count = value === undefined ? uncontrolledLength : valueText(value).length;
    const atLimit = maxLength !== undefined && count >= maxLength;

    const classes = useSlotClasses(
      'TextInput',
      textInputStyles({
        size,
        disabled,
        atLimit,
        hasFooter: showError || showHelper || showCount,
      }),
      { size, disabled, invalid, required, showCount },
      { className, slotClassNames },
    );

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) setUncontrolledLength(event.target.value.length);
      onChange?.(event);
    };

    const describedBy =
      [
        showError ? errorId : undefined,
        showHelper ? helperId : undefined,
        showCount ? counterId : undefined,
        describedByProp,
      ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div
        className={classes.root}
        data-invalid={dataAttr(invalid)}
        data-disabled={dataAttr(disabled)}
      >
        {label != null && (
          <label id={labelId} htmlFor={id} className={classes.label}>
            {label}
            {required && (
              <span className={classes.requiredMarker} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <Input
          {...inputProps}
          ref={mergedRef}
          id={id}
          size={size}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          invalid={invalid}
          aria-describedby={describedBy}
          aria-errormessage={showError ? errorId : undefined}
          className={classes.field}
          slotClassNames={{ input: classes.input }}
        />
        <div className={classes.footer}>
          {/* Always mounted so screen readers announce the message when it appears. */}
          <p id={errorId} className={classes.errorMessage} aria-live="polite">
            {showError ? errorMessage : null}
          </p>
          {showHelper && (
            <p id={helperId} className={classes.helperText}>
              {helperText}
            </p>
          )}
          {showCount && (
            <p id={counterId} className={classes.counter}>
              {maxLength === undefined ? count : `${String(count)}/${String(maxLength)}`}
            </p>
          )}
        </div>
      </div>
    );
  },
);
TextInput.displayName = 'TextInput';
