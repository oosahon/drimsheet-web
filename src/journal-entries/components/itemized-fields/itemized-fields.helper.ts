import type { IItemizedFieldErrors, IItemizedFieldValue } from './types';

interface IItemizedFieldsErrorMessages {
  amountPositive: string;
  amountRequired: string;
  categoryRequired: string;
}

function createItem(id: string, currencyCode: string): IItemizedFieldValue {
  return {
    id,
    amount: {
      amount: Number.NaN,
      currencyCode,
      isMinorUnit: false,
    },
    accountId: '',
    description: '',
  };
}

function getErrors(
  items: IItemizedFieldValue[],
  messages: IItemizedFieldsErrorMessages
) {
  return items.reduce<Record<string, IItemizedFieldErrors>>((errors, item) => {
    let amount: IItemizedFieldErrors['amount'];

    if (!Number.isFinite(item.amount.amount)) {
      amount = [{ message: messages.amountRequired }];
    } else if (item.amount.amount <= 0) {
      amount = [{ message: messages.amountPositive }];
    }

    errors[item.id] = {
      amount,
      accountId: item.accountId
        ? undefined
        : [{ message: messages.categoryRequired }],
    };

    return errors;
  }, {});
}

const itemizedFieldsHelpers = Object.freeze({
  createItem,
  getErrors,
});

export default itemizedFieldsHelpers;
