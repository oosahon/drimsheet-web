import type {
  IJournalCounterpartyReq,
  ILedgerAccountDto,
  IMoneyDto,
} from '@/shared/lib/api/Api';

export interface IInflowFormValues {
  sourceAccountId: string;
  categoryAccountId: string;
  amount: IMoneyDto;
  exchangeRate: string;
  payer: IJournalCounterpartyReq;
  description: string;
}

export interface IInflowFormInitialValues {
  sourceAccountId?: string;
  categoryAccountId?: string;
  amount?: Partial<IMoneyDto>;
  exchangeRate?: string;
  payer?: Partial<IJournalCounterpartyReq>;
  description?: string;
}

export interface InflowFormProps {
  accounts: ILedgerAccountDto[];
  disabled?: boolean;
  functionalCurrencyCode: string;
  initialValues?: IInflowFormInitialValues;
  loading?: boolean;
  onSplit?: (values: IInflowFormValues) => void;
  onSubmit: (values: IInflowFormValues) => void;
  payerOptions?: IJournalCounterpartyReq[];
}
