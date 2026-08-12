import type { IInflowFormValues } from '@/journal-entries/components/inflow-form/types';
import { describe, expect, it } from 'vitest';
import { normalizeInflowFormValues } from './normalize-inflow-form-values.helper';

const values: IInflowFormValues = {
  destinationAccountId: 'usd-bank',
  categoryAccountId: 'sales',
  amount: { amount: 125, currencyCode: 'USD', isMinorUnit: false },
  exchangeRate: ' 1500 ',
  payer: { id: 'payer-1', name: ' Acme ', type: 'organization' },
  description: 'Consulting',
};

describe('normalizeInflowFormValues', () => {
  it('maps every value and trims payer and required exchange-rate text', () => {
    expect(normalizeInflowFormValues(values, true)).toEqual({
      destinationAccountId: 'usd-bank',
      categoryAccountId: 'sales',
      amount: { amount: 125, currencyCode: 'USD', isMinorUnit: false },
      exchangeRate: '1500',
      payer: { id: 'payer-1', name: 'Acme', type: 'organization' },
      description: 'Consulting',
    });
  });

  it('omits absent payer identity fields and clears an unneeded exchange rate', () => {
    expect(
      normalizeInflowFormValues(
        {
          ...values,
          exchangeRate: '1500',
          payer: { name: ' New payer ' },
        },
        false
      )
    ).toEqual({
      destinationAccountId: 'usd-bank',
      categoryAccountId: 'sales',
      amount: { amount: 125, currencyCode: 'USD', isMinorUnit: false },
      exchangeRate: '',
      payer: { name: 'New payer' },
      description: 'Consulting',
    });
  });
});
