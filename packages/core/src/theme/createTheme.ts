import type { ThemeTokens } from '@awesome-ui/tokens';

import type { AnyComponentOverride, ThemeComponents } from '../overrides/types';
import { deepMerge } from '../utils/deepMerge';
import { cn } from '../utils/tv';
import type { Theme, ThemeOverrides } from './types';

const NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

type ClassMap = Partial<Record<string, string>>;

/** Combine two slot→classes maps; classes for the same slot are joined (later wins on conflict). */
function mergeClassMaps(a: ClassMap | undefined, b: ClassMap | undefined): ClassMap | undefined {
  if (!a) return b;
  if (!b) return a;
  const out: ClassMap = { ...a };
  for (const [slot, classes] of Object.entries(b)) out[slot] = cn(out[slot], classes);
  return out;
}

function mergeOverride(
  a: AnyComponentOverride | undefined,
  b: AnyComponentOverride | undefined,
): AnyComponentOverride | undefined {
  if (!a) return b;
  if (!b) return a;
  const variants: NonNullable<AnyComponentOverride['variants']> = { ...a.variants };
  for (const [prop, values] of Object.entries(b.variants ?? {})) {
    const merged: Partial<Record<string, ClassMap>> = { ...variants[prop] };
    for (const [value, slots] of Object.entries(values ?? {})) {
      merged[value] = mergeClassMaps(merged[value], slots);
    }
    variants[prop] = merged;
  }
  const result: AnyComponentOverride = {
    defaultProps: { ...a.defaultProps, ...b.defaultProps },
    variants,
  };
  const slots = mergeClassMaps(a.slots, b.slots);
  if (slots) result.slots = slots;
  return result;
}

function mergeComponents(a: ThemeComponents, b: ThemeComponents | undefined): ThemeComponents {
  if (!b) return a;
  const out: Partial<Record<string, AnyComponentOverride>> = { ...a };
  for (const [name, override] of Object.entries(b)) {
    out[name] = mergeOverride(out[name], override);
  }
  return out;
}

/**
 * Create a theme from a base theme. Tokens are deep-merged; component overrides are merged per
 * component (default props shallowly, slot classes joined so both apply).
 *
 * ```ts
 * const brand = createTheme(flowbite, {
 *   name: 'brand',
 *   tokens: { shared: { radii: { control: '0.25rem' } } },
 *   components: { Button: { defaultProps: { variant: 'outline' } } },
 * });
 * ```
 */
export function createTheme(base: Theme, overrides: ThemeOverrides): Theme {
  if (!NAME_PATTERN.test(overrides.name)) {
    throw new Error(
      `createTheme: invalid theme name "${overrides.name}". Use lowercase letters, digits and dashes, starting with a letter.`,
    );
  }
  return {
    name: overrides.name,
    tokens: deepMerge<ThemeTokens>(base.tokens, overrides.tokens),
    components: mergeComponents(base.components, overrides.components),
  };
}
