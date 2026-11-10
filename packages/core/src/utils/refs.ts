import { type Ref, type RefCallback, useCallback, useInsertionEffect, useRef } from 'react';

type PossibleRef<T> = Ref<T> | undefined;

/** Assign `value` to a ref of any kind (callback or object). */
export function setRef<T>(ref: PossibleRef<T>, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

/** Combine several refs into one callback ref. */
export function mergeRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return (value) => {
    for (const ref of refs) setRef(ref, value);
  };
}

/**
 * `mergeRefs` as a stable callback ref. The refs are read when React attaches the element, so
 * the latest refs passed in always receive it.
 */
export function useMergedRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  const latest = useRef(refs);
  // Insertion effects run before React attaches refs in the same commit.
  useInsertionEffect(() => {
    latest.current = refs;
  });
  return useCallback((value: T | null) => {
    for (const ref of latest.current) setRef(ref, value);
  }, []);
}
