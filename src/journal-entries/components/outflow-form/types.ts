import type { ILedgerAccountDto, IMoneyDto } from '@/shared/lib/api/Api';

export interface IOutflowFormValues {
  sourceAccountId: string;
  categoryAccountId: string;
  amount: IMoneyDto;
  exchangeRate: string;
  counterpartyName: string;
  description: string;
  createAnother: boolean;
}
export interface OutflowFormProps {
  accounts: ILedgerAccountDto[];
  functionalCurrencyCode: string;
  values: IOutflowFormValues;
  onChange: (values: IOutflowFormValues) => void;
  onCreate: () => void;
}
