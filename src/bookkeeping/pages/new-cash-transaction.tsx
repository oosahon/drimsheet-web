import useLedgerAccount from '@/account/hooks/use-ledger-account';
import { TransferTransactionFormContainer } from '@/bookkeeping/components/transfer-transaction-form';
import { AppHeader } from '@/shared/components/app';
import { DocumentUpload } from '@/shared/components/document-upload';
import { EFileType } from '@/shared/components/document-upload/types';
import { FieldSeparator } from '@/shared/components/field';
import {
  PageBreadcrumbs,
  type IPageBreadcrumb,
} from '@/shared/components/page-breadcrumbs';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

export default function NewCashTransactionPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['shared']);
  const { accountId } = useParams();
  const { data: account, isLoading } = useLedgerAccount(accountId);

  const accountName = account?.name ?? '';

  const petty_cash_label = t('petty_cash');
  const new_transaction = t('new_transaction');
  const or_text = t('or_text');

  const handleSuccess = () => {
    navigate(`/accounts/petty-cash/${account?.id}`);
  };

  const breadcrumb: IPageBreadcrumb = {
    label: petty_cash_label,
    link: '/accounts/petty-cash',
    next: {
      label: accountName,
      link: `/accounts/petty-cash/${account?.id}`,
      next: {
        label: new_transaction,
        link: '#',
      },
    },
  };

  return (
    <>
      <AppHeader>
        <PageBreadcrumbs breadcrumb={breadcrumb} isLoading={isLoading} />
      </AppHeader>
      <div className="w-2xl max-w-full m-auto">
        <DocumentUpload
          title=""
          description="Please upload a receipt or bank statement for this transaction."
          actionText="Upload document"
          accept={[EFileType.Image, EFileType.Pdf]}
          onUpload={() => {}}
        />

        <FieldSeparator className="my-20">{or_text}</FieldSeparator>
        <div className="max-w-sm m-auto">
          <TransferTransactionFormContainer
            sourceAccountId={accountId}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </>
  );
}
