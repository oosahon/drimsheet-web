import { TransactionLayout } from '@/journal-entries/layouts/transaction-layout';
import { InflowPage } from '@/journal-entries/pages/inflow';
import { OutflowPage } from '@/journal-entries/pages/outflow';
import { TransactionsPage } from '@/journal-entries/pages/transactions';
import { TransferPage } from '@/journal-entries/pages/transfer';
import type { TModuleRoutes } from '@/shared/lib/types/routes.types';

export const useJournalEntriesRoutes: TModuleRoutes = (basePath) => ({
  path: basePath,
  children: [
    { index: true, element: <TransactionsPage /> },
    {
      element: <TransactionLayout />,
      children: [
        { path: 'inflow', element: <InflowPage /> },
        { path: 'outflow', element: <OutflowPage /> },
        { path: 'transfer', element: <TransferPage /> },
      ],
    },
  ],
});
