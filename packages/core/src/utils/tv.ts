import { CONTROL_SIZES, EASINGS, RADII, SHADOWS } from '@awesome-ui/tokens';
import {
  type ClassValue,
  createTV,
  cx,
  extendTailwindMerge,
  type TWMergeConfig,
} from 'tailwind-variants/config';

/**
 * Teaches the class merger about the token utilities Tailwind generates from
 * `@awesome-ui/tokens/theme.css`, so e.g. `rounded-control` and `rounded-none` are known to
 * conflict and the later one wins.
 */
export const twMergeConfig = {
  extend: {
    theme: {
      radius: RADII.filter((r) => r !== 'none' && r !== 'sm'),
      shadow: [...SHADOWS.filter((s) => !['sm', 'md', 'lg'].includes(s))],
      spacing: [
        ...CONTROL_SIZES.map((s) => `control-${s}`),
        ...CONTROL_SIZES.map((s) => `control-px-${s}`),
        'card-p',
      ],
      ease: [...EASINGS],
    },
  },
} satisfies TWMergeConfig;

const merge = extendTailwindMerge(twMergeConfig);

/**
 * Join class names (strings, arrays, conditional objects) and resolve Tailwind conflicts;
 * later classes win.
 */
export function cn(...classes: ClassValue[]): string {
  return merge(cx(...classes));
}

/** `tailwind-variants` configured with the library's merge rules. Use it in every `*.styles.ts`. */
export const tv = createTV({ twMergeConfig });

export type { ClassValue, VariantProps } from 'tailwind-variants/config';
