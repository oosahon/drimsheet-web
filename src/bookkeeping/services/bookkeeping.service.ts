import type { ITransferTransactionFormValues } from '@/bookkeeping/ui/components/transfer-transaction-form';
import purpleLedgerApi from '@/shared/utils/api';
import {
  type IJournalLineDto,
  type ITransferTransactionReq,
  EJournalEntryStatus,
  EJournalSide,
} from '@/shared/utils/api/Api';

async function recordTransaction(payload: ITransferTransactionFormValues) {
  const sourceLine: IJournalLineDto = {
    accountId: payload.sourceAccountId,
    amount: payload.amount,
    exchangeRate: null,
    description: payload.description,
    side: EJournalSide.Credit,
    sequenceOrder: 1,
  };

  const destingationLine: IJournalLineDto = {
    accountId: payload.destinationAccountId,
    amount: payload.amountReceived,
    exchangeRate: null,
    description: payload.description,
    side: EJournalSide.Debit,
    sequenceOrder: 2,
  };

  const journalEntry: ITransferTransactionReq = {
    sourceLine,
    destinationLines: [destingationLine],
    status: payload.pending
      ? EJournalEntryStatus.Draft
      : EJournalEntryStatus.Posted,
    effectiveDate: payload.date,
    postedAt: payload.date ? new Date().toISOString() : null,
    memo: payload.description,
  };

  const { data } =
    await purpleLedgerApi.bookkeeping.recordTransfer(journalEntry);
  return data;
}

const bookkeepingService = Object.freeze({
  recordTransaction,
});

export default bookkeepingService;
