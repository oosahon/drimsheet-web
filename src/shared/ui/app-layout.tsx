import { Outlet } from "react-router-dom";
import useAccountingEntities from "@/accounting-entity/hooks/use-accounting-entities";
import { OnboardingDialog } from "@/onboarding/ui/onboarding-dialog";

export function AppLayout() {
  const { data: accountingEntities } = useAccountingEntities();


  return (
    <>
      <Outlet />

      {!accountingEntities?.length ? <OnboardingDialog /> : null}
    </>
  );
}
