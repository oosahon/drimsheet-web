import { describe, expect, it } from 'vitest';
import { createPettyCashFormValidation } from './validation';

const messages = {
  accountNameRequired: 'Account name is required',
  accountNameMinLength: 'Account name is too short',
  accountNameMaxLength: 'Account name is too long',
  currencyRequired: 'Currency is required',
  openingBalanceRequired: 'Opening balance is required',
  openingBalanceNumber: 'Opening balance must be a number',
  openingDateRequired: 'Opening date is required',
  exchangeRateRequired: 'Exchange rate is required',
  exchangeRateNumber: 'Exchange rate must be a number',
  exchangeRatePositive: 'Exchange rate must be positive',
};

const schema = createPettyCashFormValidation('NGN', messages);

const validValues = {
  name: 'Office cash',
  currencyCode: 'NGN',
  createWithoutOpeningBalance: false,
  openingBalance: 100,
  openingDate: '2026-07-01',
  exchangeRate: '',
  isSubAccount: false,
};

describe('petty cash form validation', () => {
  it('accepts a same-currency opening balance', async () => {
    await expect(schema.validate(validValues)).resolves.toBeDefined();
  });

  it('requires an opening balance when opening balance is enabled', async () => {
    await expect(
      schema.validate({
        ...validValues,
        openingBalance: '',
      })
    ).rejects.toThrow('Opening balance is required');
  });

  it('requires an opening date when opening balance is enabled', async () => {
    await expect(
      schema.validate({
        ...validValues,
        openingDate: '',
      })
    ).rejects.toThrow('Opening date is required');
  });

  it('allows opening balance fields to be empty when disabled', async () => {
    await expect(
      schema.validate({
        ...validValues,
        createWithoutOpeningBalance: true,
        openingBalance: '',
        openingDate: '',
      })
    ).resolves.toBeDefined();
  });

  it('requires an exchange rate for a foreign currency', async () => {
    await expect(
      schema.validate({
        ...validValues,
        currencyCode: 'USD',
        exchangeRate: '',
      })
    ).rejects.toThrow('Exchange rate is required');
  });

  it('rejects a non-positive foreign-currency exchange rate', async () => {
    await expect(
      schema.validate({
        ...validValues,
        currencyCode: 'USD',
        exchangeRate: 0,
      })
    ).rejects.toThrow('Exchange rate must be positive');
  });
});
