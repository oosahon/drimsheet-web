import {
  EJournalEntrySourceType,
  type IJournalEntryListDto,
  type IJournalLineListDto,
  type UJournalEntrySourceType,
} from '@/shared/lib/api/Api';
import type {
  ITransactionsTableRow,
  UTransactionsTableDirection,
} from './types';

interface ICreateRowInput {
  entry: IJournalEntryListDto;
}

interface ICreateRowsInput {
  entries: IJournalEntryListDto[];
}

const transactionSourceTypes: Set<string> = new Set([
  EJournalEntrySourceType.Payment,
  EJournalEntrySourceType.Receipt,
  EJournalEntrySourceType.Transfer,
]);

function isTransactionSourceType(
  sourceType: UJournalEntrySourceType
): sourceType is UTransactionsTableDirection {
  return transactionSourceTypes.has(sourceType);
}

function getRowCashLine(
  lines: readonly IJournalLineListDto[],
  sourceType: UTransactionsTableDirection
) {
  if (sourceType === EJournalEntrySourceType.Receipt) return lines.at(-1);

  return lines.at(0);
}

function getRowCategoryLines(
  lines: readonly IJournalLineListDto[],
  sourceType: UTransactionsTableDirection
) {
  if (sourceType === EJournalEntrySourceType.Receipt) return lines.slice(0, -1);
  if (sourceType === EJournalEntrySourceType.Payment) return lines.slice(1);

  return [];
}

function getRowSourceAccountName(
  cashLine: IJournalLineListDto,
  sourceType: UTransactionsTableDirection
) {
  if (sourceType !== EJournalEntrySourceType.Transfer) return undefined;

  return cashLine.account.name;
}

function getRowDestinationAccountName(
  lines: readonly IJournalLineListDto[],
  sourceType: UTransactionsTableDirection
) {
  if (sourceType !== EJournalEntrySourceType.Transfer) return undefined;

  return lines.at(1)?.account.name;
}

function createRow({
  entry,
}: ICreateRowInput): ITransactionsTableRow | undefined {
  if (!isTransactionSourceType(entry.sourceType)) return undefined;

  const lines = [...entry.lines].sort(
    (left, right) => left.sequenceOrder - right.sequenceOrder
  );
  const direction = entry.sourceType;
  const cashLine = getRowCashLine(lines, direction);

  if (!cashLine) return undefined;

  const categoryLines = getRowCategoryLines(lines, direction);
  const sourceAccountName = getRowSourceAccountName(cashLine, direction);
  const destinationAccountName = getRowDestinationAccountName(lines, direction);

  if (direction === EJournalEntrySourceType.Transfer && !destinationAccountName)
    return undefined;

  const counterparties = Array.from(
    new Map(
      lines.flatMap((line) =>
        line.counterparty ? [[line.counterparty.id, line.counterparty]] : []
      )
    ).values()
  );
  const categories = Array.from(
    new Map(
      categoryLines.map((line) => [line.account.id, line.account])
    ).values()
  );

  return {
    id: entry.id,
    action: null,
    accountName: cashLine.account.name,
    additionalCategoryCount: Math.max(categories.length - 1, 0),
    additionalCounterpartyCount: Math.max(counterparties.length - 1, 0),
    amount: cashLine.amount,
    destinationAccountName,
    direction,
    effectiveDate: entry.effectiveDate,
    entry,
    firstCategoryName: categories.at(0)?.name,
    firstCounterpartyName: counterparties.at(0)?.name,
    sourceAccountName,
    summary: null,
  };
}

function createRows({ entries }: ICreateRowsInput) {
  return entries.flatMap((entry) => {
    const row = createRow({ entry });

    return row ? [row] : [];
  });
}

const transactionsTableHelpers = Object.freeze({
  createRows,
});

export default transactionsTableHelpers;
