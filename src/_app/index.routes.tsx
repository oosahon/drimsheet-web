import AppLayout from '@/_app/layouts/app-layout';
import useLedgerAccountRoutes from '@/account/routes/ledger-account.routes';
import useAuthRoutes from '@/auth/routes/auth.routes';
import useReportingRoutes from '@/reporting/ui/routes/reporting.routes';
import { useRoutes } from 'react-router-dom';

export default function AppRoutes() {
  const reportingRoutes = useReportingRoutes('/');
  const authRoutes = useAuthRoutes('/auth');
  const ledgerAccountRoutes = useLedgerAccountRoutes('/accounts');

  const routes = useRoutes([
    {
      element: <AppLayout />,
      children: [reportingRoutes, ledgerAccountRoutes],
    },
    authRoutes,
  ]);

  return routes;
}
