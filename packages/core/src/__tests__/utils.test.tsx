import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ElementType, type MouseEvent } from 'react';

import { dataAttr } from '../utils/dataAttr';
import { mergeProps } from '../utils/mergeProps';
import type { PolymorphicProps } from '../utils/polymorphic';
import { mergeRefs, useMergedRefs } from '../utils/refs';
import { Slot } from '../utils/Slot';
import { useControllableState } from '../utils/useControllableState';

describe('mergeProps', () => {
  it('lets later props win and joins classes with conflict resolution', () => {
    expect(
      mergeProps(
        { id: 'a', className: 'p-2 rounded-control', title: 'x' },
        { id: 'b', className: 'p-4' },
      ),
    ).toEqual({ id: 'b', className: 'rounded-control p-4', title: 'x' });
  });

  it('merges styles', () => {
    expect(mergeProps({ style: { color: 'red', top: 0 } }, { style: { color: 'blue' } })).toEqual({
      style: { color: 'blue', top: 0 },
    });
  });

  it('chains handlers, later first, and skips earlier ones after preventDefault', () => {
    const calls: string[] = [];
    const merged = mergeProps(
      { onClick: () => calls.push('earlier') },
      {
        onClick: (event: { preventDefault: () => void; defaultPrevented: boolean }) => {
          calls.push('later');
          if (calls.length > 2) event.preventDefault();
        },
      },
    );
    const event = {
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
    };
    merged.onClick({ ...event });
    expect(calls).toEqual(['later', 'earlier']);
    merged.onClick(event);
    expect(calls).toEqual(['later', 'earlier', 'later']);
  });

  it('never drops a handler for an undefined one', () => {
    const onClick = vi.fn();
    expect(mergeProps({ onClick }, { onClick: undefined }).onClick).toBe(onClick);
  });
});

describe('refs', () => {
  it('mergeRefs assigns object and callback refs', () => {
    const objectRef = createRef<string>();
    const callback = vi.fn();
    mergeRefs(objectRef, callback, undefined)('value');
    expect(objectRef.current).toBe('value');
    expect(callback).toHaveBeenCalledWith('value');
  });

  it('useMergedRefs is stable while its refs are', () => {
    const ref = createRef<string>();
    const { result, rerender } = renderHook(() => useMergedRefs(ref));
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});

describe('Slot', () => {
  it('merges props, classes, styles, handlers and refs into its child', async () => {
    const slotRef = createRef<HTMLElement>();
    const childRef = createRef<HTMLAnchorElement>();
    const calls: string[] = [];
    render(
      <Slot
        ref={slotRef}
        className="p-2 text-fg"
        style={{ color: 'red', margin: 1 }}
        data-slot=""
        onClick={() => calls.push('slot')}
      >
        <a
          ref={childRef}
          href="#target"
          className="p-4"
          style={{ color: 'blue' }}
          onClick={(event: MouseEvent) => {
            event.preventDefault();
            calls.push('child');
          }}
        >
          Link
        </a>
      </Slot>,
    );
    const link = screen.getByRole('link', { name: 'Link' });
    expect(link).toHaveAttribute('href', '#target');
    expect(link).toHaveAttribute('data-slot');
    expect(link.className).toBe('text-fg p-4');
    expect(link.style.color).toBe('blue');
    expect(link.style.margin).toBe('1px');
    expect(slotRef.current).toBe(link);
    expect(childRef.current).toBe(link);

    await userEvent.click(link);
    // The child prevented default, so the Slot's handler is skipped.
    expect(calls).toEqual(['child']);
  });

  it('throws for non-element children', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Slot>text</Slot>)).toThrow(/single React element/);
    vi.mocked(console.error).mockRestore();
  });
});

describe('useControllableState', () => {
  it('works uncontrolled and reports changes', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 1, onChange }));
    act(() => {
      result.current[1]((n) => n + 1);
    });
    expect(result.current[0]).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('chains functional updates within one event', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 0, onChange }));
    act(() => {
      result.current[1]((n) => n + 1);
      result.current[1]((n) => n + 1);
    });
    expect(result.current[0]).toBe(2);
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it('works controlled: only onChange, the value comes from props', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: 0, onChange }),
      { initialProps: { value: 5 } },
    );
    act(() => {
      result.current[1](6);
    });
    expect(onChange).toHaveBeenCalledWith(6);
    expect(result.current[0]).toBe(5);
    rerender({ value: 6 });
    expect(result.current[0]).toBe(6);
  });

  it('skips onChange when the value does not change', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 'a', onChange }));
    act(() => {
      result.current[1]('a');
    });
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('dataAttr', () => {
  it('is present only when true', () => {
    expect(dataAttr(true)).toBe('');
    expect(dataAttr(false)).toBeUndefined();
    expect(dataAttr(undefined)).toBeUndefined();
  });
});

describe('PolymorphicProps', () => {
  interface Own {
    tone?: 'a' | 'b';
  }
  it('takes the props of the `as` element and keeps own props', () => {
    type AnchorProps = PolymorphicProps<'a', Own>;
    expectTypeOf<AnchorProps>().toHaveProperty('href');
    expectTypeOf<AnchorProps['tone']>().toEqualTypeOf<'a' | 'b' | undefined>();

    type ButtonProps = PolymorphicProps<'button', Own>;
    expectTypeOf<ButtonProps>().not.toHaveProperty('href');
    expectTypeOf<ButtonProps>().toHaveProperty('disabled');

    type Custom = (props: { to: string }) => null;
    expectTypeOf<PolymorphicProps<Custom, Own>>().toHaveProperty('to');
    expectTypeOf<PolymorphicProps<ElementType, Own>>().toHaveProperty('as');
  });
});
