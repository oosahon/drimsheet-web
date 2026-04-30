import useAccountingEntities from '@/accounting/hooks/use-accounting-entities';
import AccountingEntityCreationFormContainer from '@/accounting/ui/containers/accounting-entity-creation-form.container';
import { useMemo } from 'react';

export default function OnboardingManager() {
  const {
    data: accountingEntities,
    isLoading: isLoadingEntities,
    refetch,
  } = useAccountingEntities();

  const openAccountingOnboardingForm = useMemo(
    () => !accountingEntities?.length && !isLoadingEntities,
    [accountingEntities, isLoadingEntities]
  );

  const isLoading = isLoadingEntities;

  if (isLoading) return null;

  return (
    <>
      <AccountingEntityCreationFormContainer
        open={openAccountingOnboardingForm}
        done={refetch}
      />
    </>
  );
}
