import useLedgerAccounts from '@/ledger-accounts/hooks/api/use-ledger-accounts';
import ledgerAccountService from '@/ledger-accounts/services/ledger-account.service';
import { AccountListItem } from '@/ledger-accounts/ui/components/account-list-item';
import PettyCashAccountFormContainer from '@/ledger-accounts/ui/containers/petty-cash-account-form-container';
import LedgerAccountPageLayout from '@/ledger-accounts/ui/layout/ledger-account.layout';
import { useState } from 'react';

export default function PettyCashAccountRoute() {
  const [showCreationForm, setShowCreationForm] = useState(false);

  const { data: accounts } = useLedgerAccounts(
    ledgerAccountService.getPettyBaseCashFilters()
  );

  const handleAddClick = () => {
    setShowCreationForm(true);
  };

  return (
    <LedgerAccountPageLayout title="Petty Cash" onAddClick={handleAddClick}>
      <div className="flex flex-col gap-4 my-5">
        <div className="flex gap-2">
          {accounts?.data.map((account) => {
            return <AccountListItem key={account.id} account={account} />;
          })}
        </div>
      </div>

      {showCreationForm && <PettyCashAccountFormContainer />}
    </LedgerAccountPageLayout>
  );
}
