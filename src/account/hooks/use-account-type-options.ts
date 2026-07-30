import { ELedgerAccountBehavior } from '@/shared/lib/api/Api';
import { useTranslation } from 'react-i18next';

export function useAccountTypeOptions() {
  const { t } = useTranslation(['shared']);

  // TODO: move this to ledger scope
  const petty_cash_label = t('shared:petty_cash');
  const bank_label = t('shared:bank');

  return [
    {
      value: ELedgerAccountBehavior.PettyCash,
      label: petty_cash_label,
    },
    {
      value: ELedgerAccountBehavior.Bank,
      label: bank_label,
    },
  ];
}
