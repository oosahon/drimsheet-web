import { usePermittedPostingAccounts } from '@/account/hooks/use-permitted-posting-accounts';
import { useAccountingEntity } from '@/accounting/hooks/use-accounting-entity';
import { useCounterparties } from '@/counterparty/hooks/use-counterparties';
import type {
  IInflowCurrencyContext,
  IInflowFormValues,
} from '@/journal-entries/components/inflow-form';
import {
  InflowForm,
  InflowFormSkeleton,
} from '@/journal-entries/components/inflow-form';
import { useCreateReceipt } from '@/journal-entries/hooks/use-create-receipt';
import { journalEntryMapper } from '@/journal-entries/lib/mappers/journal-entry.mapper';
import { AppBody, AppHeader } from '@/shared/components/app';
import { DocumentUpload } from '@/shared/components/document-upload';
import { EFileType } from '@/shared/components/document-upload/types';
import { useApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import { useExchangeRates } from '@/shared/hooks/use-exchange-rates';
import {
  EExchangeRateType,
  EJournalEntrySourceType,
  type IExchangeRateQueryParam,
} from '@/shared/lib/api/Api';
import { fileUploadService } from '@/shared/lib/services/file-upload.service';
import type { IReactQueryOptions } from '@/shared/types/query-options.types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const ALLOWED_DOC_UPLOAD = [
  EFileType.Png,
  EFileType.Jpg,
  EFileType.Jpeg,
  EFileType.Svg,
  EFileType.Pdf,
  EFileType.Xls,
  EFileType.Xlsx,
];

const requiredQueryOptions: IReactQueryOptions = {
  throwOnError: true,
};

function getExchangeRateQuery(
  currencyContext: IInflowCurrencyContext | undefined,
  functionalCurrencyCode: string
): IExchangeRateQueryParam | undefined {
  if (
    !currencyContext?.currencyCode ||
    !currencyContext.date ||
    !functionalCurrencyCode ||
    currencyContext.currencyCode === functionalCurrencyCode
  ) {
    return undefined;
  }

  return {
    currencyPair: `${currencyContext.currencyCode}/${functionalCurrencyCode}`,
    type: EExchangeRateType.Official,
    asOf: currencyContext.date,
    limit: 1,
  };
}

export function InflowPage() {
  const { t } = useTranslation('journal-entries');

  const handleApiError = useApiErrorHandler();

  const [currencyContext, setCurrencyContext] =
    useState<IInflowCurrencyContext>();
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);

  const {
    data: permittedDestinationAccounts,
    isPending: isPermittedDestinationAccountsPending,
  } = usePermittedPostingAccounts({
    sourceType: EJournalEntrySourceType.Receipt,
    side: 'destination',
    limit: 100,
    ...requiredQueryOptions,
  });

  const { data: permittedSourceAccounts, isPending: isSourceAccountsPending } =
    usePermittedPostingAccounts({
      sourceType: EJournalEntrySourceType.Receipt,
      side: 'source',
      limit: 100,
      ...requiredQueryOptions,
    });

  const { data: counterpartiesData, isPending: isCounterpartiesPending } =
    useCounterparties({ limit: 100, ...requiredQueryOptions });

  const { data: accountingEntity, isPending: isAccountingEntityPending } =
    useAccountingEntity(requiredQueryOptions);

  const functionalCurrencyCode = accountingEntity?.functionalCurrencyCode ?? '';

  const { data: officialExchangeRates } = useExchangeRates(
    getExchangeRateQuery(currencyContext, functionalCurrencyCode)
  );
  const { mutateAsync: createReceipt, isPending: isCreatingReceipt } =
    useCreateReceipt();

  const isFormDataPending =
    isPermittedDestinationAccountsPending ||
    isSourceAccountsPending ||
    isCounterpartiesPending ||
    isAccountingEntityPending;

  const handleSubmit = async (values: IInflowFormValues) => {
    if (isSubmittingReceipt) return;

    setIsSubmittingReceipt(true);

    try {
      const attachmentReferences = values.receipt
        ? [await fileUploadService.uploadFile(values.receipt)]
        : [];

      const payload = journalEntryMapper.toReceiptEntryReq(
        values,
        functionalCurrencyCode,
        new Date().toISOString(),
        attachmentReferences
      );

      await createReceipt(payload);
      toast.success(t('inflow_receipt_created_success_text'));
    } catch (error) {
      handleApiError(error, { showToast: true });
    } finally {
      setIsSubmittingReceipt(false);
    }
  };

  const upload_title = t('upload_title');
  const upload_description = t('upload_description');
  const upload_action = t('upload_action');

  return (
    <>
      <AppHeader />
      <AppBody>
        <div className="grid gap-20 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
          {isFormDataPending ? (
            <InflowFormSkeleton />
          ) : (
            <InflowForm
              destinationAccounts={permittedDestinationAccounts?.data ?? []}
              disabled={!functionalCurrencyCode}
              functionalCurrencyCode={functionalCurrencyCode}
              loading={isSubmittingReceipt || isCreatingReceipt}
              officialExchangeRate={officialExchangeRates?.[0]}
              onCurrencyContextChange={setCurrencyContext}
              payerOptions={counterpartiesData?.data ?? []}
              sourceAccounts={permittedSourceAccounts?.data ?? []}
              onSubmit={handleSubmit}
            />
          )}
          <DocumentUpload
            title={upload_title}
            description={upload_description}
            actionText={upload_action}
            value={files}
            onUpload={setFiles}
            allowMultiple
            accept={ALLOWED_DOC_UPLOAD}
          />
        </div>
      </AppBody>
    </>
  );
}
