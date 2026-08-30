import type { ICashTransactionFormValues } from '@/journal-entries/components/cash-transaction-form';
import { journalEntryMapper } from '@/journal-entries/lib/mappers/journal-entry.mapper';
import { EExchangeRateType } from '@/shared/lib/api/Api';
import { describe, expect, it } from 'vitest';

const occurredAt = '2026-08-12T10:30:00.000Z';

const values: ICashTransactionFormValues = {
  accountId: 'ngn-bank',
  categoryId: 'sales-revenue',
  amount: { amount: 250000, currencyCode: 'NGN', isMinorUnit: false },
  date: '2026-08-10',
  exchangeRate: '',
  isItemized: false,
  items: [],
  counterparty: { name: 'New counterparty' },
  description: '  August receipt  ',
  attachment: null,
};

const paymentValues: ICashTransactionFormValues = {
  accountId: 'ngn-bank',
  categoryId: 'office-expense',
  amount: { amount: 250000, currencyCode: 'NGN', isMinorUnit: false },
  date: '2026-08-10',
  exchangeRate: '',
  isItemized: false,
  items: [],
  counterparty: { name: 'New recipient' },
  description: '  August payment  ',
  attachment: null,
};

describe('journalEntryMapper', () => {
  it('maps foreign-currency context to the official exchange-rate query', () => {
    expect(
      journalEntryMapper.toExchangeRateQuery(
        { currencyCode: 'USD', date: '2026-08-10' },
        'NGN'
      )
    ).toEqual({
      currencyPair: 'USD/NGN',
      type: EExchangeRateType.Official,
      asOf: '2026-08-10',
      limit: 1,
    });
  });

  it.each([
    [undefined, 'NGN'],
    [{ currencyCode: '', date: '2026-08-10' }, 'NGN'],
    [{ currencyCode: 'USD', date: '' }, 'NGN'],
    [{ currencyCode: 'USD', date: '2026-08-10' }, ''],
    [{ currencyCode: 'NGN', date: '2026-08-10' }, 'NGN'],
  ])(
    'omits the exchange-rate query when conversion context is incomplete or same-currency',
    (currencyContext, functionalCurrencyCode) => {
      expect(
        journalEntryMapper.toExchangeRateQuery(
          currencyContext,
          functionalCurrencyCode
        )
      ).toBeUndefined();
    }
  );

  it('maps a single functional-currency payment and attachment references', () => {
    expect(
      journalEntryMapper.toPaymentEntryReq(paymentValues, 'NGN', occurredAt, [
        'attachment-1',
      ])
    ).toEqual({
      attachmentReferences: ['attachment-1'],
      sourceLine: {
        accountId: 'ngn-bank',
        counterparty: { name: 'New recipient' },
        amount: {
          amount: 250000,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
        exchangeRate: null,
        description: 'August payment',
        sequenceOrder: 1,
      },
      destinationLines: [
        {
          accountId: 'office-expense',
          counterparty: { name: 'New recipient' },
          amount: {
            amount: 250000,
            currencyCode: 'NGN',
            isMinorUnit: false,
          },
          exchangeRate: null,
          description: 'August payment',
          sequenceOrder: 2,
        },
      ],
      effectiveDate: '2026-08-10',
      postedAt: occurredAt,
      memo: 'August payment',
    });
  });

  it('maps itemized accounts to destination lines after the payment source', () => {
    const result = journalEntryMapper.toPaymentEntryReq(
      {
        ...paymentValues,
        categoryId: 'inactive-destination',
        isItemized: true,
        items: [
          {
            id: 'ui-only-1',
            amount: {
              amount: 100000,
              currencyCode: 'NGN',
              isMinorUnit: false,
            },
            accountId: 'office-expense',
            description: ' Supplies ',
          },
          {
            id: 'ui-only-2',
            amount: {
              amount: 150000,
              currencyCode: 'NGN',
              isMinorUnit: false,
            },
            accountId: 'travel-expense',
            description: '',
          },
        ],
      },
      'NGN',
      occurredAt
    );

    expect(result.sourceLine).toEqual({
      accountId: 'ngn-bank',
      counterparty: { name: 'New recipient' },
      amount: {
        amount: 250000,
        currencyCode: 'NGN',
        isMinorUnit: false,
      },
      exchangeRate: null,
      description: 'August payment',
      sequenceOrder: 1,
    });
    expect(result.destinationLines).toEqual([
      {
        accountId: 'office-expense',
        counterparty: { name: 'New recipient' },
        amount: {
          amount: 100000,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
        exchangeRate: null,
        description: 'Supplies',
        sequenceOrder: 2,
      },
      {
        accountId: 'travel-expense',
        counterparty: { name: 'New recipient' },
        amount: {
          amount: 150000,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
        exchangeRate: null,
        description: null,
        sequenceOrder: 3,
      },
    ]);
  });

  it('uses the selected date for a manual payment exchange rate', () => {
    const result = journalEntryMapper.toPaymentEntryReq(
      {
        ...paymentValues,
        accountId: 'usd-bank',
        amount: { amount: 1250, currencyCode: 'USD', isMinorUnit: false },
        exchangeRate: '1500',
        counterparty: {
          id: 'counterparty-1',
          name: 'Acme',
          type: 'organization',
        },
      },
      'NGN',
      occurredAt
    );

    expect(result.sourceLine.exchangeRate).toEqual({
      baseCurrencyCode: 'USD',
      targetCurrencyCode: 'NGN',
      rate: 1500,
      type: EExchangeRateType.Market,
      asOf: '2026-08-10',
      source: 'manual',
    });
    expect(result.effectiveDate).toBe('2026-08-10');
    expect(result.postedAt).toBe(occurredAt);
    expect(result.attachmentReferences).toEqual([]);
    expect(result.destinationLines[0]?.exchangeRate).toEqual(
      result.sourceLine.exchangeRate
    );
  });

  it('maps a single functional-currency receipt and attachment references', () => {
    expect(
      journalEntryMapper.toReceiptEntryReq(values, 'NGN', occurredAt, [
        'attachment-1',
      ])
    ).toEqual({
      attachmentReferences: ['attachment-1'],
      sourceLines: [
        {
          accountId: 'sales-revenue',
          counterparty: { name: 'New counterparty' },
          amount: {
            amount: 250000,
            currencyCode: 'NGN',
            isMinorUnit: false,
          },
          exchangeRate: null,
          description: 'August receipt',
          sequenceOrder: 1,
        },
      ],
      destinationLine: {
        accountId: 'ngn-bank',
        counterparty: { name: 'New counterparty' },
        amount: {
          amount: 250000,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
        exchangeRate: null,
        description: 'August receipt',
        sequenceOrder: 2,
      },
      effectiveDate: '2026-08-10',
      postedAt: occurredAt,
      memo: 'August receipt',
    });
  });

  it('maps itemized accounts to source lines and the total to the destination', () => {
    const result = journalEntryMapper.toReceiptEntryReq(
      {
        ...values,
        categoryId: 'inactive-source',
        isItemized: true,
        items: [
          {
            id: 'ui-only-1',
            amount: {
              amount: 100000,
              currencyCode: 'NGN',
              isMinorUnit: false,
            },
            accountId: 'sales',
            description: ' Product ',
          },
          {
            id: 'ui-only-2',
            amount: {
              amount: 150000,
              currencyCode: 'NGN',
              isMinorUnit: false,
            },
            accountId: 'services',
            description: '',
          },
        ],
      },
      'NGN',
      occurredAt
    );

    expect(result.sourceLines).toEqual([
      expect.objectContaining({
        accountId: 'sales',
        amount: expect.objectContaining({ amount: 100000 }),
        description: 'Product',
        sequenceOrder: 1,
      }),
      expect.objectContaining({
        accountId: 'services',
        amount: expect.objectContaining({ amount: 150000 }),
        description: null,
        sequenceOrder: 2,
      }),
    ]);
    expect(result.destinationLine).toEqual({
      accountId: 'ngn-bank',
      counterparty: { name: 'New counterparty' },
      amount: {
        amount: 250000,
        currencyCode: 'NGN',
        isMinorUnit: false,
      },
      exchangeRate: null,
      description: 'August receipt',
      sequenceOrder: 3,
    });
  });

  it('uses the selected date for a manual foreign exchange rate', () => {
    const result = journalEntryMapper.toReceiptEntryReq(
      {
        ...values,
        accountId: 'usd-bank',
        amount: { amount: 1250, currencyCode: 'USD', isMinorUnit: false },
        exchangeRate: '1500',
        counterparty: {
          id: 'counterparty-1',
          name: 'Acme',
          type: 'organization',
        },
      },
      'NGN',
      occurredAt
    );

    expect(result.sourceLines[0]?.exchangeRate).toEqual({
      baseCurrencyCode: 'USD',
      targetCurrencyCode: 'NGN',
      rate: 1500,
      type: EExchangeRateType.Market,
      asOf: '2026-08-10',
      source: 'manual',
    });
    expect(result.effectiveDate).toBe('2026-08-10');
    expect(result.postedAt).toBe(occurredAt);
    expect(result.attachmentReferences).toEqual([]);
    expect(result.destinationLine.exchangeRate).toEqual(
      result.sourceLines[0]?.exchangeRate
    );
  });
});
