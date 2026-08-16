import { AppLayout } from '@/_app/layouts/app-layout';
import { ProtectedAppLayout } from '@/_app/layouts/protected-app-layout';
import { useLedgerAccountRoutes } from '@/account/routes/ledger-account';
import { useAuthRoutes } from '@/auth/routes/auth';
import { useCounterpartiesRoutes } from '@/counterparty/routes/counterparties';
import { useJournalEntriesRoutes } from '@/journal-entries/routes/journal-entries';
import { useReportingRoutes } from '@/reporting/routes/reporting';
import { wrapUseRoutesV7 } from '@sentry/react';
import { useRoutes } from 'react-router-dom';

const useSentryRoutes = wrapUseRoutesV7(useRoutes);

export function AppRoutes() {
  const reportingRoutes = useReportingRoutes('/');
  const authRoutes = useAuthRoutes('/auth');
  const ledgerAccountRoutes = useLedgerAccountRoutes('/accounts');
  const counterpartiesRoutes = useCounterpartiesRoutes('/counterparties');
  const journalEntriesRoutes = useJournalEntriesRoutes('/transactions');

  const routes = useSentryRoutes([
    {
      element: (
        <ProtectedAppLayout>
          <AppLayout />
        </ProtectedAppLayout>
      ),
      children: [
        reportingRoutes,
        ledgerAccountRoutes,
        counterpartiesRoutes,
        journalEntriesRoutes,
      ],
    },
    authRoutes,
  ]);

  return routes;
}
