import type { MoneyInputProps } from '@/shared/components/money-input';
import type { IExchangeRate } from '@/shared/lib/api/Api';

export interface ICurrencyExchangeRateInputValue {
  value: number;
  inverted: boolean;
}

export interface CurrencyExchangeRateInputProps extends Pick<
  MoneyInputProps,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'autoFocus'
  | 'className'
  | 'disabled'
  | 'id'
  | 'name'
  | 'onBlur'
  | 'placeholder'
  | 'required'
> {
  baseCurrency: string;
  targetCurrency: string;
  displayOfficialRate?: boolean;
  layout?: 'default' | 'compact';
  officialRate?: IExchangeRate;
  value: ICurrencyExchangeRateInputValue | null;
  onChange: (value: ICurrencyExchangeRateInputValue | null) => void;
}
