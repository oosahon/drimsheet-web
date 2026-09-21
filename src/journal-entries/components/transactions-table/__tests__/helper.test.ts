import transactionsTableHelpers from '@/journal-entries/components/transactions-table/helper';
import {
  EJournalEntrySourceType,
  EJournalEntryStatus,
  EJournalSide,
  type IJournalEntryListDto,
  type IJournalLineListDto,
  type IMoneyDto,
  type UJournalEntrySourceType,
} from '@/shared/lib/api/Api';
import { describe, expect, it } from 'vitest';

const accountNamesById: Record<string, string> = {
  'cash-main': 'Main checking',
  'cash-tax': 'Tax reserve',
  'cash-usd': 'USD account',
  donations: 'Donations',
  gift: 'Gift',
  services: 'Professional services',
};

const counterpartyNamesById: Record<string, string> = {
  'counterparty-1': 'Osahon Oboite',
  'counterparty-2': 'Ada Okafor',
};

function createMoney(amount: number, currencyCode = 'NGN'): IMoneyDto {
  return { amount, currencyCode, isMinorUnit: false };
}

function createLine({
  id,
  accountId,
  counterpartyId,
  sequenceOrder,
  amount,
}: {
  id: string;
  accountId: string;
  counterpartyId: string | null;
  sequenceOrder: number;
  amount: IMoneyDto;
}): IJournalLineListDto {
  return {
    id,
    entryId: 'entry-1',
    account: { id: accountId, name: accountNamesById[accountId] },
    counterparty: counterpartyId
      ? {
          id: counterpartyId,
          name: counterpartyNamesById[counterpartyId],
        }
      : null,
    sequenceOrder,
    amount,
    exchangeRate: null,
    functionalAmount: amount,
    side: EJournalSide.Debit,
    description: null,
    version: 1,
    createdAt: '2026-09-16T10:00:00Z',
    updatedAt: '2026-09-16T10:00:00Z',
  };
}

function createEntry(
  sourceType: UJournalEntrySourceType,
  lines: IJournalLineListDto[]
): IJournalEntryListDto {
  return {
    id: `entry-${sourceType}`,
    accountingEntityId: 'entity-1',
    sourceType,
    memo: null,
    status: EJournalEntryStatus.Posted,
    effectiveDate: '2026-09-16T00:00:00Z',
    postedAt: '2026-09-16T10:00:00Z',
    voidedAt: null,
    voidingEntryId: null,
    version: 1,
    createdBy: 'user-1',
    createdAt: '2026-09-16T10:00:00Z',
    updatedAt: '2026-09-16T10:00:00Z',
    attachments: [],
    lines,
  };
}

function createRows(entries: IJournalEntryListDto[]) {
  return transactionsTableHelpers.createRows({ entries });
}

describe('transactionsTableHelpers', () => {
  it('uses the payment source line and deduplicates counterparties and categories', () => {
    const sourceAmount = createMoney(125_000);
    const entry = createEntry(EJournalEntrySourceType.Payment, [
      createLine({
        id: 'line-3',
        accountId: 'donations',
        counterpartyId: 'counterparty-2',
        sequenceOrder: 3,
        amount: createMoney(25_000),
      }),
      createLine({
        id: 'line-1',
        accountId: 'cash-main',
        counterpartyId: 'counterparty-1',
        sequenceOrder: 1,
        amount: sourceAmount,
      }),
      createLine({
        id: 'line-4',
        accountId: 'gift',
        counterpartyId: 'counterparty-2',
        sequenceOrder: 4,
        amount: createMoney(50_000),
      }),
      createLine({
        id: 'line-2',
        accountId: 'gift',
        counterpartyId: 'counterparty-1',
        sequenceOrder: 2,
        amount: createMoney(50_000),
      }),
    ]);

    expect(createRows([entry])[0]).toEqual(
      expect.objectContaining({
        accountName: 'Main checking',
        additionalCategoryCount: 1,
        additionalCounterpartyCount: 1,
        amount: sourceAmount,
        direction: EJournalEntrySourceType.Payment,
        firstCategoryName: 'Gift',
        firstCounterpartyName: 'Osahon Oboite',
      })
    );
  });

  it('uses the receipt destination line for the account and amount', () => {
    const destinationAmount = createMoney(85_000);
    const entry = createEntry(EJournalEntrySourceType.Receipt, [
      createLine({
        id: 'line-2',
        accountId: 'cash-main',
        counterpartyId: 'counterparty-1',
        sequenceOrder: 2,
        amount: destinationAmount,
      }),
      createLine({
        id: 'line-1',
        accountId: 'services',
        counterpartyId: 'counterparty-1',
        sequenceOrder: 1,
        amount: createMoney(85_000),
      }),
    ]);

    expect(createRows([entry])[0]).toEqual(
      expect.objectContaining({
        accountName: 'Main checking',
        amount: destinationAmount,
        direction: EJournalEntrySourceType.Receipt,
        firstCategoryName: 'Professional services',
        firstCounterpartyName: 'Osahon Oboite',
      })
    );
  });

  it('uses the transfer source account and source amount', () => {
    const sourceAmount = createMoney(1_000, 'USD');
    const entry = createEntry(EJournalEntrySourceType.Transfer, [
      createLine({
        id: 'line-2',
        accountId: 'cash-main',
        counterpartyId: 'counterparty-1',
        sequenceOrder: 2,
        amount: createMoney(1_590_000),
      }),
      createLine({
        id: 'line-1',
        accountId: 'cash-usd',
        counterpartyId: 'counterparty-1',
        sequenceOrder: 1,
        amount: sourceAmount,
      }),
      createLine({
        id: 'line-3',
        accountId: 'gift',
        counterpartyId: 'counterparty-1',
        sequenceOrder: 3,
        amount: createMoney(10_000),
      }),
    ]);

    expect(createRows([entry])[0]).toEqual(
      expect.objectContaining({
        accountName: 'USD account',
        amount: sourceAmount,
        destinationAccountName: 'Main checking',
        direction: EJournalEntrySourceType.Transfer,
        sourceAccountName: 'USD account',
      })
    );
  });

  it('omits source types outside the supported transaction flows', () => {
    const entry = createEntry(EJournalEntrySourceType.Adjustment, [
      createLine({
        id: 'line-1',
        accountId: 'cash-main',
        counterpartyId: 'counterparty-1',
        sequenceOrder: 1,
        amount: createMoney(10_000),
      }),
    ]);

    expect(createRows([entry])).toEqual([]);
  });
});
