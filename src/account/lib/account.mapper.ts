import type { TStatusBadgeValue } from '@/shared/ui/components/status-badge';
import {
  ELedgerAccountStatus,
  type ULedgerAccountStatus,
} from '@/shared/utils/api/Api';
import { t } from 'i18next';

function mapStatusToBadgeProps(
  status: ULedgerAccountStatus
): TStatusBadgeValue {
  switch (status) {
    case ELedgerAccountStatus.Active:
      return { variant: 'success', label: t('shared:active') };
    case ELedgerAccountStatus.Archived:
      return { variant: 'neutral', label: t('shared:archived') };
  }
}

const ledgerAccountMapper = Object.freeze({
  mapStatusToBadgeProps,
});

export default ledgerAccountMapper;
