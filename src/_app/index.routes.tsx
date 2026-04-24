import useAuthRoutes from '@/auth/routes/auth.routes';
import useLedgerAccountRoutes from '@/ledger-accounts/routes/ledger-account.routes';
import useReportingRoutes from '@/reporting/routes/reporting.routes';
import { useRoutes } from 'react-router-dom';

export default function AppRoutes() {
  const reportingRoutes = useReportingRoutes('/');
  const authRoutes = useAuthRoutes('/auth');
  const ledgerAccountRoutes = useLedgerAccountRoutes('/accounts');

  const routes = useRoutes([reportingRoutes, authRoutes, ledgerAccountRoutes]);

  return routes;
}
