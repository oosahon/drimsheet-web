import useAccountingEntities from '@/accounting-entity/hooks/use-accounting-entities';
import AccountingOnboardingFormContainer from '@/onboarding/components/accounting-onboarding-form';
import { useMemo } from 'react';

export default function OnboardingManager() {
  const { data: accountingEntities, isLoading: isLoadingEntities } =
    useAccountingEntities();

  const openAccountingOnboardingForm = useMemo(
    () => !accountingEntities?.length && !isLoadingEntities,
    [accountingEntities, isLoadingEntities]
  );

  const isLoading = isLoadingEntities;

  if (isLoading) return null;

  return (
    <>
      <AccountingOnboardingFormContainer open={openAccountingOnboardingForm} />
    </>
  );
}
