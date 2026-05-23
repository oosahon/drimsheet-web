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

interface PageBreadCrumbsProps {
  accountName: string;
  isLoading?: boolean;
}

function PageBreadCrumbs({ accountName, isLoading }: PageBreadCrumbsProps) {
  if (isLoading) {
    return <Skeleton className="w-25 h-3" />;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link to="/accounts/petty-cash">Petty cash</Link>
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
