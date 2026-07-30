import type { IPettyCashFormValues } from '@/account/components/petty-cash-form';
import { assetAccountMapper } from '@/account/lib/mappers/asset-account.mapper';
import { EExchangeRateType } from '@/shared/lib/api/Api';
import { describe, expect, it } from 'vitest';

const values: IPettyCashFormValues = {
  name: 'Office cash',
  currencyCode: 'NGN',
  createWithoutOpeningBalance: false,
  openingBalance: 100,
  openingDate: '2026-07-01',
  exchangeRate: '',
  isSubAccount: false,
};

describe('assetAccountMapper', () => {
  it('maps an account without an opening balance', () => {
    expect(
      assetAccountMapper.toPettyCashAccountCreationDto(
        {
          ...values,
          createWithoutOpeningBalance: true,
          openingBalance: '',
          openingDate: '',
        },
        'NGN'
      )
    ).toEqual({
      name: 'Office cash',
      currencyCode: 'NGN',
      isControlAccount: false,
      openingBalance: null,
    });
  });

  it('maps a same-currency opening balance without an exchange rate', () => {
    expect(
      assetAccountMapper.toPettyCashAccountCreationDto(values, 'NGN')
    ).toEqual({
      name: 'Office cash',
      currencyCode: 'NGN',
      isControlAccount: false,
      openingBalance: {
        amount: {
          amount: 100,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
        date: '2026-07-01',
        exchangeRate: null,
      },
    });
  });

  it('maps a foreign-currency opening balance with its entered rate', () => {
    expect(
      assetAccountMapper.toPettyCashAccountCreationDto(
        {
          ...values,
          name: 'Travel cash',
          currencyCode: 'USD',
          exchangeRate: 1500,
        },
        'NGN'
      )
    ).toEqual({
      name: 'Travel cash',
      currencyCode: 'USD',
      isControlAccount: false,
      openingBalance: {
        amount: {
          amount: 100,
          currencyCode: 'USD',
          isMinorUnit: false,
        },
        date: '2026-07-01',
        exchangeRate: {
          baseCurrencyCode: 'USD',
          targetCurrencyCode: 'NGN',
          rate: 1500,
          type: EExchangeRateType.Market,
          asOf: '2026-07-01',
          source: 'manual',
        },
      },
    });
  });

  it('ignores the sub-account form value', () => {
    expect(
      assetAccountMapper.toPettyCashAccountCreationDto(
        { ...values, isSubAccount: true },
        'NGN'
      )
    ).toMatchObject({
      isControlAccount: false,
    });
  });
});
