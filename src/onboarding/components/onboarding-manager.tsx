import AccountingOnboardingFormContainer from "@/onboarding/components/accounting-onboarding-form";
import useAccountingEntities from "@/accounting-entity/hooks/use-accounting-entities";
import { useEffect, useState } from "react";

const EOnboardingSteps = {
  None: "none",
  AccountingEntity: "accounting-entity",
} as const;

type UOnboardingStep = (typeof EOnboardingSteps)[keyof typeof EOnboardingSteps];

export default function OnboardingManager() {
  const [currentOnboardingStep, setCurrentOnboardingStep] =
    useState<UOnboardingStep | null>(null);

  const { data: accountingEntities, isLoading: isLoadingEntities } =
    useAccountingEntities();

  useEffect(() => {
    if (isLoadingEntities) return;

    if (!accountingEntities?.length) {
      setCurrentOnboardingStep(EOnboardingSteps.AccountingEntity);
    }
  }, [accountingEntities, isLoadingEntities]);

  const isLoading = isLoadingEntities;

  if (isLoading) return null;

  return (
    <>
      <AccountingOnboardingFormContainer
        open={currentOnboardingStep === EOnboardingSteps.AccountingEntity}
        onClose={() => setCurrentOnboardingStep(null)}
      />
    </>
  );
}
