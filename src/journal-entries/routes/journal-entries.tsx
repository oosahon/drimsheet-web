import { TransactionLayout } from '@/journal-entries/layouts/transaction-layout';
import { InflowPage } from '@/journal-entries/pages/inflow';
import { OutflowPage } from '@/journal-entries/pages/outflow';
import type { TModuleRoutes } from '@/shared/lib/types/routes.types';
import { Navigate } from 'react-router-dom';

export const useJournalEntriesRoutes: TModuleRoutes = (basePath) => ({
  path: basePath,
  element: <TransactionLayout />,
  children: [
    { index: true, element: <Navigate to="inflow" replace /> },
    { path: 'inflow', element: <InflowPage /> },
    { path: 'outflow', element: <OutflowPage /> },
    { path: 'transfer', element: <>Transfer</> },
  ],
});
