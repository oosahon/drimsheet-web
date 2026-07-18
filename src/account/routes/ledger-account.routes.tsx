import PettyCashAccountPage from '@/account/pages/petty-cash-account.page';
import PettyCashAccountsDashboardPage from '@/account/pages/petty-cash-accounts-dashboard.page';
import NewCashTransactionPage from '@/bookkeeping/ui/pages/new-cash-transaction.page';
import type { TModuleRoutes } from '@/shared/types/routes.types';
import AppLayout from '@/shared/ui/layouts/app-layout';

const useLedgerAccountRoutes: TModuleRoutes = (basePath) => {
  return {
    path: basePath,
    element: <AppLayout />,
    children: [
      {
        path: 'petty-cash',
        element: <PettyCashAccountsDashboardPage />,
      },
      {
        path: 'petty-cash/:accountId',
        element: <PettyCashAccountPage />,
      },
      {
        path: 'petty-cash/:accountId/transactions/new',
        element: <NewCashTransactionPage />,
      },
    ],
  };
};

export default useLedgerAccountRoutes;
