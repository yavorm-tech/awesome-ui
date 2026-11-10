/**
 * Value for a boolean `data-*` attribute: present (`""`) when true, absent otherwise. Lets
 * styles use Tailwind's `data-loading:` style variants.
 */
export function dataAttr(condition: boolean | undefined): '' | undefined {
  return condition ? '' : undefined;
}
