import DashboardRoute from '@/reporting/ui/routes/dashboard';
import type { TModuleRoutes } from '@/shared/types/routes.types';
import { Navigate } from 'react-router-dom';

const useReportingRoutes: TModuleRoutes = (basePath) => {
  return {
    path: basePath,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardRoute /> },
    ],
  };
};

export default useReportingRoutes;
