import { usePermittedPostingAccounts } from '@/account/hooks/use-permitted-posting-accounts';
import { useAccountingEntity } from '@/accounting/hooks/use-accounting-entity';
import { useCounterparties } from '@/counterparty/hooks/use-counterparties';
import {
  CashTransactionForm,
  CashTransactionFormSkeleton,
  type ICashTransactionCurrencyContext,
  type ICashTransactionFormValues,
} from '@/journal-entries/components/cash-transaction-form';
import { useCreatePayment } from '@/journal-entries/hooks/use-create-payment';
import { useRectifyJournalEntry } from '@/journal-entries/hooks/use-rectify-journal-entry';
import { journalEntryFormMapper } from '@/journal-entries/lib/mappers/journal-entry-form.mapper';
import { journalEntryMapper } from '@/journal-entries/lib/mappers/journal-entry.mapper';
import { useApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import { useExchangeRates } from '@/shared/hooks/use-exchange-rates';
import {
  EJournalEntrySourceType,
  type IJournalEntryListDto,
} from '@/shared/lib/api/Api';
import { fileUploadService } from '@/shared/lib/services/file-upload.service';
import type { IReactQueryOptions } from '@/shared/types/query-options.types';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const requiredQueryOptions: IReactQueryOptions = {
  throwOnError: true,
};

interface OutflowFormContainerProps {
  journalEntry?: IJournalEntryListDto;
}

export function OutflowFormContainer({
  journalEntry,
}: Readonly<OutflowFormContainerProps>) {
  const { t } = useTranslation<'journal-entries'>('journal-entries');
  const navigate = useNavigate();

  const [currencyContext, setCurrencyContext] =
    useState<ICashTransactionCurrencyContext>();
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const handleApiError = useApiErrorHandler();

  const { data: permittedAccounts, isPending: isPermittedAccountsPending } =
    usePermittedPostingAccounts({
      sourceType: EJournalEntrySourceType.Payment,
      side: 'source',
      filterSuspense: true,
      limit: 100,
      ...requiredQueryOptions,
    });

  const { data: permittedCategories, isPending: isPermittedCategoriesPending } =
    usePermittedPostingAccounts({
      sourceType: EJournalEntrySourceType.Payment,
      side: 'destination',
      filterSuspense: true,
      limit: 100,
      ...requiredQueryOptions,
    });

  const { data: counterpartiesData, isPending: isCounterpartiesPending } =
    useCounterparties({ limit: 100, ...requiredQueryOptions });

  const { data: accountingEntity, isPending: isAccountingEntityPending } =
    useAccountingEntity(requiredQueryOptions);

  const functionalCurrencyCode = accountingEntity?.functionalCurrencyCode ?? '';
  const exchangeRateQuery = journalEntryMapper.toExchangeRateQuery(
    currencyContext,
    functionalCurrencyCode
  );
  const { data: officialExchangeRates } = useExchangeRates(exchangeRateQuery);
  const { mutateAsync: createPayment, isPending: isCreatingPayment } =
    useCreatePayment();
  const { mutateAsync: rectifyJournalEntry, isPending: isRectifying } =
    useRectifyJournalEntry();
  const initialValues = useMemo(
    () =>
      journalEntry
        ? journalEntryFormMapper.toCashTransactionFormValues(
            journalEntry,
            functionalCurrencyCode
          )
        : undefined,
    [functionalCurrencyCode, journalEntry]
  );

  const isFormDataPending =
    isPermittedAccountsPending ||
    isPermittedCategoriesPending ||
    isCounterpartiesPending ||
    isAccountingEntityPending;

  const handleSubmit = async (values: ICashTransactionFormValues) => {
    if (isSubmittingPayment) return;

    setIsSubmittingPayment(true);

    try {
      if (journalEntry) {
        const attachments = values.attachment
          ? [await fileUploadService.uploadAttachment(values.attachment)]
          : journalEntry.attachments;
        const payload =
          journalEntryMapper.toPaymentJournalEntryRectificationReq(
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
        const payload = journalEntryMapper.toPaymentEntryReq(
          values,
          functionalCurrencyCode,
          new Date().toISOString(),
          attachmentReferences
        );

        await createPayment(payload);
        toast.success(t('outflow_payment_created_success_text'));
      }
      navigate('/transactions');
    } catch (error) {
      handleApiError(error, { showToast: true });
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  if (isFormDataPending) return <CashTransactionFormSkeleton />;

  return (
    <CashTransactionForm
      accounts={permittedAccounts?.data ?? []}
      categories={permittedCategories?.data ?? []}
      counterpartyOptions={counterpartiesData?.data ?? []}
      disabled={!functionalCurrencyCode}
      functionalCurrencyCode={functionalCurrencyCode}
      initialValues={initialValues}
      loading={isSubmittingPayment || isCreatingPayment || isRectifying}
      officialExchangeRate={officialExchangeRates?.[0]}
      onCurrencyContextChange={setCurrencyContext}
      onSubmit={handleSubmit}
      submitLabel={journalEntry ? t('journal_entry_update_text') : undefined}
      variant="outflow"
    />
  );
}
