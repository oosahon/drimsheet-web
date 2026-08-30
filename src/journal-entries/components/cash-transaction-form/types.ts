import type { IItemizedFieldValue } from '@/journal-entries/components/itemized-fields';
import type {
  IExchangeRate,
  IJournalCounterpartyReq,
  ILedgerAccountDto,
  IMoneyDto,
} from '@/shared/lib/api/Api';

export interface ICashTransactionFormValues {
  accountId: string;
  categoryId: string;
  amount: IMoneyDto;
  date: string;
  exchangeRate: string;
  isItemized: boolean;
  items: IItemizedFieldValue[];
  counterparty: IJournalCounterpartyReq;
  description: string;
  attachment: File | null;
}

export interface ICashTransactionFormInitialValues {
  accountId?: string;
  categoryId?: string;
  amount?: Partial<IMoneyDto>;
  date?: string;
  exchangeRate?: string;
  isItemized?: boolean;
  items?: IItemizedFieldValue[];
  counterparty?: Partial<IJournalCounterpartyReq>;
  description?: string;
  attachment?: File | null;
}

export interface ICashTransactionCurrencyContext {
  currencyCode: string;
  date: string;
}

export type UCashTransactionFormVariant = 'inflow' | 'outflow';

export interface CashTransactionFormProps {
  accounts: ILedgerAccountDto[];
  categories: ILedgerAccountDto[];
  counterpartyOptions?: IJournalCounterpartyReq[];
  disabled?: boolean;
  functionalCurrencyCode: string;
  initialValues?: ICashTransactionFormInitialValues;
  loading?: boolean;
  officialExchangeRate?: IExchangeRate;
  onCurrencyContextChange: (context: ICashTransactionCurrencyContext) => void;
  onSubmit: (values: ICashTransactionFormValues) => void;
  variant?: UCashTransactionFormVariant;
}
