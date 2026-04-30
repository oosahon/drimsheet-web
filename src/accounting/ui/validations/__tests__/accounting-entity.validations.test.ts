import { accountingEntityCreationFormValidation } from '@/accounting/ui/validations/accounting-entity.validations';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('accountingEntityCreationFormValidation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-30T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const validData = {
    entityType: 'individual',
    countryCode: 'US',
    functionalCurrency: 'USD',
    reportingCurrency: 'USD',
    fiscalYearStart: new Date('2026-01-01'),
    fiscalYearEnd: new Date('2026-12-31'),
  };

  it('validates a correct form', async () => {
    await expect(
      accountingEntityCreationFormValidation.validate(validData)
    ).resolves.toBeTruthy();
  });

  it('fails if entityType is missing', async () => {
    await expect(
      accountingEntityCreationFormValidation.validate({
        ...validData,
        entityType: undefined,
      })
    ).rejects.toThrow('Entity type is required');
  });

  it('fails if countryCode is missing', async () => {
    await expect(
      accountingEntityCreationFormValidation.validate({
        ...validData,
        countryCode: undefined,
      })
    ).rejects.toThrow('Country is required');
  });

  it('fails if functionalCurrency is missing', async () => {
    await expect(
      accountingEntityCreationFormValidation.validate({
        ...validData,
        functionalCurrency: undefined,
      })
    ).rejects.toThrow('Functional currency is required');
  });

  it('fails if reportingCurrency is missing', async () => {
    await expect(
      accountingEntityCreationFormValidation.validate({
        ...validData,
        reportingCurrency: undefined,
      })
    ).rejects.toThrow('Reporting currency is required');
  });

  it('fails if fiscalYearStart is missing', async () => {
    await expect(
      accountingEntityCreationFormValidation.validate({
        ...validData,
        fiscalYearStart: undefined,
      })
    ).rejects.toThrow('Fiscal year start is required');
  });

  it('fails if fiscalYearStart is more than 2 years in the past', async () => {
    await expect(
      accountingEntityCreationFormValidation.validate({
        ...validData,
        fiscalYearStart: new Date('2023-01-01'),
        fiscalYearEnd: new Date('2023-12-31'),
      })
    ).rejects.toThrow(
      'Start date must not be less than two years from the current date'
    );
  });

  it('fails if fiscalYearEnd is missing', async () => {
    await expect(
      accountingEntityCreationFormValidation.validate({
        ...validData,
        fiscalYearEnd: undefined,
      })
    ).rejects.toThrow('Fiscal year end is required');
  });

  it('fails if duration is less than 1 month', async () => {
    await expect(
      accountingEntityCreationFormValidation.validate({
        ...validData,
        fiscalYearStart: new Date('2026-01-01'),
        fiscalYearEnd: new Date('2026-01-15'),
      })
    ).rejects.toThrow(
      'The difference between the start and end dates MUST not be more than 23 months or less than one month.'
    );
  });

  it('fails if duration is more than 23 months', async () => {
    await expect(
      accountingEntityCreationFormValidation.validate({
        ...validData,
        fiscalYearStart: new Date('2026-01-01'),
        fiscalYearEnd: new Date('2028-01-01'),
      })
    ).rejects.toThrow(
      'The difference between the start and end dates MUST not be more than 23 months or less than one month.'
    );
  });
});
