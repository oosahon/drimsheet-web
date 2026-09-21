import { DataTableSkeleton } from '@/shared/components/data-table';
import { Skeleton } from '@/shared/components/skeleton';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/table';
import { useTranslation } from 'react-i18next';

export function TransactionsTableSkeleton() {
  const { t } = useTranslation('journal-entries');

  const loading_status = t('transactions_table_loading_status');

  return (
    <div className="flex w-full flex-col gap-4" aria-busy="true">
      <output className="sr-only">{loading_status}</output>
      <Skeleton className="h-9 w-full max-w-sm" />

      <div className="w-full overflow-hidden rounded-xl border border-border bg-background shadow-xs">
        <Table className="border-collapse">
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4">
                <Skeleton className="h-4 w-5" />
              </TableHead>
              <TableHead className="px-4">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="px-4">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="px-4">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="px-4">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="px-4">
                <Skeleton className="h-4 w-5" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <DataTableSkeleton columnsCount={6} />
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
