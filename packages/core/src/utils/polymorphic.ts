import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ReactNode,
} from 'react';

/** The `ref` type of an element type, e.g. `HTMLAnchorElement` refs for `'a'`. */
export type PolymorphicRef<E extends ElementType> = ComponentPropsWithRef<E>['ref'];

/**
 * Props of a component rendered as `E`: the component's own props, an `as` prop and every prop
 * of `E` that the component does not define itself.
 */
export type PolymorphicProps<E extends ElementType, OwnProps = object> = OwnProps & {
  /** Element or component to render instead of the default. */
  as?: E | undefined;
} & Omit<ComponentPropsWithoutRef<E>, keyof OwnProps | 'as'>;

/** Call signature of a polymorphic, ref-forwarding component. */
export interface PolymorphicComponent<DefaultElement extends ElementType, OwnProps> {
  <E extends ElementType = DefaultElement>(
    props: PolymorphicProps<E, OwnProps> & { ref?: PolymorphicRef<E> },
  ): ReactNode;
  displayName?: string | undefined;
}
