import type {
  IInflowFormInitialValues,
  IInflowFormValues,
} from '@/journal-entries/components/inflow-form/types';
import type { ILedgerAccountDto } from '@/shared/lib/api/Api';

export function createInflowFormInitialValues(
  initialValues: IInflowFormInitialValues | undefined,
  accounts: ILedgerAccountDto[],
  functionalCurrencyCode: string
): IInflowFormValues {
  const selectedAccountCurrency = accounts.find(
    (account) => account.id === initialValues?.sourceAccountId
  )?.balance.currencyCode;

  return {
    sourceAccountId: initialValues?.sourceAccountId ?? '',
    categoryAccountId: initialValues?.categoryAccountId ?? '',
    amount: {
      amount: initialValues?.amount?.amount ?? Number.NaN,
      currencyCode:
        selectedAccountCurrency ??
        initialValues?.amount?.currencyCode ??
        functionalCurrencyCode,
      isMinorUnit: initialValues?.amount?.isMinorUnit ?? false,
    },
    exchangeRate: initialValues?.exchangeRate ?? '',
    payer: {
      id: initialValues?.payer?.id,
      name: initialValues?.payer?.name ?? '',
      type: initialValues?.payer?.type,
    },
    description: initialValues?.description ?? '',
  };
}
