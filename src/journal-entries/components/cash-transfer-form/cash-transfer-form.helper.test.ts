import type { IExchangeRate, ILedgerAccountDto } from '@/shared/lib/api/Api';
import { describe, expect, it } from 'vitest';
import cashTransferFormHelpers from './cash-transfer-form.helper';
import type { ICashTransferFormValues } from './types';

const sourceAccounts = [
  {
    id: 'ngn-bank',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
  {
    id: 'usd-bank',
    balance: { amount: 0, currencyCode: 'USD', isMinorUnit: false },
  },
] as ILedgerAccountDto[];

const destinationAccounts = [
  {
    id: 'ngn-cash',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
  {
    id: 'usd-cash',
    balance: { amount: 0, currencyCode: 'USD', isMinorUnit: false },
  },
] as ILedgerAccountDto[];

const values: ICashTransferFormValues = {
  sourceAccountId: 'ngn-bank',
  destinationAccountId: 'ngn-cash',
  amountSent: { amount: 105.25, currencyCode: 'NGN', isMinorUnit: false },
  amountReceived: { amount: 100, currencyCode: 'NGN', isMinorUnit: false },
  date: '2026-08-30',
  exchangeRate: '',
  isItemized: true,
  items: [
    {
      id: 'fee-1',
      amount: { amount: 5.25, currencyCode: 'NGN', isMinorUnit: false },
      accountId: 'bank-fees',
      description: ' Fee ',
    },
  ],
  description: ' Transfer ',
  attachment: null,
};

const officialRate: IExchangeRate = {
  currencyPair: 'USD/NGN',
  baseCurrencyCode: 'USD',
  targetCurrencyCode: 'NGN',
  rate: 1500,
  type: 'official',
  asOf: '2026-08-30T00:00:00.000Z',
  source: 'Central bank',
  createdAt: '2026-08-30T00:00:00.000Z',
};

describe('cashTransferFormHelpers', () => {
  it('creates complete same-currency values and derives amount received', () => {
    expect(
      cashTransferFormHelpers.createInitialValues(
        {
          sourceAccountId: 'ngn-bank',
          destinationAccountId: 'ngn-cash',
          amountSent: { amount: 100 },
        },
        sourceAccounts,
        destinationAccounts,
        'NGN'
      )
    ).toEqual(
      expect.objectContaining({
        amountSent: { amount: 100, currencyCode: 'NGN', isMinorUnit: false },
        amountReceived: {
          amount: 100,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
      })
    );
  });

  it('derives forex received values and normalizes item currencies', () => {
    const initialValues = cashTransferFormHelpers.createInitialValues(
      {
        sourceAccountId: 'usd-bank',
        destinationAccountId: 'ngn-cash',
        amountSent: { amount: 100 },
        exchangeRate: '1500',
        isItemized: true,
        items: [values.items[0]!],
      },
      sourceAccounts,
      destinationAccounts,
      'NGN'
    );

    expect(initialValues.amountReceived.amount).toBe(149994.75);
    expect(initialValues.items[0]?.amount.currencyCode).toBe('NGN');
  });

  it('keeps amount sent authoritative while other values track it', () => {
    const forexValues: ICashTransferFormValues = {
      ...values,
      sourceAccountId: 'usd-bank',
      amountSent: { amount: 100, currencyCode: 'USD', isMinorUnit: false },
      amountReceived: {
        amount: 150000,
        currencyCode: 'NGN',
        isMinorUnit: false,
      },
      exchangeRate: '1500',
      isItemized: false,
      items: [],
    };
    const sentUpdated = cashTransferFormHelpers.updateAmountSent(
      forexValues,
      { amount: 200, currencyCode: 'USD', isMinorUnit: false },
      1500
    );
    const rateUpdated = cashTransferFormHelpers.updateExchangeRate(
      sentUpdated,
      '1000'
    );
    const receivedUpdated = cashTransferFormHelpers.updateAmountReceived(
      rateUpdated,
      { amount: 250000, currencyCode: 'NGN', isMinorUnit: false }
    );

    expect(sentUpdated.amountReceived.amount).toBe(300000);
    expect(rateUpdated.amountReceived.amount).toBe(200000);
    expect(receivedUpdated.exchangeRate).toBe('1250');
    expect(receivedUpdated.amountSent.amount).toBe(200);
  });

  it('recalculates received value when committed charges change', () => {
    const item = cashTransferFormHelpers.createItem('fee-2', 'NGN');
    const chargedValues = cashTransferFormHelpers.updateItems(
      { ...values, amountSent: { ...values.amountSent, amount: 110 } },
      [{ ...item, amount: { ...item.amount, amount: 10 } }]
    );

    expect(item.amount.amount).toBeNaN();
    expect(cashTransferFormHelpers.getItemTotal(chargedValues.items)).toBe(10);
    expect(cashTransferFormHelpers.getChargeTotal(chargedValues)).toBe(10);
    expect(chargedValues.amountReceived.amount).toBe(100);
    expect(cashTransferFormHelpers.isBalanced(chargedValues)).toBe(true);
  });

  it('resets stale rates and propagates account currencies', () => {
    const sourceUpdated = cashTransferFormHelpers.updateSourceAccount(
      { ...values, exchangeRate: '1500' },
      'usd-bank',
      'USD'
    );
    const destinationUpdated = cashTransferFormHelpers.updateDestinationAccount(
      sourceUpdated,
      'usd-cash',
      'USD'
    );

    expect(sourceUpdated.exchangeRate).toBe('');
    expect(sourceUpdated.amountSent.currencyCode).toBe('USD');
    expect(destinationUpdated.amountReceived.currencyCode).toBe('USD');
    expect(destinationUpdated.items[0]?.amount.currencyCode).toBe('USD');
    expect(destinationUpdated.amountReceived.amount).toBe(100);
  });

  it('resolves matching official rates and rejects unrelated rates', () => {
    const forexValues: ICashTransferFormValues = {
      ...values,
      sourceAccountId: 'usd-bank',
      amountSent: { amount: 100, currencyCode: 'USD', isMinorUnit: false },
      amountReceived: {
        amount: 150000,
        currencyCode: 'NGN',
        isMinorUnit: false,
      },
      exchangeRate: '',
      isItemized: false,
      items: [],
    };

    expect(
      cashTransferFormHelpers.matchesOfficialRate(
        officialRate,
        'USD',
        'NGN',
        forexValues.date
      )
    ).toBe(true);
    expect(
      cashTransferFormHelpers.getEffectiveExchangeRate(
        forexValues,
        officialRate
      )
    ).toBe(1500);
    expect(
      cashTransferFormHelpers.getEffectiveExchangeRate(forexValues, {
        ...officialRate,
        asOf: '2026-08-29T00:00:00.000Z',
      })
    ).toBeUndefined();
  });

  it('calculates and rounds source-to-destination transfer values', () => {
    expect(
      cashTransferFormHelpers.calculateAmountReceived(100, 1500, 5, true)
    ).toBe(149995);
    expect(cashTransferFormHelpers.calculateExchangeRate(100, 149995, 5)).toBe(
      '1500'
    );
    expect(cashTransferFormHelpers.round(0.1 + 0.2)).toBe(0.3);
    expect(cashTransferFormHelpers.isExchangeRateRequired('NGN', 'USD')).toBe(
      true
    );
    expect(
      cashTransferFormHelpers.getAccountCurrencyCode(sourceAccounts, 'usd-bank')
    ).toBe('USD');
  });

  it('normalizes text, resolves the official rate, and drops stale charges', () => {
    const forexValues: ICashTransferFormValues = {
      ...values,
      sourceAccountId: 'usd-bank',
      amountSent: { amount: 100, currencyCode: 'USD', isMinorUnit: false },
      amountReceived: {
        amount: 149994.75,
        currencyCode: 'NGN',
        isMinorUnit: false,
      },
      exchangeRate: '',
    };
    const normalized = cashTransferFormHelpers.normalizeValues(
      forexValues,
      officialRate
    );
    const singleEntry = cashTransferFormHelpers.normalizeValues({
      ...values,
      isItemized: false,
    });

    expect(normalized.exchangeRate).toBe('1500');
    expect(normalized.description).toBe('Transfer');
    expect(normalized.items[0]?.description).toBe('Fee');
    expect(singleEntry.items).toEqual([]);
  });
});
