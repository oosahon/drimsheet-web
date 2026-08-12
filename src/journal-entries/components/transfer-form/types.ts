import type { ILedgerAccountDto, IMoneyDto } from '@/shared/lib/api/Api';

export interface ITransferFormValues {
  sourceAccountId: string;
  destinationAccountId: string;
  amountSent: IMoneyDto;
  amountReceived: IMoneyDto;
  description: string;
  createAnother: boolean;
}

export interface TransferFormProps {
  accounts: ILedgerAccountDto[];
  values: ITransferFormValues;
  onChange: (values: ITransferFormValues) => void;
  onCreate: () => void;
}
