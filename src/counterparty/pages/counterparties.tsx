import type { UCounterpartyRoleSelectValue } from '@/counterparty/components/counterparty-role-select/types';
import { ContractorCreationDialog } from '@/counterparty/dialogs/contractor-creation';
import { CounterpartyCreationDialog } from '@/counterparty/dialogs/counterparty-creation';
import { CounterpartyRoleSelectionDialog } from '@/counterparty/dialogs/counterparty-role-selection';
import { EmployerCreationDialog } from '@/counterparty/dialogs/employer-creation';
import { VendorCreationDialog } from '@/counterparty/dialogs/vendor-creation';
import { AppBody, AppHeader } from '@/shared/components/app';
import { Button } from '@/shared/components/button';
import { ECounterpartyRole } from '@/shared/lib/api/Api';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function CounterpartiesPage() {
  const { t } = useTranslation(['counterparty', 'shared']);

  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] =
    useState<UCounterpartyRoleSelectValue | null>(null);

  const handleRoleSelected = (role: UCounterpartyRoleSelectValue) => {
    setShowRoleSelection(false);
    setSelectedRole(role);
  };

  const counterparties_label = t('shared:counterparties');
  const create_counterparty_button = t(
    'counterparty:create_counterparty_button'
  );

  return (
    <>
      <AppHeader breadcrumbs={[{ label: counterparties_label }]} />

      <AppBody>
        <div>{counterparties_label}</div>

        <Button onClick={() => setShowRoleSelection(true)}>
          {create_counterparty_button}
        </Button>

        <CounterpartyRoleSelectionDialog
          open={showRoleSelection}
          onClose={() => setShowRoleSelection(false)}
          onSubmit={handleRoleSelected}
        />

        <CounterpartyCreationDialog
          open={selectedRole === 'default'}
          onClose={() => setSelectedRole(null)}
        />

        <VendorCreationDialog
          open={selectedRole === ECounterpartyRole.Vendor}
          onClose={() => setSelectedRole(null)}
        />

        <ContractorCreationDialog
          open={selectedRole === ECounterpartyRole.Contractor}
          onClose={() => setSelectedRole(null)}
        />

        <EmployerCreationDialog
          open={selectedRole === ECounterpartyRole.Employer}
          onClose={() => setSelectedRole(null)}
        />
      </AppBody>
    </>
  );
}
