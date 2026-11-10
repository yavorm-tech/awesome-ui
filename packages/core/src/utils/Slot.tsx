import {
  Children,
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';

import { mergeProps } from './mergeProps';
import { useMergedRefs } from './refs';

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  /** Exactly one React element; it is rendered with the Slot's props merged into its own. */
  children?: ReactNode;
}

type ElementWithRef = ReactElement<{ ref?: Ref<unknown> }> & { ref?: Ref<unknown> };

/**
 * Read an element's ref without triggering React's "ref is not a prop" (18) or
 * "element.ref was removed" (19) warnings.
 */
function getElementRef(element: ElementWithRef): Ref<unknown> | undefined {
  const isWarningGetter = (owner: object, key: string) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method -- only reads a flag, never calls it
    const getter = Object.getOwnPropertyDescriptor(owner, key)?.get as
      { isReactWarning?: boolean } | undefined;
    return Boolean(getter?.isReactWarning);
  };
  // React 18: `props.ref` is a warning getter, the real ref lives on the element.
  if (isWarningGetter(element.props, 'ref')) return element.ref;
  // React 19: `element.ref` is a warning getter, the real ref lives in props.
  if (isWarningGetter(element, 'ref')) return element.props.ref;
  return element.props.ref ?? element.ref;
}

/**
 * Renders its single child element with the Slot's props merged in. Powers `asChild`: the child
 * keeps its own element type and props; classes are joined, styles merged, event handlers
 * chained (the child's runs first) and refs composed. Child props win on conflicts.
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  forwardedRef,
) {
  const child = Children.only(children);
  const childRef = isValidElement(child) ? getElementRef(child as ElementWithRef) : undefined;
  const ref = useMergedRefs(forwardedRef, childRef);

  if (!isValidElement<Record<string, unknown>>(child)) {
    throw new Error('Slot (asChild) expects a single React element as its child.');
  }

  return cloneElement(child, { ...mergeProps(slotProps, child.props), ref });
});
