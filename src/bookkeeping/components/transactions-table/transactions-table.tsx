import { BalanceEffectIcon } from '@/bookkeeping/components/balance-effect-icon';
import { Button } from '@/shared/components/button';
import { DataTable, type ITableColumn } from '@/shared/components/data-table';
import { FormattedDate } from '@/shared/components/date';
import { Money } from '@/shared/components/money';
import { SearchField } from '@/shared/components/search-field';
import { TablePagination } from '@/shared/components/table-pagination';
import {
  type IAccountTransactionRes,
  type IMoneyDto,
  type IPaginationResponseMeta,
} from '@/shared/lib/api/Api';
import { Ellipsis } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface TransactionsTableProps {
  data: IAccountTransactionRes[];
  loading?: boolean;
  selectable?: boolean;
  selectedRowIds?: (string | number)[];
  onRowSelectionChange?: (selectedIds: (string | number)[]) => void;
  pagination?: IPaginationResponseMeta;
  onPageChange?: (page: number) => void;
  onSortChange?: (
    key: keyof IAccountTransactionRes,
    direction: 'asc' | 'desc' | null
  ) => void;
  currentSortKey?: string;
  currentSortDirection?: 'asc' | 'desc' | null;
  className?: string;
  'data-testid'?: string;
  searchValue?: string;
  onSearchChange: (value: string) => void;
}

function TransactionsTable({
  data,
  loading = false,
  selectable = false,
  selectedRowIds,
  onRowSelectionChange,
  pagination,
  onPageChange,
  onSortChange,
  currentSortKey,
  currentSortDirection,
  className,
  'data-testid': dataTestId = 'transactions-table',
  searchValue = '',
  onSearchChange,
}: Readonly<TransactionsTableProps>) {
  const { t } = useTranslation(['bookkeeping', 'shared']);

  const columns = useMemo<ITableColumn<IAccountTransactionRes>[]>(() => {
    const amount_label = t('amount_label');
    const description_label = t('description_label');
    const created_on_label = t('shared:created_on');
    const date_text = t('shared:date');

    return [
      {
        dataIndex: 'amount',
        title: amount_label,
        sortable: true,
        render: (value, row) => (
          <div className="flex gap-2 items-center">
            <BalanceEffectIcon
              effect={row.balanceEffect}
              className="size-8 [&_svg]:size-4"
            />

            <Money
              className="text-foreground text-sm font-heading"
              value={value as IMoneyDto}
            />
          </div>
        ),
      },
      {
        dataIndex: 'description',
        title: description_label,
        render: (value) => {
          if (!value) {
            return <span className="text-muted-foreground">-</span>;
          }

          return String(value);
        },
      },
      {
        dataIndex: 'header',
        title: date_text,
        sortable: true,
        render: (_, row) => {
          if (!row.header.effectiveDate) return '';
          const date = new Date(String(row.header.effectiveDate));
          return (
            <span className="text-xs text-muted-foreground font-medium">
              <FormattedDate value={date} />
            </span>
          );
        },
      },
      {
        dataIndex: 'createdAt',
        title: created_on_label,
        sortable: true,
        render: (value) => {
          if (!value) return '';
          const date = new Date(String(value));
          return (
            <span className="text-xs text-muted-foreground font-medium">
              <FormattedDate value={date} />
            </span>
          );
        },
      },
      {
        dataIndex: 'id',
        title: '',
        render: () => (
          <Button variant="ghost" size="icon">
            <Ellipsis />
          </Button>
        ),
      },
    ];
  }, [t]);

  const search_placeholder_text = t(
    'bookkeeping:transactions_search_placeholder'
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full max-w-sm">
        <SearchField
          type="search"
          placeholder={search_placeholder_text}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <DataTable
        selectable={selectable}
        selectedRowIds={selectedRowIds}
        onRowSelectionChange={onRowSelectionChange}
        columns={columns}
        data={data}
        loading={loading}
        onSortChange={onSortChange}
        currentSortKey={currentSortKey}
        currentSortDirection={currentSortDirection}
        className={className}
        data-testid={dataTestId}
      />

      {pagination && onPageChange && (
        <TablePagination
          meta={pagination}
          onPageChange={onPageChange}
          className="mx-0 w-auto justify-end"
        />
      )}
    </div>
  );
}

export { TransactionsTable };
