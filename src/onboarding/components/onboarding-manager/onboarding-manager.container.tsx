import { AccountingEntityCreationDialog } from '@/accounting/dialogs/accounting-entity-creation';
import { useAccountingEntities } from '@/accounting/hooks/use-accounting-entities';
import { useMemo } from 'react';

export function OnboardingManager() {
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
      <AccountingEntityCreationDialog
        open={openAccountingOnboardingForm}
        done={refetch}
      />
    </>
  );
}
