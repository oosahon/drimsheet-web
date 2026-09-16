import itemizedFieldsHelpers from '@/journal-entries/components/itemized-fields/helper';
import type { IItemizedFieldValue } from '@/journal-entries/components/itemized-fields/types';
import type { ILedgerAccountDto } from '@/shared/lib/api/Api';
import { describe, expect, it } from 'vitest';

const messages = {
  amountPositive: 'Amount must be positive',
  amountRequired: 'Amount is required',
  categoryRequired: 'Category is required',
};

const categories = [
  { id: 'sales', name: 'Sales revenue' },
  { id: 'services', name: 'Professional services' },
  { id: 'subscriptions', name: 'Subscriptions' },
] as unknown as ILedgerAccountDto[];

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

  describe('getAvailableAccounts', () => {
    const items: IItemizedFieldValue[] = [
      {
        id: 'item-1',
        amount: { amount: 125, currencyCode: 'NGN', isMinorUnit: false },
        accountId: 'sales',
        description: '',
      },
      {
        id: 'item-2',
        amount: { amount: 75, currencyCode: 'NGN', isMinorUnit: false },
        accountId: 'services',
        description: '',
      },
    ];

    it('excludes accounts selected by committed items from a new draft', () => {
      const draftItem: IItemizedFieldValue = {
        id: 'item-3',
        amount: {
          amount: Number.NaN,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
        accountId: '',
        description: '',
      };

      expect(
        itemizedFieldsHelpers.getAvailableAccounts(categories, items, draftItem)
      ).toEqual([categories[2]]);
      expect(categories.map((category) => category.id)).toEqual([
        'sales',
        'services',
        'subscriptions',
      ]);
      expect(items.map((item) => item.accountId)).toEqual([
        'sales',
        'services',
      ]);
    });

    it("retains the edited item's account and excludes other selections", () => {
      expect(
        itemizedFieldsHelpers.getAvailableAccounts(categories, items, items[0])
      ).toEqual([categories[0], categories[2]]);
    });
  });
});
