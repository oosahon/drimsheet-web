import { createBankAccountFormValidation } from '@/account/components/bank-account-form/validation';
import { describe, expect, it } from 'vitest';

const messages = {
  accountNameRequired: 'Account name is required',
  accountNameMinLength: 'Account name must be at least 3 characters',
  accountNameMaxLength: 'Account name must not exceed 100 characters',
  currencyRequired: 'Currency is required',
  bankLocationRequired: 'Bank location is required',
  bankNameRequired: 'Bank name is required',
  bankAccountNumberRequired: 'Bank account number is required',
  bankAccountNameRequired: 'Bank account name is required',
  openingBalanceRequired: 'Opening balance is required',
  openingBalanceNumber: 'Opening balance must be a number',
  openingDateRequired: 'Opening date is required',
  exchangeRateRequired: 'Exchange rate is required',
  exchangeRateNumber: 'Exchange rate must be a number',
  exchangeRatePositive: 'Exchange rate must be greater than zero',
};

const validValues = {
  name: 'Operating Account',
  currencyCode: 'NGN',
  bankLocation: 'NG',
  bankName: 'Access Bank',
  accountNumber: '0123456789',
  accountName: 'Acme Ltd',
  createWithoutOpeningBalance: false,
  openingBalance: 1000,
  openingDate: '2026-07-01',
  exchangeRate: '',
  isSubAccount: false,
};

describe('createBankAccountFormValidation', () => {
  it('passes validation for valid same-currency values', async () => {
    const schema = createBankAccountFormValidation('NGN', messages);
    await expect(schema.validate(validValues)).resolves.toMatchObject({
      name: 'Operating Account',
      currencyCode: 'NGN',
      bankLocation: 'NG',
      bankName: 'Access Bank',
      accountNumber: '0123456789',
      accountName: 'Acme Ltd',
      createWithoutOpeningBalance: false,
      openingBalance: 1000,
      openingDate: '2026-07-01',
      isSubAccount: false,
    });
  });

  it('fails validation when required fields are missing', async () => {
    const schema = createBankAccountFormValidation('NGN', messages);
    await expect(
      schema.validate({
        ...validValues,
        name: '',
        currencyCode: '',
        bankLocation: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
      })
    ).rejects.toThrow();
  });

  it('requires exchange rate for foreign currency when opening balance is specified', async () => {
    const schema = createBankAccountFormValidation('NGN', messages);

    await expect(
      schema.validate({
        ...validValues,
        currencyCode: 'USD',
        exchangeRate: '',
      })
    ).rejects.toThrow(messages.exchangeRateRequired);

    await expect(
      schema.validate({
        ...validValues,
        currencyCode: 'USD',
        exchangeRate: '1500',
      })
    ).resolves.toBeDefined();
  });

  it('bypasses opening balance and exchange rate when createWithoutOpeningBalance is true', async () => {
    const schema = createBankAccountFormValidation('NGN', messages);

    await expect(
      schema.validate({
        ...validValues,
        currencyCode: 'USD',
        createWithoutOpeningBalance: true,
        openingBalance: '',
        openingDate: '',
        exchangeRate: '',
      })
    ).resolves.toBeDefined();
  });
});
