import type { IOpeningBalanceExchangeRateContext } from '@/account/lib/types/opening-balance-exchange-rate.types';
import type { ICurrencyDto, IExchangeRate } from '@/shared/lib/api/Api';

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
  officialExchangeRate?: IExchangeRate;
  initialValues?: Partial<IPettyCashAccountFormValues>;
  loading?: boolean;
  disabled?: boolean;
  onExchangeRateContextChange: (
    context: IOpeningBalanceExchangeRateContext
  ) => void;
  onSubmit: (values: IPettyCashAccountFormValues) => Promise<void> | void;
}
