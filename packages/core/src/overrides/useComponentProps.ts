import { useOptionalTheme } from '../theme/useTheme';
import type { AnyComponentOverride, ComponentOverrideMap } from './types';

/** Name of a component that can be overridden from the theme. */
export type ComponentName = keyof ComponentOverrideMap | (string & {});

/**
 * Apply the theme's `defaultProps` for `name` underneath `props`. A prop explicitly passed as
 * `undefined` still receives the theme default.
 */
export function useComponentProps<P extends object>(name: ComponentName, props: P): P {
  const override = useOptionalTheme()?.theme.components[name] as AnyComponentOverride | undefined;
  const defaults = override?.defaultProps;
  if (!defaults) return props;
  const merged: Record<string, unknown> = { ...defaults };
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) merged[key] = value;
  }
  return merged as P;
}
