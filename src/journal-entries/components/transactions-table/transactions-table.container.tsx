import { useJournalEntries } from '@/journal-entries/hooks/use-journal-entries';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useTableQueryParams } from '@/shared/hooks/use-table-query-params';
import {
  EJournalEntrySortBy,
  EPaginationSortDirection,
  type IGetJournalEntriesQuery,
} from '@/shared/lib/api/Api';
import { useCallback, useMemo } from 'react';
import { TransactionsTable } from './transactions-table';
import type { TransactionsTableContainerProps } from './types';

const TRANSACTIONS_PAGE_SIZE = 10;

export function TransactionsTableContainer({
  actionButton,
}: Readonly<TransactionsTableContainerProps>) {
  const tableQuery = useTableQueryParams<'effectiveDate'>({
    defaultSortKey: EJournalEntrySortBy.EffectiveDate,
    defaultSortDirection: EPaginationSortDirection.Desc,
  });
  const debouncedSearchQuery = useDebounce(tableQuery.searchQuery, 300);

  const query = useMemo<IGetJournalEntriesQuery>(
    () => ({
      page: tableQuery.page,
      limit: TRANSACTIONS_PAGE_SIZE,
      ...(debouncedSearchQuery ? { search: debouncedSearchQuery } : {}),
      orderBy: EJournalEntrySortBy.EffectiveDate,
      sortDirection: tableQuery.sortDirection ?? EPaginationSortDirection.Desc,
    }),
    [debouncedSearchQuery, tableQuery.page, tableQuery.sortDirection]
  );

  const { data: journalEntries, isPending } = useJournalEntries(query);

  const handleSortChange = useCallback(
    (_key: 'effectiveDate', direction: 'asc' | 'desc' | null) => {
      tableQuery.handleSortChange(
        EJournalEntrySortBy.EffectiveDate,
        direction ?? EPaginationSortDirection.Asc
      );
    },
    [tableQuery]
  );

  return (
    <TransactionsTable
      actionButton={actionButton}
      data={journalEntries?.data ?? []}
      loading={isPending}
      pagination={journalEntries?.meta}
      onPageChange={tableQuery.handlePageChange}
      onSortChange={handleSortChange}
      currentSortDirection={tableQuery.sortDirection}
      searchValue={tableQuery.searchQuery}
      onSearchChange={tableQuery.handleSearchChange}
    />
  );
}
