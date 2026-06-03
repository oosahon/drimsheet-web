import useLedgerAccount from '@/ledger-accounts/hooks/api/use-ledger-account';
import { AccountOverview } from '@/ledger-accounts/ui/components/account-overview';
import { AppBody, AppHeader } from '@/shared/ui/components/app';
import {
  type IPageBreadcrumb,
  PageBreadcrumbs,
} from '@/shared/ui/components/page-breadcrumbs';
import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

export default function PettyCashAccountPage() {
  const { t } = useTranslation(['shared']);
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { data: account, isLoading } = useLedgerAccount(accountId);

  const petty_cash_label = t('shared:petty_cash');
  const new_transaction_label = t('shared:new_transaction');

  const accountName = account?.name ?? '';

  const breadcrumb: IPageBreadcrumb = {
    label: petty_cash_label,
    link: '/accounts/petty-cash',
    next: {
      label: accountName,
      link: '#',
    },
  };

  return (
    <div>
      <AppHeader>
        <PageBreadcrumbs breadcrumb={breadcrumb} isLoading={isLoading} />
      </AppHeader>

      <AppBody>
        {account && (
          <AccountOverview
            account={account}
            hideIcon
            actionButtonText={new_transaction_label}
            onActionButtonClick={() => navigate('transactions/new')}
          />
        )}
      </AppBody>
    </div>
  );
}
