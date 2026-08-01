import {
  ECounterpartyRole,
  type UCounterpartyRole,
} from '@/shared/lib/api/Api';
import { useTranslation } from 'react-i18next';

export function useGetCounterpartyRoleLabel() {
  const { t } = useTranslation(['counterparty']);

  return (role: UCounterpartyRole) => {
    switch (role) {
      case ECounterpartyRole.Employer:
        return t('counterparty:employer_label');
      case ECounterpartyRole.Contractor:
        return t('counterparty:contractor_label');
      case ECounterpartyRole.Vendor:
        return t('counterparty:vendor_label');
      default:
        return role;
    }
  };
}
