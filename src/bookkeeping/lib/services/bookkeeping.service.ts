import type { ITransferTransactionFormValues } from '@/bookkeeping/components/transfer-transaction-form';
import { drimsheetApi } from '@/shared/lib/api';
import {
  EContentType,
  EJournalEntryStatus,
  EJournalSide,
  type IHttpErrorDto,
  type IPaginationDto,
} from '@/shared/lib/api/Api';

async function recordTransaction(payload: ITransferTransactionFormValues) {
  const sourceLine = {
    accountId: payload.sourceAccountId,
    amount: payload.amount,
    exchangeRate: null,
    description: payload.description,
    side: EJournalSide.Credit,
    sequenceOrder: 1,
  };

  const destinationLine = {
    accountId: payload.destinationAccountId,
    amount: payload.amountReceived,
    exchangeRate: null,
    description: payload.description,
    side: EJournalSide.Debit,
    sequenceOrder: 2,
  };

  const journalEntry = {
    sourceLine,
    destinationLines: [destinationLine],
    status: payload.pending
      ? EJournalEntryStatus.Draft
      : EJournalEntryStatus.Posted,
    effectiveDate: payload.date,
    postedAt: payload.date ? new Date().toISOString() : null,
    memo: payload.description,
  };

  const { data } = await drimsheetApi.request<unknown, IHttpErrorDto>({
    path: '/journal-entry/transfer',
    method: 'POST',
    body: journalEntry,
    type: EContentType.Json,
    format: 'json',
  });
  return data;
}

async function getAccountTransactions(
  accountId: string,
  pagination: IPaginationDto
) {
  const { data } = await drimsheetApi.ledger.listTransactions(
    accountId,
    pagination
  );
  return data;
}

export const bookkeepingService = Object.freeze({
  recordTransaction,
  getAccountTransactions,
});
