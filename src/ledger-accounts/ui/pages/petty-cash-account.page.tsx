import useLedgerAccount from '@/ledger-accounts/hooks/api/use-ledger-account';
import { AppHeader } from '@/shared/ui/components/app';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/shared/ui/components/breadcrumb';
import { GradientBox } from '@/shared/ui/components/gradient-box';
import { Skeleton } from '@/shared/ui/components/skeleton';
import { Link, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

interface PageBreadCrumbsProps {
  accountName: string;
  isLoading?: boolean;
}

function PageBreadCrumbs({ accountName, isLoading }: PageBreadCrumbsProps) {
  // 5. third party library hooks
  const { t } = useTranslation(['shared']);

  // 14. early returns / guard clauses
  if (isLoading) {
    return <Skeleton className="w-25 h-3" />;
  }

  // 16. translations extraction
  const petty_cash_label = t('shared:petty_cash');

  // 17. ui element rendering
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link to="/accounts/petty-cash">{petty_cash_label}</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <Link to="#">{accountName}</Link>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default function PettyCashAccountPage() {
  const { accountId } = useParams();

  const { data: account, isLoading } = useLedgerAccount(accountId);

  const accountName = account?.name ?? '';

  return (
    <div>
      <AppHeader>
        <PageBreadCrumbs accountName={accountName} isLoading={isLoading} />
      </AppHeader>

      <div className="mt-6">
        <GradientBox className="max-w-xs">
          <div>{accountName}</div>
        </GradientBox>
      </div>
    </div>
  );
}
