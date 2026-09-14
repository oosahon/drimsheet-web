import type { IItemizedFieldValue } from '@/journal-entries/components/itemized-fields';
import type {
  IExchangeRate,
  ILedgerAccountDto,
  IMoneyDto,
} from '@/shared/lib/api/Api';

export interface ICashTransferFormValues {
  sourceAccountId: string;
  destinationAccountId: string;
  amountSent: IMoneyDto;
  amountReceived: IMoneyDto;
  date: string;
  exchangeRate: string;
  isItemized: boolean;
  items: IItemizedFieldValue[];
  description: string;
  attachment: File | null;
}

export interface ICashTransferFormInitialValues {
  sourceAccountId?: string;
  destinationAccountId?: string;
  amountSent?: Partial<IMoneyDto>;
  amountReceived?: Partial<IMoneyDto>;
  date?: string;
  exchangeRate?: string;
  isItemized?: boolean;
  items?: IItemizedFieldValue[];
  description?: string;
  attachment?: File | null;
}

export interface ICashTransferCurrencyContext {
  sourceCurrencyCode: string;
  destinationCurrencyCode: string;
  date: string;
}

export interface CashTransferFormProps {
  sourceAccounts: ILedgerAccountDto[];
  destinationAccounts: ILedgerAccountDto[];
  categories: ILedgerAccountDto[];
  disabled?: boolean;
  functionalCurrencyCode: string;
  initialValues?: ICashTransferFormInitialValues;
  loading?: boolean;
  officialExchangeRate?: IExchangeRate;
  onCurrencyContextChange: (context: ICashTransferCurrencyContext) => void;
  onSubmit: (values: ICashTransferFormValues) => void;
}
