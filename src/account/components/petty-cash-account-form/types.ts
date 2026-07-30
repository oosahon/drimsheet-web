import type { ICurrencyDto } from '@/shared/lib/api/Api';

export interface IPettyCashAccountFormValues {
  name: string;
  currencyCode: string;
  createWithoutOpeningBalance: boolean;
  openingBalance: number | '';
  openingDate: string;
  exchangeRate: number | '';
  isSubAccount: boolean;
}

export interface PettyCashAccountFormProps {
  accountingCurrencyCode: string;
  currencies: ICurrencyDto[];
  initialValues?: Partial<IPettyCashAccountFormValues>;
  loading?: boolean;
  disabled?: boolean;
  onSubmit: (values: IPettyCashAccountFormValues) => Promise<void> | void;
}
