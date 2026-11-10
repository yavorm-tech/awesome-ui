import type { InputHTMLAttributes } from 'react';

/** The text an input shows for a `value` / `defaultValue` prop. */
export function valueText(value: InputHTMLAttributes<HTMLInputElement>['value']): string {
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return value.join(',');
}
