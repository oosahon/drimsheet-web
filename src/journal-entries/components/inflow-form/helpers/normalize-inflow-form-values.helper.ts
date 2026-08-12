import type { IInflowFormValues } from '@/journal-entries/components/inflow-form/types';
import type { IJournalCounterpartyReq } from '@/shared/lib/api/Api';

export function normalizeInflowFormValues(
  values: IInflowFormValues,
  exchangeRateRequired: boolean
): IInflowFormValues {
  const payer: IJournalCounterpartyReq = {
    name: values.payer.name.trim(),
  };

  if (values.payer.id !== undefined) payer.id = values.payer.id;
  if (values.payer.type !== undefined) payer.type = values.payer.type;

  return {
    sourceAccountId: values.sourceAccountId,
    categoryAccountId: values.categoryAccountId,
    amount: {
      amount: values.amount.amount,
      currencyCode: values.amount.currencyCode,
      isMinorUnit: values.amount.isMinorUnit,
    },
    exchangeRate: exchangeRateRequired ? values.exchangeRate.trim() : '',
    payer,
    description: values.description,
  };
}
