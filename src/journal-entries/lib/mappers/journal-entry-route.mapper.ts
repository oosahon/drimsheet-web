import {
  EJournalEntrySourceType,
  type UJournalEntrySourceType,
} from '@/shared/lib/api/Api';

export type UJournalEntryEditRouteType = 'inflow' | 'outflow' | 'transfer';

function toRouteType(
  sourceType: UJournalEntrySourceType
): UJournalEntryEditRouteType | undefined {
  switch (sourceType) {
    case EJournalEntrySourceType.Receipt:
      return 'inflow';
    case EJournalEntrySourceType.Payment:
      return 'outflow';
    case EJournalEntrySourceType.Transfer:
      return 'transfer';
    default:
      return undefined;
  }
}

function toSourceType(
  routeType: string | undefined
): UJournalEntrySourceType | undefined {
  switch (routeType) {
    case 'inflow':
      return EJournalEntrySourceType.Receipt;
    case 'outflow':
      return EJournalEntrySourceType.Payment;
    case 'transfer':
      return EJournalEntrySourceType.Transfer;
    default:
      return undefined;
  }
}

export const journalEntryRouteMapper = Object.freeze({
  toRouteType,
  toSourceType,
});
