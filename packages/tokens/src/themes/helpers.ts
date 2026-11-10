import type { IntentRoles, Palette, PaletteStep } from '../types';

/** A role is either a step of the intent's own palette or a literal color. */
type RoleValue = PaletteStep | string;

export type RoleSpec = Record<keyof IntentRoles, RoleValue>;

/** Build an intent's roles from its palette. */
export function roles(palette: Palette, spec: RoleSpec): IntentRoles {
  const pick = (value: RoleValue) => (typeof value === 'number' ? palette[value] : value);
  return {
    solid: pick(spec.solid),
    solidHover: pick(spec.solidHover),
    onSolid: pick(spec.onSolid),
    soft: pick(spec.soft),
    onSoft: pick(spec.onSoft),
    outline: pick(spec.outline),
  };
}

export const WHITE = '#FFFFFF';
