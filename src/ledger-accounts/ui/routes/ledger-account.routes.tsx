import PettyCashAccountPage from '@/ledger-accounts/ui/pages/petty-cash-account.page';
import type { TModuleRoutes } from '@/shared/types/routes.types';
import AppLayout from '@/shared/ui/layouts/app-layout';

const useLedgerAccountRoutes: TModuleRoutes = (basePath) => {
  return {
    path: basePath,
    element: <AppLayout />,
    children: [
      {
        path: 'petty-cash',
        element: <PettyCashAccountPage />,
      },
    ],
  };
};

export default useLedgerAccountRoutes;
