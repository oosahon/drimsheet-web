import type {
  ICashTransactionDetails,
  ITransferTransactionDetails,
  UTransactionDetails,
} from '@/journal-entries/lib/types/transaction-details';

export interface TransactionDetailsProps {
  details?: UTransactionDetails;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export interface CashTransactionDetailsProps {
  details: ICashTransactionDetails;
}

export interface TransferTransactionDetailsProps {
  details: ITransferTransactionDetails;
}
