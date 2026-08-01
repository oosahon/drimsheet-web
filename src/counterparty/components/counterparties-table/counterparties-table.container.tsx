import { useCounterparties } from '@/counterparty/hooks/use-counterparties';
import { counterpartyMapper } from '@/counterparty/lib/mappers/counterparty.mapper';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useTableQueryParams } from '@/shared/hooks/use-table-query-params';
import type { ICounterpartyDto } from '@/shared/lib/api/Api';
import { useMemo, useState } from 'react';
import { CounterpartiesTable } from './counterparties-table';

interface CounterpartiesTableContainerProps {
  onAddCounterparty: () => void;
}

export function CounterpartiesTableContainer({
  onAddCounterparty,
}: Readonly<CounterpartiesTableContainerProps>) {
  const tableQuery = useTableQueryParams<keyof ICounterpartyDto, string>({
    filterKeys: ['status', 'type', 'roles'],
  });

  const debouncedSearchQuery = useDebounce(tableQuery.searchQuery, 300);
  const [selectedRowIds, setSelectedRowIds] = useState<(string | number)[]>([]);
  const limit = 10;

  const query = useMemo(
    () =>
      counterpartyMapper.toGetCounterpartiesQuery({
        search: debouncedSearchQuery,
        page: tableQuery.page,
        limit,
        sortKey: tableQuery.sortKey,
        sortDirection: tableQuery.sortDirection,
        filters: tableQuery.filters,
      }),
    [
      debouncedSearchQuery,
      tableQuery.filters,
      tableQuery.page,
      tableQuery.sortDirection,
      tableQuery.sortKey,
    ]
  );

  const { data: counterpartiesData, isLoading } = useCounterparties(query);

  return (
    <CounterpartiesTable
      onAddCounterparty={onAddCounterparty}
      data={counterpartiesData?.data ?? []}
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
      pagination={counterpartiesData?.meta}
      onPageChange={tableQuery.handlePageChange}
    />
  );
}
