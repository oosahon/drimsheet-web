import DashboardRoute from '@/reporting/ui/routes/dashboard.route';
import type { TModuleRoutes } from '@/shared/types/routes.types';
import AppLayout from '@/shared/ui/layouts/app-layout';
import { Navigate } from 'react-router-dom';

const useReportingRoutes: TModuleRoutes = (basePath) => {
  return {
    path: basePath,
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardRoute /> },
    ],
  };
};

export default useReportingRoutes;
