import type { TModuleRoutes } from '@/shared/types/routes.types';
import AppLayout from '@/shared/ui/containers/app-layout';
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
