import { usePermittedPostingAccounts } from '@/account/hooks/use-permitted-posting-accounts';
import { useAccountingEntity } from '@/accounting/hooks/use-accounting-entity';
import { useCreateTransfer } from '@/journal-entries/hooks/use-create-transfer';
import { journalEntryMapper } from '@/journal-entries/lib/mappers/journal-entry.mapper';
import { useApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import { useExchangeRates } from '@/shared/hooks/use-exchange-rates';
import {
  EJournalEntrySourceType,
  ELedgerAccountSubType,
} from '@/shared/lib/api/Api';
import { fileUploadService } from '@/shared/lib/services/file-upload.service';
import type { IReactQueryOptions } from '@/shared/types/query-options.types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { CashTransferForm } from './cash-transfer-form';
import { CashTransferFormSkeleton } from './skeleton';
import type {
  ICashTransferCurrencyContext,
  ICashTransferFormValues,
} from './types';

const requiredQueryOptions: IReactQueryOptions = {
  throwOnError: true,
};

export function CashTransferFormContainer() {
  const { t } = useTranslation<'journal-entries'>('journal-entries');

  const [currencyContext, setCurrencyContext] =
    useState<ICashTransferCurrencyContext>();
  const [isSubmittingTransfer, setIsSubmittingTransfer] = useState(false);

  const handleApiError = useApiErrorHandler();

  const { data: permittedSources, isPending: isSourcesPending } =
    usePermittedPostingAccounts({
      sourceType: EJournalEntrySourceType.Transfer,
      side: 'source',
      limit: 100,
      ...requiredQueryOptions,
    });

  const { data: permittedDestinations, isPending: isDestinationsPending } =
    usePermittedPostingAccounts({
      sourceType: EJournalEntrySourceType.Transfer,
      side: 'destination',
      limit: 100,
      ...requiredQueryOptions,
    });

  const { data: accountingEntity, isPending: isAccountingEntityPending } =
    useAccountingEntity(requiredQueryOptions);

  const functionalCurrencyCode = accountingEntity?.functionalCurrencyCode ?? '';
  const exchangeRateQuery =
    journalEntryMapper.toTransferExchangeRateQuery(currencyContext);
  const { data: officialExchangeRates } = useExchangeRates(exchangeRateQuery);
  const { mutateAsync: createTransfer, isPending: isCreatingTransfer } =
    useCreateTransfer();

  const isFormDataPending =
    isSourcesPending || isDestinationsPending || isAccountingEntityPending;
  const permittedDestinationAccounts = permittedDestinations?.data ?? [];
  const destinationAccounts = permittedDestinationAccounts.filter(
    (account) => account.subType === ELedgerAccountSubType.CashAndCashEquivalent
  );
  const categories = permittedDestinationAccounts.filter(
    (account) => account.subType !== ELedgerAccountSubType.CashAndCashEquivalent
  );

  const handleSubmit = async (values: ICashTransferFormValues) => {
    if (isSubmittingTransfer) return;
    setIsSubmittingTransfer(true);

    try {
      const attachmentReferences = values.attachment
        ? [await fileUploadService.uploadFile(values.attachment)]
        : [];
      const payload = journalEntryMapper.toTransferEntryReq(
        values,
        functionalCurrencyCode,
        new Date().toISOString(),
        attachmentReferences
      );

      await createTransfer(payload);
      toast.success(t('transfer_created_success_text'));
    } catch (error) {
      handleApiError(error, { showToast: true });
    } finally {
      setIsSubmittingTransfer(false);
    }
  };

  if (isFormDataPending) return <CashTransferFormSkeleton />;

  return (
    <CashTransferForm
      sourceAccounts={permittedSources?.data ?? []}
      destinationAccounts={destinationAccounts}
      categories={categories}
      disabled={!functionalCurrencyCode}
      functionalCurrencyCode={functionalCurrencyCode}
      loading={isSubmittingTransfer || isCreatingTransfer}
      officialExchangeRate={officialExchangeRates?.[0]}
      onCurrencyContextChange={setCurrencyContext}
      onSubmit={handleSubmit}
    />
  );
}
