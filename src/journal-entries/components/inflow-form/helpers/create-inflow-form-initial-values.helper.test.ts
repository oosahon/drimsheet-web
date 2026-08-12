import type { ILedgerAccountDto } from '@/shared/lib/api/Api';
import { describe, expect, it } from 'vitest';
import { createInflowFormInitialValues } from './create-inflow-form-initial-values.helper';

const destinationAccounts = [
  {
    id: 'usd-bank',
    balance: { amount: 0, currencyCode: 'USD', isMinorUnit: false },
  },
] as unknown as ILedgerAccountDto[];

describe('createInflowFormInitialValues', () => {
  it('creates empty values with the functional currency defaults', () => {
    expect(
      createInflowFormInitialValues(undefined, destinationAccounts, 'NGN')
    ).toEqual({
      destinationAccountId: '',
      categoryAccountId: '',
      amount: {
        amount: Number.NaN,
        currencyCode: 'NGN',
        isMinorUnit: false,
      },
      exchangeRate: '',
      payer: {
        id: undefined,
        name: '',
        type: undefined,
      },
      description: '',
    });
  });

  it('prefers the selected account currency over supplied amount currency', () => {
    expect(
      createInflowFormInitialValues(
        {
          destinationAccountId: 'usd-bank',
          categoryAccountId: 'sales',
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
      categoryAccountId: 'sales',
      amount: {
        amount: 125,
        currencyCode: 'USD',
        isMinorUnit: true,
      },
      exchangeRate: '1500',
      payer: { id: 'payer-1', name: 'Acme', type: 'organization' },
      description: 'Consulting',
    });
  });

  it('uses a supplied amount currency when no selected account resolves', () => {
    const values = createInflowFormInitialValues(
      { amount: { currencyCode: 'EUR' } },
      destinationAccounts,
      'NGN'
    );

    expect(values.amount.currencyCode).toBe('EUR');
  });
});
