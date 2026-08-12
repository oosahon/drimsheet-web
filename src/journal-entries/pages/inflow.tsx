import { usePermittedPostingAccounts } from '@/account/hooks/use-permitted-posting-accounts';
import { useAccountingEntity } from '@/accounting/hooks/use-accounting-entity';
import { useCounterparties } from '@/counterparty/hooks/use-counterparties';
import type { IInflowFormValues } from '@/journal-entries/components/inflow-form';
import {
  InflowForm,
  InflowFormSkeleton,
} from '@/journal-entries/components/inflow-form';
import { useCreateReceipt } from '@/journal-entries/hooks/use-create-receipt';
import { AppBody, AppHeader } from '@/shared/components/app';
import { DocumentUpload } from '@/shared/components/document-upload';
import { EFileType } from '@/shared/components/document-upload/types';
import { useApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import { EJournalEntrySourceType } from '@/shared/lib/api/Api';
import type { IReactQueryOptions } from '@/shared/types/query-options.types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const requiredQueryOptions: IReactQueryOptions = {
  throwOnError: true,
};

export function InflowPage() {
  const { t } = useTranslation('journal-entries');
  const handleApiError = useApiErrorHandler();

  const {
    data: permittedDestinationAccounts,
    isPending: isPermittedDestinationAccountsPending,
  } = usePermittedPostingAccounts({
    sourceType: EJournalEntrySourceType.Receipt,
    side: 'destination',
    limit: 100,
    ...requiredQueryOptions,
  });
  const {
    data: permittedCategoryAccounts,
    isPending: isCategoryAccountsPending,
  } = usePermittedPostingAccounts({
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
  const { mutateAsync: createReceipt, isPending: isCreatingReceipt } =
    useCreateReceipt(functionalCurrencyCode);

  const [files, setFiles] = useState<File[]>([]);

  const isFormDataPending =
    isPermittedDestinationAccountsPending ||
    isCategoryAccountsPending ||
    isCounterpartiesPending ||
    isAccountingEntityPending;

  const handleSubmit = async (values: IInflowFormValues) => {
    try {
      await createReceipt(values);
      toast.success(t('inflow_receipt_created_success_text'));
    } catch (error) {
      handleApiError(error, { showToast: true });
    }
  };

  const upload_title = t('upload_title');
  const upload_description = t('upload_description');
  const upload_action = t('upload_action');

  return (
    <>
      <AppHeader />
      <AppBody>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
          {isFormDataPending ? (
            <InflowFormSkeleton />
          ) : (
            <InflowForm
              destinationAccounts={permittedDestinationAccounts?.data ?? []}
              disabled={!functionalCurrencyCode}
              functionalCurrencyCode={functionalCurrencyCode}
              loading={isCreatingReceipt}
              payerOptions={counterpartiesData?.data ?? []}
              sourceAccounts={permittedCategoryAccounts?.data ?? []}
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
            accept={[
              EFileType.Png,
              EFileType.Jpg,
              EFileType.Jpeg,
              EFileType.Svg,
              EFileType.Pdf,
              EFileType.Xls,
              EFileType.Xlsx,
            ]}
          />
        </div>
      </AppBody>
    </>
  );
}
