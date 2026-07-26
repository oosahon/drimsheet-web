import { LedgerAccountsOverview } from '@/account/components/accounts-overview';
import { LedgerAccountsTableContainer } from '@/account/components/accounts-table';
import { AccountCreationDialog } from '@/account/dialogs/account-creation';
import { AppBody, AppHeader } from '@/shared/components/app';
import { ELedgerType } from '@/shared/lib/api/Api';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function AccountsDashboardPage() {
  const { t } = useTranslation(['ledger-accounts', 'shared']);

  const [showCreationForm, setShowCreationForm] = useState(false);

  const accounts_label = t('shared:accounts');
  const total_vault_balance_label = t('ledger-accounts:total_vault_balance');
  const accounts_count_text = t('ledger-accounts:accounts_count', {
    count: 12,
  });
  return (
    <>
      <AppHeader breadcrumbs={[{ label: accounts_label }]} />

      <AppBody>
        <LedgerAccountsOverview
          type={ELedgerType.Asset}
          title={total_vault_balance_label}
          balance={{ amount: 12500, currencyCode: 'USD', isMinorUnit: true }}
          description={accounts_count_text}
        />

        <LedgerAccountsTableContainer
          onAddAccount={() => setShowCreationForm(true)}
        />

        <AccountCreationDialog
          open={showCreationForm}
          onOpenChange={setShowCreationForm}
        />
      </AppBody>
    </>
  );
}
