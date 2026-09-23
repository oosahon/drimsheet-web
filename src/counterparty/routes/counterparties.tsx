import { CounterpartiesPage } from '@/counterparty/pages/counterparties';
import { CounterpartyDetailsPage } from '@/counterparty/pages/counterparty-details';
import type { TModuleRoutes } from '@/shared/lib/types/routes.types';

export const useCounterpartiesRoutes: TModuleRoutes = (basePath) => {
  return {
    path: basePath,
    children: [
      { path: ':counterpartyId', element: <CounterpartyDetailsPage /> },
      {
        index: true,
        element: <CounterpartiesPage />,
      },
    ],
  };
};
