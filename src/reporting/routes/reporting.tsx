import { DashboardPage } from '@/reporting/pages/dashboard';
import type { TModuleRoutes } from '@/shared/lib/routes.types';
import { Navigate } from 'react-router-dom';

export const useReportingRoutes: TModuleRoutes = (basePath) => {
  return {
    path: basePath,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
    ],
  };
};
