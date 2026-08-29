import { describe, expect, it } from 'vitest';
import itemizedFieldsHelpers from './itemized-fields.helper';

const messages = {
  amountPositive: 'Amount must be positive',
  amountRequired: 'Amount is required',
  categoryRequired: 'Category is required',
};

describe('itemizedFieldsHelpers', () => {
  describe('createItem', () => {
    it('creates a blank item with stable identity and currency', () => {
      expect(itemizedFieldsHelpers.createItem('item-1', 'NGN')).toEqual({
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
  });

  describe('getErrors', () => {
    it('projects item validation errors by stable row identity', () => {
      expect(
        itemizedFieldsHelpers.getErrors(
          [
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
          ],
          messages
        )
      ).toEqual({
        'item-1': {
          amount: [{ message: 'Amount is required' }],
          accountId: [{ message: 'Category is required' }],
        },
      });
    });

    it('returns no field errors for a valid item', () => {
      expect(
        itemizedFieldsHelpers.getErrors(
          [
            {
              id: 'item-1',
              amount: { amount: 10, currencyCode: 'NGN', isMinorUnit: false },
              accountId: 'sales',
              description: '',
            },
          ],
          messages
        )
      ).toEqual({
        'item-1': {
          amount: undefined,
          accountId: undefined,
        },
      });
    });
  });
});
