import {
  PettyCashAccountForm,
  type IPettyCashAccountFormValues,
} from '@/account/components/petty-cash-account-form';
import useCreatePettyCashAccount from '@/account/hooks/use-create-petty-cash-account';
import useApiErrorHandler from '@/shared/hooks/use-api-error-handler';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface PettyCashAccountFormContainerProps {
  onSuccess?: () => void;
}

export default function PettyCashAccountFormContainer({
  onSuccess,
}: PettyCashAccountFormContainerProps) {
  const handleApiError = useApiErrorHandler();
  const { mutateAsync: create, isPending } = useCreatePettyCashAccount();
  const { t } = useTranslation(['ledger-accounts']);

  const handleSubmit = async (values: IPettyCashAccountFormValues) => {
    try {
      await create(values);
      toast.success(t('petty_cash_account_created_success_text'));
      onSuccess?.();
    } catch (error) {
      handleApiError(error, { showToast: true });
    }
  };

  return <PettyCashAccountForm loading={isPending} onSubmit={handleSubmit} />;
}
