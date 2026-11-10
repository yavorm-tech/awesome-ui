import type { CSSProperties } from 'react';

import { cn } from './tv';

type AnyProps = Record<string, unknown>;
type AnyHandler = (...args: unknown[]) => unknown;

/** Type of merging `T` left to right: later objects' keys replace earlier ones. */
type MergeAll<T extends readonly AnyProps[], Acc = object> = T extends readonly [
  infer Head,
  ...infer Rest extends readonly AnyProps[],
]
  ? MergeAll<Rest, Omit<Acc, keyof Head> & Head>
  : Acc;

const isHandlerName = (key: string) => /^on[A-Z]/.test(key);

function isDefaultPrevented(event: unknown): boolean {
  return (
    typeof event === 'object' &&
    event !== null &&
    'defaultPrevented' in event &&
    event.defaultPrevented === true
  );
}

/**
 * Merge several props objects; later objects win, except:
 *
 * - `className` values are joined with `cn` (later classes win conflicts),
 * - `style` objects are shallow-merged,
 * - event handlers (`on*`) are chained. The handler from the **later** object runs first, and
 *   earlier handlers are skipped if it calls `event.preventDefault()`.
 *
 * `undefined` values in later objects override earlier ones.
 */
export function mergeProps<T extends AnyProps[]>(...propsList: T): MergeAll<T> {
  const result: AnyProps = {};
  for (const props of propsList) {
    for (const [key, value] of Object.entries(props)) {
      const existing = result[key];
      if (key === 'className') {
        result[key] = cn(existing as string | undefined, value as string | undefined) || undefined;
      } else if (key === 'style') {
        result[key] =
          existing || value
            ? {
                ...(existing as CSSProperties | undefined),
                ...(value as CSSProperties | undefined),
              }
            : undefined;
      } else if (
        isHandlerName(key) &&
        typeof existing === 'function' &&
        typeof value === 'function'
      ) {
        const earlier = existing as AnyHandler;
        const later = value as AnyHandler;
        result[key] = (...args: unknown[]) => {
          later(...args);
          if (!isDefaultPrevented(args[0])) earlier(...args);
        };
      } else if (isHandlerName(key) && value === undefined && typeof existing === 'function') {
        // An undefined handler never removes an earlier one.
      } else {
        result[key] = value;
      }
    }
  }
  return result as MergeAll<T>;
}
