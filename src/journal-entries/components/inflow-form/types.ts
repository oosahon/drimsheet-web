import type { IItemizedFieldValue } from '@/journal-entries/components/itemized-fields';
import type {
  IExchangeRate,
  IJournalCounterpartyReq,
  ILedgerAccountDto,
  IMoneyDto,
} from '@/shared/lib/api/Api';

export interface IInflowFormValues {
  destinationAccountId: string;
  sourceAccountId: string;
  amount: IMoneyDto;
  date: string;
  exchangeRate: string;
  isItemized: boolean;
  items: IItemizedFieldValue[];
  payer: IJournalCounterpartyReq;
  description: string;
  receipt: File | null;
}

export interface IInflowFormInitialValues {
  destinationAccountId?: string;
  sourceAccountId?: string;
  amount?: Partial<IMoneyDto>;
  date?: string;
  exchangeRate?: string;
  isItemized?: boolean;
  items?: IItemizedFieldValue[];
  payer?: Partial<IJournalCounterpartyReq>;
  description?: string;
  receipt?: File | null;
}

export interface IInflowCurrencyContext {
  currencyCode: string;
  date: string;
}

export interface InflowFormProps {
  destinationAccounts: ILedgerAccountDto[];
  disabled?: boolean;
  functionalCurrencyCode: string;
  initialValues?: IInflowFormInitialValues;
  loading?: boolean;
  officialExchangeRate?: IExchangeRate;
  onCurrencyContextChange: (context: IInflowCurrencyContext) => void;
  onSubmit: (values: IInflowFormValues) => void;
  payerOptions?: IJournalCounterpartyReq[];
  sourceAccounts: ILedgerAccountDto[];
}
