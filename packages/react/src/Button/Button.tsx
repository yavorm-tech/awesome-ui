import {
  dataAttr,
  type PolymorphicComponent,
  Slot,
  useComponentProps,
  useSlotClasses,
} from '@awesome-ui/core';
import {
  Children,
  cloneElement,
  type ElementType,
  forwardRef,
  isValidElement,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import { Spinner } from '../internal/Spinner';
import { buttonStyles } from './Button.styles';
import type { ButtonOwnProps } from './Button.types';

/** Props seen inside the implementation: own props plus whatever the rendered element takes. */
interface ButtonImplProps extends ButtonOwnProps {
  as?: ElementType | undefined;
  type?: string | undefined;
  href?: string | undefined;
  tabIndex?: number | undefined;
  role?: string | undefined;
  onClick?: ((event: MouseEvent<HTMLElement>) => void) | undefined;
  onKeyDown?: ((event: KeyboardEvent<HTMLElement>) => void) | undefined;
  onKeyUp?: ((event: KeyboardEvent<HTMLElement>) => void) | undefined;
  [prop: string]: unknown;
}

type ChildElement = ReactElement<{ children?: ReactNode; href?: unknown; onClick?: unknown }>;

/** Tags that are interactive without help: they get no `role` or key handling from Button. */
const NATIVELY_INTERACTIVE = new Set(['button', 'a', 'input', 'summary']);

const ButtonImpl = forwardRef<HTMLElement, ButtonImplProps>(function Button(inProps, ref) {
  // forwardRef's `Omit<P, 'ref'>` erases named props on an index-signature type; restore them.
  const props = useComponentProps('Button', inProps as ButtonImplProps);
  const {
    as,
    asChild = false,
    variant = 'solid',
    color = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    loadingPosition = 'start',
    startIcon,
    endIcon,
    fullWidth = false,
    disabled = false,
    className,
    slotClassNames,
    children,
    type,
    href,
    tabIndex,
    role,
    onClick,
    onKeyDown,
    onKeyUp,
    ...rest
  } = props;

  const child = asChild ? (Children.only(children) as ChildElement) : null;
  if (asChild && !isValidElement(child)) {
    throw new Error('Button with `asChild` expects a single React element as its child.');
  }

  // What actually ends up in the DOM, as far as we can tell.
  const elementType: ElementType = child ? (child.type as ElementType) : (as ?? 'button');
  const isNativeButton = elementType === 'button';
  const isAnchor = elementType === 'a';
  const needsButtonRole = typeof elementType === 'string' && !NATIVELY_INTERACTIVE.has(elementType);
  const inactive = disabled || loading;
  const loadingCenter = loading && loadingPosition === 'center';

  const classes = useSlotClasses(
    'Button',
    buttonStyles({ variant, color, size, fullWidth, loadingCenter }),
    { variant, color, size, fullWidth, loading, disabled },
    { className, slotClassNames },
  );

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (inactive) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  // Elements given role="button" get the native keyboard behaviour: Enter on key down,
  // Space on key up (so a held Space can still be cancelled by moving focus).
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.target !== event.currentTarget) return;
    if (event.key === ' ') event.preventDefault();
    if (event.key === 'Enter' && !inactive) {
      event.preventDefault();
      event.currentTarget.click();
    }
  };
  const handleKeyUp = (event: KeyboardEvent<HTMLElement>) => {
    onKeyUp?.(event);
    if (event.defaultPrevented || event.target !== event.currentTarget) return;
    if (event.key === ' ' && !inactive) event.currentTarget.click();
  };

  const allRootProps: Record<string, unknown> = {
    ...rest,
    className: classes.root,
    'data-disabled': dataAttr(disabled),
    'data-loading': dataAttr(loading),
    'aria-busy': loading || undefined,
    'aria-disabled': loading || (disabled && !isNativeButton) || undefined,
    onClick: handleClick,
    onKeyDown,
    onKeyUp,
    role,
    tabIndex,
    href: isAnchor && inactive ? undefined : href,
  };

  if (isNativeButton) {
    allRootProps.type = type ?? 'button';
    allRootProps.disabled = disabled;
  } else {
    if (type !== undefined) allRootProps.type = type;
    if (inactive) allRootProps.tabIndex = -1;
  }
  if (needsButtonRole) {
    allRootProps.role = role ?? 'button';
    allRootProps.tabIndex = inactive ? -1 : (tabIndex ?? 0);
    allRootProps.onKeyDown = handleKeyDown;
    allRootProps.onKeyUp = handleKeyUp;
  }

  // Unset props must not clobber the child's own props (asChild) or a component's defaults.
  const rootProps = Object.fromEntries(
    Object.entries(allRootProps).filter(([, value]) => value !== undefined),
  );

  const content = (label: ReactNode) => {
    const spinner = <Spinner className={classes.spinner} />;
    const showLoadingText = loading && !loadingCenter && loadingText != null;
    return (
      <>
        {loading && loadingPosition === 'start'
          ? spinner
          : startIcon != null && (
              <span className={classes.startIcon} aria-hidden="true">
                {startIcon}
              </span>
            )}
        <span className={classes.label}>{showLoadingText ? loadingText : label}</span>
        {loading && loadingPosition === 'end'
          ? spinner
          : endIcon != null && (
              <span className={classes.endIcon} aria-hidden="true">
                {endIcon}
              </span>
            )}
        {loadingCenter && spinner}
      </>
    );
  };

  if (child) {
    // A disabled child must not run its own click handler or keep its link target.
    const overrides = inactive ? { onClick: undefined, href: undefined } : undefined;
    return (
      <Slot ref={ref} {...rootProps}>
        {cloneElement(child, overrides, content(child.props.children))}
      </Slot>
    );
  }

  const Component = as ?? 'button';
  return (
    <Component ref={ref} {...rootProps}>
      {content(children)}
    </Component>
  );
});

/**
 * Triggers an action. Renders a `<button>` by default; use `as` to render another element or
 * component, or `asChild` to style a child element such as a router link.
 *
 * Theme key: `Button`. Slots: `root`, `label`, `startIcon`, `endIcon`, `spinner`.
 */
export const Button = ButtonImpl as PolymorphicComponent<'button', ButtonOwnProps>;
Button.displayName = 'Button';
