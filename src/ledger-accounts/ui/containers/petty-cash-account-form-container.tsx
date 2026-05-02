import useCreatePettyCashAccount from '@/ledger-accounts/hooks/use-create-petty-cash-account';
import {
  PettyCashAccountForm,
  type IPettyCashAccountFormValues,
} from '@/ledger-accounts/ui/petty-cash-account-form';
import useApiErrorHandler from '@/shared/hooks/use-api-error-handler';

export default function PettyCashAccountFormContainer() {
  const handleApiError = useApiErrorHandler();
  const { mutateAsync: create, isPending } = useCreatePettyCashAccount();

  const handleSubmit = async (values: IPettyCashAccountFormValues) => {
    try {
      await create(values);
    } catch (error) {
      handleApiError(error, { showToast: true });
    }
  };

  return <PettyCashAccountForm loading={isPending} onSubmit={handleSubmit} />;
}
