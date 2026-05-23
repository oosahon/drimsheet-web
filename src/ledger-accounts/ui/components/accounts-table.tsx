import { Ellipsis, EqualApproximately } from 'lucide-react';
import { useMemo } from 'react';

import { Badge } from '@/shared/ui/components/badge';
import { Button } from '@/shared/ui/components/button';
import {
  DataTable,
  type ITableColumn,
} from '@/shared/ui/components/data-table';
import Money from '@/shared/ui/components/money';
import { SearchField } from '@/shared/ui/components/search-field';
import {
  ELedgerAccountStatus,
  type ILedgerAccountDto,
  type IMoneyDto,
  type ULedgerAccountStatus,
} from '@/shared/utils/api/Api';
import { Link } from 'react-router-dom';

export interface LedgerAccountsTableProps {
  data: ILedgerAccountDto[];
  loading?: boolean;
  selectable?: boolean;
  selectedRowIds?: (string | number)[];
  onRowSelectionChange?: (selectedIds: (string | number)[]) => void;
  pagination?: {
    total: number;
    loadNext: () => Promise<void> | void;
  };
  paginationLoading?: boolean;
  stickyHeader?: boolean;
  onSortChange?: (
    key: keyof ILedgerAccountDto,
    direction: 'asc' | 'desc' | null
  ) => void;
  onFilterChange?: (filters: Record<string, (string | number)[]>) => void;
  currentSortKey?: string;
  currentSortDirection?: 'asc' | 'desc' | null;
  className?: string;
  'data-testid'?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: Record<string, (string | number)[]>;
}

export function LedgerAccountsTable({
  data,
  loading = false,
  selectable = false,
  selectedRowIds,
  onRowSelectionChange,
  // pagination,
  // paginationLoading = false,
  stickyHeader = false,
  onSortChange,
  onFilterChange,
  currentSortKey,
  currentSortDirection,
  className,
  'data-testid': dataTestId = 'ledger-accounts-table',
  searchValue = '',
  onSearchChange,
  filters,
}: LedgerAccountsTableProps) {
  const columns = useMemo<ITableColumn<ILedgerAccountDto>[]>(
    () => [
      {
        dataIndex: 'name',
        title: 'Account Name',
        sortable: true,
        render: (value, row) => (
          <Link
            to={row.id}
            className="hover:text-brand-purple group-hover/row:text-brand-purple transition-colors duration-200"
          >
            {String(value)}
          </Link>
        ),
      },
      {
        dataIndex: 'functionalBalance',
        title: 'Balance',
        sortable: true,
        // TODO: render the balance at the top and the functional balance at the bottom in smaller text, to avoid confusion on accounts with a different currency than the functional currency
        render: (value, row) => (
          <>
            <Money
              className="text-foreground text-sm font-heading"
              value={value as IMoneyDto}
            />

            {row.functionalBalance.currencyCode !==
              row.balance.currencyCode && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <EqualApproximately className="w-3" />
                <Money
                  className="text-xs text-muted-foreground font-medium"
                  value={row.functionalBalance as IMoneyDto}
                />
              </div>
            )}
          </>
        ),
      },
      {
        dataIndex: 'status',
        title: 'Status',
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: 'Active', value: ELedgerAccountStatus.Active },
          { label: 'Archived', value: ELedgerAccountStatus.Archived },
        ],
        render: (value) => {
          const status = value as ULedgerAccountStatus;
          const isArchived = status === ELedgerAccountStatus.Archived;
          return (
            <Badge variant={isArchived ? 'secondary' : 'default'}>
              {isArchived ? 'Archived' : 'Active'}
            </Badge>
          );
        },
      },
      {
        dataIndex: 'createdAt',
        title: 'Created On',
        sortable: true,
        render: (value) => {
          if (!value) return '';
          const date = new Date(String(value));
          return (
            <span className="text-xs text-muted-foreground font-medium">
              {date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          );
        },
      },
      {
        dataIndex: 'id',
        title: '',
        sortable: false,
        render: () => {
          return (
            <Button variant="ghost" size="icon">
              <Ellipsis />
            </Button>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      {onSearchChange && (
        <div className="w-full max-w-sm">
          <SearchField
            type="search"
            placeholder="Search by code or name..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={selectable}
        selectedRowIds={selectedRowIds}
        onRowSelectionChange={onRowSelectionChange}
        stickyHeader={stickyHeader}
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
        currentSortKey={currentSortKey}
        currentSortDirection={currentSortDirection}
        className={className}
        data-testid={dataTestId}
        filters={filters}
      />
    </div>
  );
}
