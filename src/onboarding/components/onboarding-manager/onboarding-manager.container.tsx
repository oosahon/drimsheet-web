import { AccountingEntityCreationDialog } from '@/accounting/dialogs/accounting-entity-creation';
import { useAccountingEntities } from '@/accounting/hooks/use-accounting-entities';

export function OnboardingManagerContainer() {
  const {
    data: accountingEntities,
    isLoading: isLoadingEntities,
    refetch,
  } = useAccountingEntities();

  const openAccountingOnboardingForm = accountingEntities?.length === 0;

  const handleDone = async () => {
    const result = await refetch();

    if (!result.data?.length) {
      throw (
        result.error ?? new Error('Accounting entity refresh returned empty')
      );
    }
  };

  if (isLoadingEntities) return null;

  return (
    <AccountingEntityCreationDialog
      open={openAccountingOnboardingForm}
      done={handleDone}
    />
  );
}
