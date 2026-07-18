import useDebounce from '@/shared/hooks/use-debounce';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('should not update value before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'hello', delay: 500 },
      }
    );

    rerender({ value: 'world', delay: 500 });
    expect(result.current).toBe('hello');

    vi.advanceTimersByTime(250);
    expect(result.current).toBe('hello');
  });

  it('should update value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'hello', delay: 500 },
      }
    );

    rerender({ value: 'world', delay: 500 });
    expect(result.current).toBe('hello');

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('world');
  });

  it('should clean up timeout on unmount', () => {
    const spy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => useDebounce('hello', 500));

    unmount();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
