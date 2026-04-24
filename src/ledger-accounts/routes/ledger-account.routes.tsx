import AppLayout from '@/shared/components/app-layout';
import type { TModuleRoutes } from '@/shared/types/routes.types';
import PettyCashAccountRoute from './petty-cash-account.route';

const useLedgerAccountRoutes: TModuleRoutes = (basePath) => {
  return {
    path: basePath,
    element: <AppLayout />,
    children: [
      {
        path: 'petty-cash',
        element: <PettyCashAccountRoute />,
      },
    ],
  };
};

export default useLedgerAccountRoutes;
