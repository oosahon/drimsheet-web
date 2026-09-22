import type {
  ICashTransactionDetails,
  ITransferTransactionDetails,
  UTransactionDetails,
} from '@/journal-entries/lib/types/transaction-details';

export interface TransactionDetailsProps {
  details: UTransactionDetails;
}

export interface CashTransactionDetailsProps {
  details: ICashTransactionDetails;
}

export interface TransferTransactionDetailsProps {
  details: ITransferTransactionDetails;
}
