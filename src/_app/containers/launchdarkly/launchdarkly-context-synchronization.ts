import type { ULaunchDarklyContextSynchronizationState } from '@/_app/containers/launchdarkly/types';
import { createContext, useContext } from 'react';

export const launchDarklySynchronizationState = {
  status: 'synchronizing',
} as const;

export const LaunchDarklyContextSynchronizationContext =
  createContext<ULaunchDarklyContextSynchronizationState>(
    launchDarklySynchronizationState
  );

export function useLaunchDarklyContextSynchronization() {
  return useContext(LaunchDarklyContextSynchronizationContext);
}
