import DashboardPage from '@/reporting/pages/dashboard';
import type { TModuleRoutes } from '@/shared/lib/routes.types';
import { Navigate } from 'react-router-dom';

const useReportingRoutes: TModuleRoutes = (basePath) => {
  return {
    path: basePath,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
    ],
  };
};

export default useReportingRoutes;
