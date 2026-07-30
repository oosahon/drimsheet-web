interface FieldError {
  message?: string;
}

export interface OpeningBalanceFieldsProps {
  accountingCurrencyCode: string;
  currencyCode: string;
  createWithoutOpeningBalance: boolean;
  openingBalance: number | '';
  openingDate: string;
  exchangeRate: number | '';
  disabled?: boolean;
  openingBalanceError?: Array<FieldError | undefined>;
  openingDateError?: Array<FieldError | undefined>;
  exchangeRateError?: Array<FieldError | undefined>;
  onCreateWithoutOpeningBalanceChange: (checked: boolean) => void;
  onOpeningBalanceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpeningDateChange: (value: string) => void;
  onExchangeRateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
