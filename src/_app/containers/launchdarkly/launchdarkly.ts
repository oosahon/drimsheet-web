import { createLDReactProvider, type LDContext } from '@launchdarkly/react-sdk';

export const anonymousLaunchDarklyContext: LDContext = {
  kind: 'user',
  anonymous: true,
};

export const LaunchDarklyProvider = createLDReactProvider(
  import.meta.env.VITE_LAUNCHDARKLY_KEY,
  anonymousLaunchDarklyContext,
  import.meta.env.MODE === 'integration'
    ? {
        ldOptions: {
          fetchGoals: false,
          streaming: false,
        },
      }
    : undefined
);
