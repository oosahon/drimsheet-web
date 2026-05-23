import { LedgerAccountOverview } from '@/ledger-accounts/ui/components/account-overview';
import LedgerAccountsTableContainer from '@/ledger-accounts/ui/containers/accounts-table.container';
import PettyCashAccountFormContainer from '@/ledger-accounts/ui/containers/petty-cash-account-form.container';
import { AppBody, AppHeader } from '@/shared/ui/components/app';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/components/dialog';
import { ELedgerType } from '@/shared/utils/api/Api';
import { useState } from 'react';

export default function PettyCashAccountsDashboardPage() {
  const [showCreationForm, setShowCreationForm] = useState(false);

  return (
    <>
      <AppHeader
        breadcrumbs={[{ label: 'Accounts', to: '#' }, { label: 'Petty Cash' }]}
      />

      <AppBody>
        <LedgerAccountOverview
          type={ELedgerType.Asset}
          title="Total Vault Balance"
          balance={{ amount: 12500, currencyCode: 'USD', isMinorUnit: true }}
          description={`12 accounts`}
        />

        <LedgerAccountsTableContainer />

        <Dialog open={showCreationForm} onOpenChange={setShowCreationForm}>
          <DialogContent className="sm:max-w-md bg-card border-border/80 shadow-2xl backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold tracking-tight text-foreground font-heading">
                Create Petty Cash Account
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 flex justify-center">
              <PettyCashAccountFormContainer
                onSuccess={() => setShowCreationForm(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </AppBody>
    </>
  );
}
