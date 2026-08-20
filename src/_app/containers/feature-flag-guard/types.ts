import type { UFeatureFlagKey } from '@/shared/hooks/use-feature-flag';
import type { PropsWithChildren } from 'react';

export interface IFeatureFlagGuardProps extends PropsWithChildren {
  readonly flagKeys: readonly UFeatureFlagKey[];
}
