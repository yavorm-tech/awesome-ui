import { useOptionalTheme } from '../theme/useTheme';
import { cn } from '../utils/tv';
import type { AnyComponentOverride, SlotClassNames, StyleProps } from './types';
import type { ComponentName } from './useComponentProps';

/** A `tv()` slot function as returned by `recipe(variantProps)`. */
type SlotFn = (options?: Record<string, unknown>) => string;

/**
 * Final class string per slot. Precedence (later wins on conflict):
 *
 * 1. the component recipe (`*.styles.ts`)
 * 2. theme `components[name].slots`
 * 3. theme `components[name].variants[prop][value]` for the current props
 * 4. instance `slotClassNames`
 * 5. instance `className` (root slot only)
 */
export function useSlotClasses<Slot extends string>(
  name: ComponentName,
  recipe: Record<Slot, SlotFn>,
  variantProps: Readonly<Record<string, unknown>>,
  { className, slotClassNames }: StyleProps<Slot>,
  rootSlot: Slot = 'root' as Slot,
): Record<Slot, string> {
  const override = useOptionalTheme()?.theme.components[name] as AnyComponentOverride | undefined;

  const variantClasses: SlotClassNames<string>[] = [];
  if (override?.variants) {
    for (const [prop, byValue] of Object.entries(override.variants)) {
      const value = variantProps[prop];
      if (value === undefined || value === null || !byValue) continue;
      const key = typeof value === 'boolean' ? String(value) : value;
      if (typeof key !== 'string') continue;
      const slots = byValue[key];
      if (slots) variantClasses.push(slots);
    }
  }

  const result = {} as Record<Slot, string>;
  for (const slot of Object.keys(recipe) as Slot[]) {
    result[slot] = cn(
      recipe[slot](),
      override?.slots?.[slot],
      variantClasses.map((v) => v[slot]),
      slotClassNames?.[slot],
      slot === rootSlot ? className : undefined,
    );
  }
  return result;
}
