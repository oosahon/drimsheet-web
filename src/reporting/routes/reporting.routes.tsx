import DashboardRoute from '@/reporting/routes/dashboard.route';
import AppLayout from '@/shared/components/app-layout';
import type { TModuleRoutes } from '@/shared/types/routes.types';
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
