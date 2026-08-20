interface ILaunchDarklySynchronizingState {
  readonly status: 'synchronizing';
}

interface ILaunchDarklyReadyState {
  readonly status: 'ready';
}

interface ILaunchDarklyFailedState {
  readonly status: 'failed';
  readonly error: unknown;
}

export type ULaunchDarklyContextSynchronizationState =
  | ILaunchDarklySynchronizingState
  | ILaunchDarklyReadyState
  | ILaunchDarklyFailedState;
