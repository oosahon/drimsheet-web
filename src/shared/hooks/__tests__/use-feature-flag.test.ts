import {
  featureFlagKeys,
  useCanAccessAlpha1,
} from '@/shared/hooks/use-feature-flag';
import { useBoolVariation } from '@launchdarkly/react-sdk';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@launchdarkly/react-sdk', () => ({
  useBoolVariation: vi.fn(),
}));

describe('useCanAccessAlpha1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the access-alpha-1 flag value', () => {
    vi.mocked(useBoolVariation).mockReturnValue(true);

    const { result } = renderHook(() => useCanAccessAlpha1());

    expect(result.current).toBe(true);
    expect(useBoolVariation).toHaveBeenCalledWith(
      featureFlagKeys.accessAlpha1,
      false
    );
  });
});
