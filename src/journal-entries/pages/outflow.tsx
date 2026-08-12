import { useLedgerAccounts } from '@/account/hooks/use-ledger-accounts';
import { useAccountingEntity } from '@/accounting/hooks/use-accounting-entity';
import {
  OutflowForm,
  type IOutflowFormValues,
} from '@/journal-entries/components/outflow-form';
import { AppBody, AppHeader } from '@/shared/components/app';
import { DocumentUpload } from '@/shared/components/document-upload';
import { EFileType } from '@/shared/components/document-upload/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const initialValues: IOutflowFormValues = {
  sourceAccountId: '',
  categoryAccountId: '',
  amount: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  exchangeRate: '',
  counterpartyName: '',
  description: '',
  createAnother: false,
};

export function OutflowPage() {
  const { t } = useTranslation('journal-entries');
  const { data: accountsData } = useLedgerAccounts({ limit: 100 });
  const { data: accountingEntity } = useAccountingEntity();
  const [values, setValues] = useState(initialValues);
  const [files, setFiles] = useState<File[]>([]);
  const upload_title = t('upload_title');
  const upload_description = t('upload_description');
  const upload_action = t('upload_action');
  return (
    <>
      <AppHeader />
      <AppBody>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
          <OutflowForm
            accounts={accountsData?.data ?? []}
            functionalCurrencyCode={
              accountingEntity?.functionalCurrencyCode ?? ''
            }
            values={values}
            onChange={setValues}
            onCreate={() => undefined}
          />
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
