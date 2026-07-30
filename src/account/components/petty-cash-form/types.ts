import type { ICurrencyDto } from '@/shared/lib/api/Api';

export interface IPettyCashFormValues {
  name: string;
  currencyCode: string;
  createWithoutOpeningBalance: boolean;
  openingBalance: number | '';
  openingDate: string;
  exchangeRate: number | '';
  isSubAccount: boolean;
}

export interface PettyCashFormProps {
  accountingCurrencyCode: string;
  currencies: ICurrencyDto[];
  initialValues?: Partial<IPettyCashFormValues>;
  loading?: boolean;
  disabled?: boolean;
  onSubmit: (values: IPettyCashFormValues) => Promise<void> | void;
}
