import { type RefObject, useEffect, useRef } from 'react';

/**
 * Calls `onReset` with the input's value after its form is reset. Uncontrolled fields use it to
 * keep derived state (clear button, counter) in sync, since a reset fires no input events.
 */
export function useFormReset(
  inputRef: RefObject<HTMLInputElement | null>,
  onReset: (value: string) => void,
): void {
  const latest = useRef(onReset);
  useEffect(() => {
    latest.current = onReset;
  });

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handleReset = () => {
      // `reset` fires before the browser restores the default values.
      timer = setTimeout(() => {
        const input = inputRef.current;
        if (input) latest.current(input.value);
      });
    };
    form.addEventListener('reset', handleReset);
    return () => {
      form.removeEventListener('reset', handleReset);
      clearTimeout(timer);
    };
  }, [inputRef]);
}
