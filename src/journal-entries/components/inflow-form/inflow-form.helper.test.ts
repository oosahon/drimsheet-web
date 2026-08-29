import type { IExchangeRate, ILedgerAccountDto } from '@/shared/lib/api/Api';
import { dateUtils } from '@/shared/lib/utils/date';
import { describe, expect, it } from 'vitest';
import inflowFormHelpers from './inflow-form.helper';
import type { IInflowFormValues } from './types';

const destinationAccounts = [
  {
    id: 'usd-bank',
    balance: { amount: 0, currencyCode: 'USD', isMinorUnit: false },
  },
] as unknown as ILedgerAccountDto[];

const values: IInflowFormValues = {
  destinationAccountId: 'usd-bank',
  sourceAccountId: 'sales',
  amount: { amount: 999, currencyCode: 'USD', isMinorUnit: false },
  date: '2026-08-10',
  exchangeRate: ' 1500 ',
  isItemized: true,
  items: [
    {
      id: 'item-1',
      amount: { amount: 125, currencyCode: 'USD', isMinorUnit: false },
      accountId: 'sales',
      description: ' Item description ',
    },
  ],
  payer: { id: 'payer-1', name: ' Acme ', type: 'organization' },
  description: ' Consulting ',
  receipt: null,
};

describe('inflowFormHelpers', () => {
  describe('createInitialValues', () => {
    it('creates empty values with the functional currency defaults', () => {
      expect(
        inflowFormHelpers.createInitialValues(
          undefined,
          destinationAccounts,
          'NGN'
        )
      ).toEqual({
        destinationAccountId: '',
        sourceAccountId: '',
        amount: {
          amount: Number.NaN,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
        date: dateUtils.formatDateForApi(new Date()),
        exchangeRate: '',
        isItemized: false,
        items: [],
        payer: {
          id: undefined,
          name: '',
          type: undefined,
        },
        description: '',
        receipt: null,
      });
    });

    it('prefers the selected account currency over supplied amount currency', () => {
      expect(
        inflowFormHelpers.createInitialValues(
          {
            destinationAccountId: 'usd-bank',
            sourceAccountId: 'sales',
            amount: {
              amount: 125,
              currencyCode: 'EUR',
              isMinorUnit: true,
            },
            exchangeRate: '1500',
            payer: { id: 'payer-1', name: 'Acme', type: 'organization' },
            description: 'Consulting',
          },
          destinationAccounts,
          'NGN'
        )
      ).toEqual({
        destinationAccountId: 'usd-bank',
        sourceAccountId: 'sales',
        amount: {
          amount: 125,
          currencyCode: 'USD',
          isMinorUnit: true,
        },
        date: dateUtils.formatDateForApi(new Date()),
        exchangeRate: '1500',
        isItemized: false,
        items: [],
        payer: { id: 'payer-1', name: 'Acme', type: 'organization' },
        description: 'Consulting',
        receipt: null,
      });
    });

    it('uses a supplied amount currency when no selected account resolves', () => {
      const initialValues = inflowFormHelpers.createInitialValues(
        { amount: { currencyCode: 'EUR' } },
        destinationAccounts,
        'NGN'
      );

      expect(initialValues.amount.currencyCode).toBe('EUR');
    });
  });

  describe('updateAccount', () => {
    it('updates account-owned currencies and retains a required exchange rate', () => {
      expect(
        inflowFormHelpers.updateAccount(values, 'eur-bank', 'EUR', 'NGN')
      ).toEqual({
        destinationAccountId: 'eur-bank',
        sourceAccountId: 'sales',
        amount: { amount: 999, currencyCode: 'EUR', isMinorUnit: false },
        date: '2026-08-10',
        exchangeRate: ' 1500 ',
        isItemized: true,
        items: [
          {
            id: 'item-1',
            amount: { amount: 125, currencyCode: 'EUR', isMinorUnit: false },
            accountId: 'sales',
            description: ' Item description ',
          },
        ],
        payer: { id: 'payer-1', name: ' Acme ', type: 'organization' },
        description: ' Consulting ',
        receipt: null,
      });
    });

    it('clears the exchange rate for a functional-currency account', () => {
      expect(
        inflowFormHelpers.updateAccount(values, 'ngn-bank', 'NGN', 'NGN')
      ).toEqual({
        destinationAccountId: 'ngn-bank',
        sourceAccountId: 'sales',
        amount: { amount: 999, currencyCode: 'NGN', isMinorUnit: false },
        date: '2026-08-10',
        exchangeRate: '',
        isItemized: true,
        items: [
          {
            id: 'item-1',
            amount: { amount: 125, currencyCode: 'NGN', isMinorUnit: false },
            accountId: 'sales',
            description: ' Item description ',
          },
        ],
        payer: { id: 'payer-1', name: ' Acme ', type: 'organization' },
        description: ' Consulting ',
        receipt: null,
      });
    });
  });

  describe('createItem', () => {
    it('creates a stable blank item in the supplied currency', () => {
      expect(inflowFormHelpers.createItem('item-1', 'NGN')).toEqual({
        id: 'item-1',
        amount: {
          amount: Number.NaN,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
        accountId: '',
        description: '',
      });
    });

    it('seeds the amount and category when entering itemized mode', () => {
      expect(
        inflowFormHelpers.createItem('item-1', 'USD', 125, 'revenue-1')
      ).toEqual({
        id: 'item-1',
        amount: { amount: 125, currencyCode: 'USD', isMinorUnit: false },
        accountId: 'revenue-1',
        description: '',
      });
    });
  });

  describe('getItemTotal', () => {
    it('sums valid item amounts without floating-point artifacts', () => {
      expect(
        inflowFormHelpers.getItemTotal([
          {
            id: 'item-1',
            amount: { amount: 0.1, currencyCode: 'NGN', isMinorUnit: false },
            accountId: 'sales',
            description: '',
          },
          {
            id: 'item-2',
            amount: { amount: 0.2, currencyCode: 'NGN', isMinorUnit: false },
            accountId: 'services',
            description: '',
          },
        ])
      ).toBe(0.3);
    });

    it('treats incomplete item amounts as zero', () => {
      expect(
        inflowFormHelpers.getItemTotal([
          {
            id: 'item-1',
            amount: {
              amount: Number.NaN,
              currencyCode: 'NGN',
              isMinorUnit: false,
            },
            accountId: '',
            description: '',
          },
        ])
      ).toBe(0);
    });
  });

  describe('isExchangeRateRequired', () => {
    it('requires an exchange rate for different source and functional currencies', () => {
      expect(inflowFormHelpers.isExchangeRateRequired('USD', 'NGN')).toBe(true);
    });

    it('does not require an exchange rate for matching currencies', () => {
      expect(inflowFormHelpers.isExchangeRateRequired('NGN', 'NGN')).toBe(
        false
      );
    });

    it.each([
      [undefined, 'NGN'],
      ['USD', undefined],
      ['', 'NGN'],
    ])(
      'does not require an exchange rate when a currency is missing',
      (sourceCurrencyCode, functionalCurrencyCode) => {
        expect(
          inflowFormHelpers.isExchangeRateRequired(
            sourceCurrencyCode,
            functionalCurrencyCode
          )
        ).toBe(false);
      }
    );
  });

  describe('matchesOfficialRate', () => {
    const officialRate = {
      baseCurrencyCode: 'USD',
      targetCurrencyCode: 'NGN',
      asOf: '2026-08-10T00:00:00.000Z',
    } as IExchangeRate;

    it('matches the currency pair and date', () => {
      expect(
        inflowFormHelpers.matchesOfficialRate(
          officialRate,
          'USD',
          'NGN',
          '2026-08-10'
        )
      ).toBe(true);
    });

    it('rejects an absent or stale official rate', () => {
      expect(
        inflowFormHelpers.matchesOfficialRate(
          undefined,
          'USD',
          'NGN',
          '2026-08-10'
        )
      ).toBe(false);
      expect(
        inflowFormHelpers.matchesOfficialRate(
          officialRate,
          'USD',
          'NGN',
          '2026-08-09'
        )
      ).toBe(false);
    });
  });

  describe('normalizeValues', () => {
    it('derives the transaction amount from items and normalizes text', () => {
      expect(inflowFormHelpers.normalizeValues(values, true)).toEqual({
        destinationAccountId: 'usd-bank',
        sourceAccountId: 'sales',
        amount: { amount: 125, currencyCode: 'USD', isMinorUnit: false },
        date: '2026-08-10',
        exchangeRate: '1500',
        isItemized: true,
        items: [
          {
            id: 'item-1',
            amount: { amount: 125, currencyCode: 'USD', isMinorUnit: false },
            accountId: 'sales',
            description: 'Item description',
          },
        ],
        payer: { id: 'payer-1', name: 'Acme', type: 'organization' },
        description: 'Consulting',
        receipt: null,
      });
    });

    it('omits absent payer identity fields and clears an unneeded exchange rate', () => {
      expect(
        inflowFormHelpers.normalizeValues(
          {
            ...values,
            exchangeRate: '1500',
            payer: { name: ' New payer ' },
          },
          false
        )
      ).toEqual({
        destinationAccountId: 'usd-bank',
        sourceAccountId: 'sales',
        amount: { amount: 125, currencyCode: 'USD', isMinorUnit: false },
        date: '2026-08-10',
        exchangeRate: '',
        isItemized: true,
        items: [
          {
            id: 'item-1',
            amount: { amount: 125, currencyCode: 'USD', isMinorUnit: false },
            accountId: 'sales',
            description: 'Item description',
          },
        ],
        payer: { name: 'New payer' },
        description: 'Consulting',
        receipt: null,
      });
    });

    it('uses the official rate when a required manual rate is absent', () => {
      expect(
        inflowFormHelpers.normalizeValues(
          { ...values, exchangeRate: '' },
          true,
          1500
        ).exchangeRate
      ).toBe('1500');
    });
  });
});
