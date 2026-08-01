import { CounterpartiesPage } from '@/counterparty/pages/counterparties';
import type { TModuleRoutes } from '@/shared/lib/types/routes.types';

export const useCounterpartiesRoutes: TModuleRoutes = (basePath) => {
  return {
    path: basePath,
    children: [
      {
        index: true,
        element: <CounterpartiesPage />,
      },
    ],
  };
};
