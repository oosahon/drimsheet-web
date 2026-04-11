import { Outlet } from "react-router-dom";
import OnboardingManager from "@/onboarding/components/onboarding-manager";

export function AppLayout() {
  return (
    <>
      <Outlet />

      <OnboardingManager />
    </>
  );
}
