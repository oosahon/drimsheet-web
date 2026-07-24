import type {
  ICurrencyDto,
  ULedgerAccountBehavior,
} from '@/shared/lib/api/Api';

export interface AccountTypeOption {
  value: ULedgerAccountBehavior;
  label: string;
}

export interface IAccountCreationFormValues {
  name: string;
  accountType: ULedgerAccountBehavior | '';
  currencyCode: string;
  createWithoutOpeningBalance: boolean;
  openingBalance: number | '';
  openingDate: string;
  exchangeRate: number | '';
  isSubAccount: boolean;
}

export interface AccountCreationFormProps {
  accountingCurrencyCode: string;
  accountTypes: AccountTypeOption[];
  currencies: ICurrencyDto[];
  initialValues?: Partial<IAccountCreationFormValues>;
  loading?: boolean;
  disabled?: boolean;
  onSubmit: (values: IAccountCreationFormValues) => Promise<void> | void;
}

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
