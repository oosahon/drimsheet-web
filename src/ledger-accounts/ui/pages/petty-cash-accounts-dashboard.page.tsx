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
import { useTranslation } from 'react-i18next';

export default function PettyCashAccountsDashboardPage() {
  const { t } = useTranslation(['ledger-accounts', 'shared']);

  const [showCreationForm, setShowCreationForm] = useState(false);

  const accounts_label = t('shared:accounts');
  const petty_cash_label = t('shared:petty_cash');
  const total_vault_balance_label = t('ledger-accounts:total_vault_balance');
  const accounts_count_text = t('ledger-accounts:accounts_count', {
    count: 12,
  });
  const create_petty_cash_account_text = t(
    'ledger-accounts:create_petty_cash_account'
  );

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: accounts_label, to: '#' },
          { label: petty_cash_label },
        ]}
      />

      <AppBody>
        <LedgerAccountOverview
          type={ELedgerType.Asset}
          title={total_vault_balance_label}
          balance={{ amount: 12500, currencyCode: 'USD', isMinorUnit: true }}
          description={accounts_count_text}
        />

        <LedgerAccountsTableContainer />

        <Dialog open={showCreationForm} onOpenChange={setShowCreationForm}>
          <DialogContent className="sm:max-w-md bg-card border-border/80 shadow-2xl backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold tracking-tight text-foreground font-heading">
                {create_petty_cash_account_text}
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
