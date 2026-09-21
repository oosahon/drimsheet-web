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
import { journalEntryMapper } from '@/journal-entries/lib/mappers/journal-entry.mapper';
import { useApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import { useExchangeRates } from '@/shared/hooks/use-exchange-rates';
import { EJournalEntrySourceType } from '@/shared/lib/api/Api';
import { fileUploadService } from '@/shared/lib/services/file-upload.service';
import type { IReactQueryOptions } from '@/shared/types/query-options.types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const requiredQueryOptions: IReactQueryOptions = {
  throwOnError: true,
};

export function OutflowFormContainer() {
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

  const isFormDataPending =
    isPermittedAccountsPending ||
    isPermittedCategoriesPending ||
    isCounterpartiesPending ||
    isAccountingEntityPending;

  const handleSubmit = async (values: ICashTransactionFormValues) => {
    if (isSubmittingPayment) return;

    setIsSubmittingPayment(true);

    try {
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
      loading={isSubmittingPayment || isCreatingPayment}
      officialExchangeRate={officialExchangeRates?.[0]}
      onCurrencyContextChange={setCurrencyContext}
      onSubmit={handleSubmit}
      variant="outflow"
    />
  );
}
