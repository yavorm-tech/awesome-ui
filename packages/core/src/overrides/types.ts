/**
 * Registry of overridable components. Each component package augments it:
 *
 * ```ts
 * declare module '@awesome-ui/core' {
 *   interface ComponentOverrideMap {
 *     Button: ComponentOverride<ButtonProps, ButtonSlot>;
 *   }
 * }
 * ```
 *
 * which makes `theme.components.Button` fully typed.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- augmented by component packages
export interface ComponentOverrideMap {}

/** Classes per slot, e.g. `{ root: 'shadow-lg', icon: 'size-5' }`. */
export type SlotClassNames<Slot extends string> = Partial<Record<Slot, string>>;

/** Prop values that can select a theme-level variant override. */
type VariantValue<V> = V extends string ? V : V extends boolean ? 'true' | 'false' : never;

/** `{ [prop]: { [value]: { [slot]: classes } } }`, for string-union and boolean props. */
export type VariantOverrides<Props, Slot extends string> = {
  [K in keyof Props]?: [VariantValue<NonNullable<Props[K]>>] extends [never]
    ? never
    : Partial<Record<VariantValue<NonNullable<Props[K]>>, SlotClassNames<Slot>>>;
};

/** Theme-level override for one component. */
export interface ComponentOverride<Props, Slot extends string> {
  /** Defaults applied under the props passed to the component. */
  defaultProps?: Partial<Props>;
  /** Classes added to each slot, after the component's own styles. */
  slots?: SlotClassNames<Slot>;
  /** Classes added to slots when a prop has a given value. */
  variants?: VariantOverrides<Props, Slot>;
}

/** Loose override shape, used for components not (yet) registered in `ComponentOverrideMap`. */
export interface AnyComponentOverride {
  defaultProps?: object;
  slots?: Partial<Record<string, string>>;
  variants?: Partial<Record<string, Partial<Record<string, Partial<Record<string, string>>>>>>;
}

/** `theme.components`: typed for registered components, loose for any other name. */
export type ThemeComponents = {
  [K in keyof ComponentOverrideMap]?: ComponentOverrideMap[K];
} & Partial<Record<string, AnyComponentOverride>>;

/** Instance-level styling props every component accepts. */
export interface StyleProps<Slot extends string> {
  /** Classes for the root slot. Wins over all other styling. */
  className?: string | undefined;
  /** Classes per slot. Wins over theme-level overrides. */
  slotClassNames?: SlotClassNames<Slot> | undefined;
}
