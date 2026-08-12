import type { IInflowFormValues } from '@/journal-entries/components/inflow-form';
import { journalEntryMapper } from '@/journal-entries/lib/mappers/journal-entry.mapper';
import { EExchangeRateType } from '@/shared/lib/api/Api';
import { describe, expect, it } from 'vitest';

const occurredAt = '2026-08-12T10:30:00.000Z';

describe('journalEntryMapper', () => {
  it('maps a functional-currency receipt with a name-only payer and nullable descriptions', () => {
    const values = {
      destinationAccountId: 'ngn-bank',
      categoryAccountId: 'sales-revenue',
      amount: { amount: 250000, currencyCode: 'NGN', isMinorUnit: false },
      exchangeRate: '',
      payer: { name: 'New payer' },
      description: '   ',
      browserOnlyValue: 'must not leak',
    } as IInflowFormValues;

    expect(
      journalEntryMapper.toReceiptEntryReq(values, 'NGN', occurredAt)
    ).toEqual({
      sourceLine: {
        accountId: 'sales-revenue',
        counterparty: { name: 'New payer' },
        amount: {
          amount: 250000,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
        exchangeRate: null,
        description: null,
        sequenceOrder: 1,
      },
      destinationLines: [
        {
          accountId: 'ngn-bank',
          counterparty: { name: 'New payer' },
          amount: {
            amount: 250000,
            currencyCode: 'NGN',
            isMinorUnit: false,
          },
          exchangeRate: null,
          description: null,
          sequenceOrder: 2,
        },
      ],
      effectiveDate: occurredAt,
      postedAt: occurredAt,
      memo: null,
    });
  });

  it('maps a foreign-currency receipt with a projected existing payer and exchange rates', () => {
    const values = {
      destinationAccountId: 'usd-bank',
      categoryAccountId: 'consulting-revenue',
      amount: { amount: 1250.5, currencyCode: 'USD', isMinorUnit: false },
      exchangeRate: '1500',
      payer: {
        id: 'payer-1',
        name: 'Acme Consulting',
        type: 'organization',
        status: 'active',
        roles: ['customer'],
      },
      description: '  August consulting retainer  ',
    } as IInflowFormValues;

    const exchangeRate = {
      baseCurrencyCode: 'USD',
      targetCurrencyCode: 'NGN',
      rate: 1500,
      type: EExchangeRateType.Market,
      asOf: occurredAt,
      source: 'manual',
    };

    expect(
      journalEntryMapper.toReceiptEntryReq(values, 'NGN', occurredAt)
    ).toEqual({
      sourceLine: {
        accountId: 'consulting-revenue',
        counterparty: {
          id: 'payer-1',
          name: 'Acme Consulting',
          type: 'organization',
        },
        amount: {
          amount: 1250.5,
          currencyCode: 'USD',
          isMinorUnit: false,
        },
        exchangeRate,
        description: 'August consulting retainer',
        sequenceOrder: 1,
      },
      destinationLines: [
        {
          accountId: 'usd-bank',
          counterparty: {
            id: 'payer-1',
            name: 'Acme Consulting',
            type: 'organization',
          },
          amount: {
            amount: 1250.5,
            currencyCode: 'USD',
            isMinorUnit: false,
          },
          exchangeRate,
          description: 'August consulting retainer',
          sequenceOrder: 2,
        },
      ],
      effectiveDate: occurredAt,
      postedAt: occurredAt,
      memo: 'August consulting retainer',
    });
  });
});
