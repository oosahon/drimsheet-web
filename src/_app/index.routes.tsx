import useAuthRoutes from '@/auth/routes/auth.routes';
import useReportingRoutes from '@/reporting/routes/reporting.routes';
import { useRoutes } from 'react-router-dom';

export default function AppRoutes() {
  const reportingRoutes = useReportingRoutes('/');
  const authRoutes = useAuthRoutes('/auth');

  const routes = useRoutes([reportingRoutes, authRoutes]);

  return routes;
}
