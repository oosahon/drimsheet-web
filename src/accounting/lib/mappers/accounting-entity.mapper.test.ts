import { accountingEntityMapper } from '@/accounting/lib/mappers/accounting-entity.mapper';
import { EAccountingEntityType, EPeriodUnit } from '@/shared/lib/api/Api';
import { describe, expect, it } from 'vitest';

describe('accountingEntityMapper', () => {
  it('maps validated form values to the complete creation DTO', () => {
    const payload = accountingEntityMapper.toAccountingEntityCreationDto({
      name: 'Drimsheet',
      entityType: EAccountingEntityType.PrivateCompany,
      countryCode: 'NG',
      functionalCurrency: 'NGN',
      reportingCurrency: 'NGN',
      fiscalYearStart: new Date(2026, 0, 1),
      fiscalYearEnd: new Date(2026, 11, 31),
      appUsageMode: 'non_power_user',
      accountingStandardCode: 'IFRS',
    });

    expect(payload).toEqual({
      name: 'Drimsheet',
      entityType: EAccountingEntityType.PrivateCompany,
      jurisdictionCode: 'NG',
      accountingStandardCode: 'IFRS',
      functionalCurrencyCode: 'NGN',
      reportingCurrencyCode: 'NGN',
      fiscalYear: {
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      },
      accountingPeriod: {
        unit: EPeriodUnit.Month,
        count: 12,
      },
      reportingPeriod: {
        unit: EPeriodUnit.Month,
        count: 12,
      },
      appUsageMode: 'non_power_user',
    });
  });
});
