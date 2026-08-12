import { useBoolVariation } from '@launchdarkly/react-sdk';

export const featureFlagKeys = {
  accessAlpha1: 'v_0_1_0_alpha_1',
} as const;

export function useCanAccessAlpha1() {
  return useBoolVariation(featureFlagKeys.accessAlpha1, false);
}
