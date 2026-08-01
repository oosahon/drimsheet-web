import {
  ECounterpartyType,
  type UCounterpartyType,
} from '@/shared/lib/api/Api';
import { useTranslation } from 'react-i18next';

export function useGetCounterpartyTypeLabel() {
  const { t } = useTranslation(['counterparty']);

  return (type: UCounterpartyType) => {
    switch (type) {
      case ECounterpartyType.Individual:
        return t('counterparty:individual_label');
      case ECounterpartyType.Organization:
        return t('counterparty:organization_label');
      default:
        return type;
    }
  };
}
