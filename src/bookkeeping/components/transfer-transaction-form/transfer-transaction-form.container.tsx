import { useLedgerAccounts } from '@/account/hooks/use-ledger-accounts';
import { useRecordTransferTransaction } from '@/bookkeeping/hooks/use-record-transfer-transaction';
import { useApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import { ELedgerAccountSubType } from '@/shared/lib/api/Api';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { ITransferTransactionFormValues } from './transfer-transaction-form';
import { TransferTransactionForm } from './transfer-transaction-form';

interface TransferTransactionFormContainerProps {
  sourceAccountId?: string;
  onSuccess: () => void;
}

export function TransferTransactionFormContainer({
  sourceAccountId,
  onSuccess,
}: Readonly<TransferTransactionFormContainerProps>) {
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
