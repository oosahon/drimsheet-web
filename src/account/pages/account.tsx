import { AccountOverview } from '@/account/components/account-overview';
import { useLedgerAccount } from '@/account/hooks/use-ledger-account';
import { AppBody, AppHeader } from '@/shared/components/app';
import {
  type IPageBreadcrumb,
  PageBreadcrumbs,
} from '@/shared/components/page-breadcrumbs';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useTableQueryParams } from '@/shared/hooks/use-table-query-params';
import {
  type IAccountTransactionRes,
  type IPaginationDto,
} from '@/shared/lib/api/Api';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TransactionsTable } from '@/bookkeeping/components/transactions-table';
import { useAccountTransactions } from '@/bookkeeping/hooks/use-account-transactions';
import { useTranslation } from 'react-i18next';

export function AccountPage() {
  const { t } = useTranslation(['shared']);
  const { accountId } = useParams();
  const navigate = useNavigate();
  const tableQuery = useTableQueryParams<keyof IAccountTransactionRes>();
  const debouncedSearchQuery = useDebounce(tableQuery.searchQuery, 300);
  const [selectedRowIds, setSelectedRowIds] = useState<(string | number)[]>([]);
  const limit = 10;

  const transactionsQuery = useMemo<IPaginationDto>(() => {
    return {
      search: debouncedSearchQuery || undefined,
      orderBy: tableQuery.sortKey,
      sortDirection: tableQuery.sortDirection || undefined,
      page: tableQuery.page,
      limit,
    };
  }, [
    debouncedSearchQuery,
    tableQuery.sortKey,
    tableQuery.sortDirection,
    tableQuery.page,
  ]);

  const { data: account, isLoading: isLoadingAccount } =
    useLedgerAccount(accountId);

  const { data: transactions, isLoading: isLoadingTransactions } =
    useAccountTransactions({
      accountId,
      pagination: transactionsQuery,
    });

  const accountsLabel = t('shared:accounts');
  const new_transaction_label = t('shared:new_transaction');

  const accountName = account?.name ?? '';

  const breadcrumb: IPageBreadcrumb = {
    label: accountsLabel,
    link: '/accounts',
    next: {
      label: accountName,
      link: '#',
    },
  };

  return (
    <div>
      <AppHeader>
        <PageBreadcrumbs breadcrumb={breadcrumb} isLoading={isLoadingAccount} />
      </AppHeader>

      <AppBody>
        <div className="flex flex-col gap-10">
          {account && (
            <AccountOverview
              account={account}
              hideIcon
              actionButtonText={new_transaction_label}
              onActionButtonClick={() => navigate('/transactions')}
            />
          )}

          <TransactionsTable
            data={transactions?.data ?? []}
            loading={isLoadingTransactions}
            selectable
            selectedRowIds={selectedRowIds}
            onRowSelectionChange={setSelectedRowIds}
            pagination={transactions?.meta}
            onPageChange={tableQuery.handlePageChange}
            onSortChange={tableQuery.handleSortChange}
            currentSortKey={tableQuery.sortKey}
            currentSortDirection={tableQuery.sortDirection}
            searchValue={tableQuery.searchQuery}
            onSearchChange={tableQuery.handleSearchChange}
          />
        </div>
      </AppBody>
    </div>
  );
}
