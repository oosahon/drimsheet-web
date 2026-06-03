import useRecordTransferTransaction from '@/bookkeeping/hooks/api/use-record-transfer-transaction';
import type { ITransferTransactionFormValues } from '@/bookkeeping/ui/components/transfer-transaction-form';
import { TransferTransactionForm } from '@/bookkeeping/ui/components/transfer-transaction-form';
import useLedgerAccounts from '@/ledger-accounts/hooks/api/use-ledger-accounts';
import useApiErrorHandler from '@/shared/hooks/use-api-error-handler';
import { ELedgerAccountSubType } from '@/shared/utils/api/Api';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface TransferTransactionFormContainerProps {
  sourceAccountId?: string;
  onSuccess: () => void;
}

export default function TransferTransactionFormContainer({
  sourceAccountId,
  onSuccess,
}: TransferTransactionFormContainerProps) {
  const { data: accountsData, isLoading } = useLedgerAccounts({
    limit: 100,
    subType: ELedgerAccountSubType.CashAndCashEquivalent,
    isControlAccount: false,
  });

  const { mutateAsync: recordTransferTransaction, isPending } =
    useRecordTransferTransaction();

  const handleApiError = useApiErrorHandler();

  const { t } = useTranslation('bookkeeping');

  const handleSubmit = async (values: ITransferTransactionFormValues) => {
    try {
      await recordTransferTransaction(values);
      toast.success(t('transfer_transaction_recorded_success_text'));
      onSuccess();
    } catch (error) {
      handleApiError(error, { showToast: true });
    }
  };

  return (
    <TransferTransactionForm
      accounts={accountsData?.data ?? []}
      onSubmit={handleSubmit}
      loading={isLoading || isPending}
      sourceAccountId={sourceAccountId}
    />
  );
}
