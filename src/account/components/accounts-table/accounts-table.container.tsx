import { LedgerAccountsTable } from '@/account/components/accounts-table';
import useLedgerAccounts from '@/account/hooks/use-ledger-accounts';
import ledgerAccountService from '@/account/lib/ledger-account.service';
import useDebounce from '@/shared/hooks/ui/use-debounce';
import { useTableQueryParams } from '@/shared/hooks/ui/use-table-query-params';
import {
  type IGetLedgerAccountsQuery,
  type ILedgerAccountDto,
  type ULedgerAccountSortBy,
} from '@/shared/utils/api/Api';
import { useMemo, useState } from 'react';

interface LedgerAccountsTableContainerProps {
  onAddAccount: () => void;
}

export default function LedgerAccountsTableContainer({
  onAddAccount,
}: LedgerAccountsTableContainerProps) {
  const tableQuery = useTableQueryParams<keyof ILedgerAccountDto, 'status'>({
    filterKeys: ['status'],
  });

  const debouncedSearchQuery = useDebounce(tableQuery.searchQuery, 300);
  const [selectedRowIds, setSelectedRowIds] = useState<(string | number)[]>([]);
  const limit = 10;

  const query = useMemo<IGetLedgerAccountsQuery>(() => {
    const sortKeyMap: Partial<
      Record<keyof ILedgerAccountDto, ULedgerAccountSortBy>
    > = {
      name: 'accountName',
      createdAt: 'createdAt',
      balance: 'balance',
    };

    const orderBy = tableQuery.sortKey
      ? sortKeyMap[tableQuery.sortKey]
      : undefined;

    const baseFilters = ledgerAccountService.getPettyBaseCashFilters();

    return {
      ...baseFilters,
      search: debouncedSearchQuery || undefined,
      orderBy,
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

  const { data: accountsData, isLoading } = useLedgerAccounts(query);

  const filteredAccounts = useMemo(() => {
    let list = accountsData?.data ?? [];

    if (tableQuery.filters.status && tableQuery.filters.status.length > 0) {
      list = list.filter((item) =>
        tableQuery.filters.status.includes(item.status)
      );
    }

    return list;
  }, [accountsData?.data, tableQuery.filters]);

  return (
    <LedgerAccountsTable
      onAddAccount={onAddAccount}
      data={filteredAccounts}
      loading={isLoading}
      selectable
      selectedRowIds={selectedRowIds}
      onRowSelectionChange={setSelectedRowIds}
      onSortChange={tableQuery.handleSortChange}
      onFilterChange={tableQuery.handleFilterChange}
      currentSortKey={tableQuery.sortKey as string}
      currentSortDirection={tableQuery.sortDirection}
      searchValue={tableQuery.searchQuery}
      onSearchChange={tableQuery.handleSearchChange}
      filters={tableQuery.filters}
      pagination={accountsData?.meta}
      onPageChange={tableQuery.handlePageChange}
    />
  );
}
