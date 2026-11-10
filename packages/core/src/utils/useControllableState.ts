import { useCallback, useInsertionEffect, useRef, useState } from 'react';

export interface UseControllableStateOptions<T> {
  /** Controlled value. `undefined` means uncontrolled. */
  value?: T | undefined;
  /** Initial value when uncontrolled. */
  defaultValue: T;
  /** Called with the new value whenever it changes, controlled or not. */
  onChange?: ((value: T) => void) | undefined;
}

type SetState<T> = (next: T | ((previous: T) => T)) => void;

/**
 * State that can be controlled (`value` + `onChange`) or uncontrolled (`defaultValue`). Every
 * stateful component uses it so both modes behave identically.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, SetState<T>] {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  // Latest values for the stable setter, synced before any effect or event handler can run.
  const latest = useRef({ current, isControlled, onChange });
  useInsertionEffect(() => {
    latest.current = { current, isControlled, onChange };
  });

  const setValue = useCallback<SetState<T>>((next) => {
    const state = latest.current;
    const resolved =
      typeof next === 'function' ? (next as (previous: T) => T)(state.current) : next;
    if (Object.is(resolved, state.current)) return;
    if (!state.isControlled) setInternal(resolved);
    // Keep functional updates chained within one event.
    latest.current = { ...state, current: resolved };
    state.onChange?.(resolved);
  }, []);

  return [current, setValue];
}
