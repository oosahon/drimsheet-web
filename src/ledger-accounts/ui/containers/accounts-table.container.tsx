import useLedgerAccounts from '@/ledger-accounts/hooks/api/use-ledger-accounts';
import ledgerAccountService from '@/ledger-accounts/services/ledger-account.service';
import { LedgerAccountsTable } from '@/ledger-accounts/ui/components/accounts-table';
import useDebounce from '@/shared/hooks/ui/use-debounce';
import {
  type IGetLedgerAccountsQuery,
  type ILedgerAccountDto,
  type ULedgerAccountSortBy,
} from '@/shared/utils/api/Api';
import { useMemo, useState } from 'react';

export default function LedgerAccountsTableContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedRowIds, setSelectedRowIds] = useState<(string | number)[]>([]);
  const [sortKey, setSortKey] = useState<keyof ILedgerAccountDto | undefined>(
    undefined
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );
  const [filters, setFilters] = useState<Record<string, (string | number)[]>>(
    {}
  );

  // 1. Build Query for Fetching Petty Cash Accounts
  const query = useMemo<IGetLedgerAccountsQuery>(() => {
    let orderBy: ULedgerAccountSortBy | undefined = undefined;

    if (sortKey === 'name') {
      orderBy = 'accountName';
    } else if (sortKey === 'createdAt') {
      orderBy = 'createdAt';
    } else if (sortKey === 'balance') {
      orderBy = 'balance';
    }

    const baseFilters = ledgerAccountService.getPettyBaseCashFilters();

    return {
      ...baseFilters,
      search: debouncedSearchQuery || undefined,
      orderBy,
      sortDirection: sortDirection || undefined,
    };
  }, [debouncedSearchQuery, sortKey, sortDirection]);

  // 2. Fetch data via standard hook
  const { data: accountsData, isLoading } = useLedgerAccounts(query);

  // 3. Client-side filtering (e.g. for status filters which may not be mapped on backend endpoint query)
  const filteredAccounts = useMemo(() => {
    let list = accountsData?.data ?? [];

    if (filters.status && filters.status.length > 0) {
      list = list.filter((item) => filters.status.includes(item.status));
    }

    return list;
  }, [accountsData?.data, filters]);

  // 5. Handlers
  const handleSortChange = (
    key: keyof ILedgerAccountDto,
    direction: 'asc' | 'desc' | null
  ) => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleFilterChange = (
    newFilters: Record<string, (string | number)[]>
  ) => {
    setFilters(newFilters);
  };

  return (
    <LedgerAccountsTable
      data={filteredAccounts}
      loading={isLoading}
      selectable
      selectedRowIds={selectedRowIds}
      onRowSelectionChange={setSelectedRowIds}
      onSortChange={handleSortChange}
      onFilterChange={handleFilterChange}
      currentSortKey={sortKey as string}
      currentSortDirection={sortDirection}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
}
