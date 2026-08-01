import { AppLayout } from '@/_app/layouts/app-layout';
import { ProtectedAppLayout } from '@/_app/layouts/protected-app-layout';
import { useLedgerAccountRoutes } from '@/account/routes/ledger-account';
import { useAuthRoutes } from '@/auth/routes/auth';
import { useCounterpartiesRoutes } from '@/counterparty/routes/counterparties';
import { useReportingRoutes } from '@/reporting/routes/reporting';
import { useRoutes } from 'react-router-dom';

export function AppRoutes() {
  const reportingRoutes = useReportingRoutes('/');
  const authRoutes = useAuthRoutes('/auth');
  const ledgerAccountRoutes = useLedgerAccountRoutes('/accounts');
  const counterpartiesRoutes = useCounterpartiesRoutes('/counterparties');

  const routes = useRoutes([
    {
      element: (
        <ProtectedAppLayout>
          <AppLayout />
        </ProtectedAppLayout>
      ),
      children: [reportingRoutes, ledgerAccountRoutes, counterpartiesRoutes],
    },
    authRoutes,
  ]);

  return routes;
}
