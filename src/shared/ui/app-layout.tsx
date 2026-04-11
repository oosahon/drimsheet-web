import OnboardingManager from '@/onboarding/components/onboarding-manager';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <>
      <Outlet />

      <OnboardingManager />
    </>
  );
}
