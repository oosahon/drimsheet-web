import { journalEntryRouteMapper } from '@/journal-entries/lib/mappers/journal-entry-route.mapper';
import { EJournalEntrySourceType } from '@/shared/lib/api/Api';
import { describe, expect, it } from 'vitest';

describe('journalEntryRouteMapper', () => {
  it.each([
    [EJournalEntrySourceType.Receipt, 'inflow'],
    [EJournalEntrySourceType.Payment, 'outflow'],
    [EJournalEntrySourceType.Transfer, 'transfer'],
  ] as const)('maps %s to the %s edit route', (sourceType, routeType) => {
    expect(journalEntryRouteMapper.toRouteType(sourceType)).toBe(routeType);
    expect(journalEntryRouteMapper.toSourceType(routeType)).toBe(sourceType);
  });

  it('rejects unsupported source and route types', () => {
    expect(
      journalEntryRouteMapper.toRouteType(EJournalEntrySourceType.Adjustment)
    ).toBeUndefined();
    expect(journalEntryRouteMapper.toSourceType('adjustment')).toBeUndefined();
    expect(journalEntryRouteMapper.toSourceType(undefined)).toBeUndefined();
  });
});
