import { usePermittedPostingAccounts } from '@/account/hooks/use-permitted-posting-accounts';
import { useAccountingEntity } from '@/accounting/hooks/use-accounting-entity';
import { useCreateTransfer } from '@/journal-entries/hooks/use-create-transfer';
import { useRectifyJournalEntry } from '@/journal-entries/hooks/use-rectify-journal-entry';
import { journalEntryFormMapper } from '@/journal-entries/lib/mappers/journal-entry-form.mapper';
import { journalEntryMapper } from '@/journal-entries/lib/mappers/journal-entry.mapper';
import { useApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import { useExchangeRates } from '@/shared/hooks/use-exchange-rates';
import {
  EJournalEntrySourceType,
  ELedgerAccountSubType,
  type IJournalEntryListDto,
} from '@/shared/lib/api/Api';
import { fileUploadService } from '@/shared/lib/services/file-upload.service';
import type { IReactQueryOptions } from '@/shared/types/query-options.types';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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

interface CashTransferFormContainerProps {
  journalEntry?: IJournalEntryListDto;
}

export function CashTransferFormContainer({
  journalEntry,
}: Readonly<CashTransferFormContainerProps>) {
  const { t } = useTranslation<'journal-entries'>('journal-entries');
  const navigate = useNavigate();

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
  const { mutateAsync: rectifyJournalEntry, isPending: isRectifying } =
    useRectifyJournalEntry();
  const initialValues = useMemo(
    () =>
      journalEntry
        ? journalEntryFormMapper.toCashTransferFormValues(journalEntry)
        : undefined,
    [journalEntry]
  );

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
      if (journalEntry) {
        const attachments = values.attachment
          ? [await fileUploadService.uploadAttachment(values.attachment)]
          : journalEntry.attachments;
        const payload =
          journalEntryMapper.toTransferJournalEntryRectificationReq(
            values,
            functionalCurrencyCode,
            journalEntry,
            attachments
          );

        await rectifyJournalEntry({ id: journalEntry.id, payload });
        toast.success(t('journal_entry_updated_success_text'));
      } else {
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
      }
      navigate('/transactions');
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
      initialValues={initialValues}
      loading={isSubmittingTransfer || isCreatingTransfer || isRectifying}
      officialExchangeRate={officialExchangeRates?.[0]}
      onCurrencyContextChange={setCurrencyContext}
      onSubmit={handleSubmit}
      submitLabel={journalEntry ? t('journal_entry_update_text') : undefined}
    />
  );
}
