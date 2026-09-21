import type {
  EJournalEntrySourceType,
  IExchangeRate,
  IFileAttachment,
  IMoneyDto,
} from '@/shared/lib/api/Api';

export type UCashTransactionDirection =
  | typeof EJournalEntrySourceType.Payment
  | typeof EJournalEntrySourceType.Receipt;

export interface ITransactionDetailsCounterparty {
  id: string;
  name: string;
}

export interface ITransactionDetailsLine {
  id: string;
  accountId: string;
  accountName: string;
  amount: IMoneyDto;
  description: string | null;
}

interface ITransactionDetailsBase {
  attachments: IFileAttachment[];
  effectiveDate: string;
  memo: string | null;
}

export interface ICashTransactionDetails extends ITransactionDetailsBase {
  kind: 'cash';
  direction: UCashTransactionDirection;
  amount: IMoneyDto;
  cashAccountName: string;
  categories: ITransactionDetailsLine[];
  counterparties: ITransactionDetailsCounterparty[];
  exchangeRate: IExchangeRate | null;
  functionalAmount: IMoneyDto;
}

export interface ITransferTransactionDetails extends ITransactionDetailsBase {
  kind: 'transfer';
  direction: typeof EJournalEntrySourceType.Transfer;
  destinationAccountName: string;
  destinationAmount: IMoneyDto;
  exchangeRate: IExchangeRate | null;
  fees: ITransactionDetailsLine[];
  sourceAccountName: string;
  sourceAmount: IMoneyDto;
}

export type UTransactionDetails =
  | ICashTransactionDetails
  | ITransferTransactionDetails;
