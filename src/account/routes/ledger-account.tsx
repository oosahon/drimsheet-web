import PettyCashAccountPage from '@/account/pages/petty-cash-account';
import PettyCashAccountsDashboardPage from '@/account/pages/petty-cash-accounts-dashboard';
import NewCashTransactionPage from '@/bookkeeping/pages/new-cash-transaction';
import type { TModuleRoutes } from '@/shared/lib/routes.types';

const useLedgerAccountRoutes: TModuleRoutes = (basePath) => {
  return {
    path: basePath,
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
