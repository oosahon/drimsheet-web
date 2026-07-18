import type { ITransferTransactionFormValues } from '@/bookkeeping/components/transfer-transaction-form';
import purpleLedgerApi from '@/shared/lib/api';
import {
  type IJournalLineReq,
  type IPaginationDto,
  type ITransferTransactionReq,
  EJournalEntryStatus,
  EJournalSide,
} from '@/shared/lib/api/Api';

async function recordTransaction(payload: ITransferTransactionFormValues) {
  const sourceLine: IJournalLineReq = {
    accountId: payload.sourceAccountId,
    amount: payload.amount,
    exchangeRate: null,
    description: payload.description,
    side: EJournalSide.Credit,
    sequenceOrder: 1,
  };

  const destinationLine: IJournalLineReq = {
    accountId: payload.destinationAccountId,
    amount: payload.amountReceived,
    exchangeRate: null,
    description: payload.description,
    side: EJournalSide.Debit,
    sequenceOrder: 2,
  };

  const journalEntry: ITransferTransactionReq = {
    sourceLine,
    destinationLines: [destinationLine],
    status: payload.pending
      ? EJournalEntryStatus.Draft
      : EJournalEntryStatus.Posted,
    effectiveDate: payload.date,
    postedAt: payload.date ? new Date().toISOString() : null,
    memo: payload.description,
  };

  const { data } =
    await purpleLedgerApi.journalEntry.recordTransfer(journalEntry);
  return data;
}

async function getAccountTransactions(
  accountId: string,
  pagination: IPaginationDto
) {
  const { data } = await purpleLedgerApi.ledger.listTransactions(
    accountId,
    pagination
  );
  return data;
}

const bookkeepingService = Object.freeze({
  recordTransaction,
  getAccountTransactions,
});

export default bookkeepingService;
