import { dataAttr, useComponentProps, useMergedRefs, useSlotClasses } from '@awesome-ui/core';
import { type ChangeEvent, forwardRef, type MouseEvent, useRef, useState } from 'react';

import { CloseIcon } from '../internal/CloseIcon';
import { useFormReset } from '../internal/useFormReset';
import { valueText } from '../internal/valueText';
import { inputStyles } from './Input.styles';
import type { InputProps } from './Input.types';

/** Set an input's value the way the browser would, so React's `onChange` fires. */
function setNativeValue(input: HTMLInputElement, value: string) {
  // eslint-disable-next-line @typescript-eslint/unbound-method -- called with the input as `this`
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * A bare text field: the bordered box with optional adornments and a clear button. It has no
 * label; give it one with `aria-label` / `aria-labelledby`, or use `TextInput`.
 *
 * `ref`, `id`, `name`, `value` and every other native attribute go to the `<input>`;
 * `className` and `style` go to the root box.
 *
 * Theme key: `Input`. Slots: `root`, `input`, `startAdornment`, `endAdornment`, `clearButton`.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(inProps, ref) {
  const props = useComponentProps('Input', inProps);
  const {
    type = 'text',
    size = 'md',
    htmlSize,
    invalid = false,
    startAdornment,
    endAdornment,
    clearable = false,
    onClear,
    clearLabel = 'Clear',
    className,
    style,
    slotClassNames,
    disabled = false,
    readOnly = false,
    value,
    defaultValue,
    onChange,
    ...inputProps
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(ref, inputRef);

  // Uncontrolled fields: track emptiness to know whether to show the clear button.
  const [uncontrolledEmpty, setUncontrolledEmpty] = useState(() => valueText(defaultValue) === '');
  useFormReset(inputRef, (resetValue) => {
    if (value === undefined) setUncontrolledEmpty(resetValue === '');
  });
  const empty = value === undefined ? uncontrolledEmpty : valueText(value) === '';
  const showClear = clearable && !empty && !disabled && !readOnly;

  const classes = useSlotClasses(
    'Input',
    inputStyles({ size, invalid, disabled, readOnly, clearable }),
    { size, invalid, disabled, readOnly, clearable, type },
    { className, slotClassNames },
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setUncontrolledEmpty(event.target.value === '');
    onChange?.(event);
  };

  const handleClear = () => {
    const input = inputRef.current;
    if (!input) return;
    setNativeValue(input, '');
    onClear?.();
    input.focus();
  };

  // Clicking padding or an adornment focuses the field, like clicking a native input.
  const handleRootMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target === inputRef.current || target.closest('button, a, input, select, textarea')) {
      return;
    }
    event.preventDefault();
    inputRef.current?.focus();
  };

  return (
    // Pointer convenience only: keyboard users reach the input itself.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={classes.root}
      style={style}
      data-invalid={dataAttr(invalid)}
      data-disabled={dataAttr(disabled)}
      data-readonly={dataAttr(readOnly)}
      onMouseDown={handleRootMouseDown}
    >
      {startAdornment != null && <span className={classes.startAdornment}>{startAdornment}</span>}
      <input
        {...inputProps}
        ref={mergedRef}
        type={type}
        size={htmlSize}
        disabled={disabled}
        readOnly={readOnly}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        aria-invalid={invalid ? true : inputProps['aria-invalid']}
        className={classes.input}
      />
      {showClear && (
        <button
          type="button"
          className={classes.clearButton}
          aria-label={clearLabel}
          onClick={handleClear}
        >
          <CloseIcon />
        </button>
      )}
      {endAdornment != null && <span className={classes.endAdornment}>{endAdornment}</span>}
    </div>
  );
});
Input.displayName = 'Input';
