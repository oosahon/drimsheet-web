import { TransactionsTable } from '@/bookkeeping/components/transactions-table';
import {
  EJournalEntrySourceType,
  EJournalEntryStatus,
  EJournalSide,
  ELedgerAccountBalanceEffect,
  type IAccountTransactionRes,
} from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const mockTransactions: IAccountTransactionRes[] = [
  {
    id: 'txn-1',
    entryId: 'entry-1',
    accountId: 'account-1',
    counterpartyId: null,
    sequenceOrder: 1,
    amount: { amount: 125000, currencyCode: 'NGN', isMinorUnit: false },
    exchangeRate: null,
    functionalAmount: {
      amount: 125000,
      currencyCode: 'NGN',
      isMinorUnit: false,
    },
    side: EJournalSide.Debit,
    description: 'Float top-up from main bank account',
    version: 1,
    createdAt: '2026-05-21T08:15:00Z',
    updatedAt: '2026-05-21T08:15:00Z',
    balanceEffect: ELedgerAccountBalanceEffect.Increase,
    header: {
      sourceType: EJournalEntrySourceType.Transfer,
      memo: 'Petty cash funding',
      status: EJournalEntryStatus.Posted,
      effectiveDate: '2026-05-21T00:00:00Z',
      postedAt: '2026-05-21T08:15:00Z',
      voidedAt: null,
      voidingEntryId: null,
      version: 1,
      createdBy: 'user-1',
      createdAt: '2026-05-21T08:15:00Z',
      updatedAt: '2026-05-21T08:15:00Z',
    },
  },
  {
    id: 'txn-2',
    entryId: 'entry-2',
    accountId: 'account-1',
    counterpartyId: null,
    sequenceOrder: 1,
    amount: { amount: 18500, currencyCode: 'NGN', isMinorUnit: false },
    exchangeRate: null,
    functionalAmount: {
      amount: 18500,
      currencyCode: 'NGN',
      isMinorUnit: false,
    },
    side: EJournalSide.Credit,
    description: 'Office supplies reimbursement',
    version: 1,
    createdAt: '2026-05-22T12:30:00Z',
    updatedAt: '2026-05-22T12:30:00Z',
    balanceEffect: ELedgerAccountBalanceEffect.Decrease,
    header: {
      sourceType: EJournalEntrySourceType.Payment,
      memo: 'Stationery purchase',
      status: EJournalEntryStatus.Posted,
      effectiveDate: '2026-05-22T00:00:00Z',
      postedAt: '2026-05-22T12:30:00Z',
      voidedAt: null,
      voidingEntryId: null,
      version: 1,
      createdBy: 'user-1',
      createdAt: '2026-05-22T12:30:00Z',
      updatedAt: '2026-05-22T12:30:00Z',
    },
  },
  {
    id: 'txn-3',
    entryId: 'entry-3',
    accountId: 'account-1',
    counterpartyId: null,
    sequenceOrder: 1,
    amount: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
    exchangeRate: null,
    functionalAmount: {
      amount: 0,
      currencyCode: 'NGN',
      isMinorUnit: false,
    },
    side: EJournalSide.Debit,
    description: null,
    version: 1,
    createdAt: '2026-05-23T10:00:00Z',
    updatedAt: '2026-05-23T10:00:00Z',
    balanceEffect: ELedgerAccountBalanceEffect.Noop,
    header: {
      sourceType: EJournalEntrySourceType.Adjustment,
      memo: 'Opening review',
      status: EJournalEntryStatus.Draft,
      effectiveDate: '2026-05-23T00:00:00Z',
      postedAt: null,
      voidedAt: null,
      voidingEntryId: null,
      version: 1,
      createdBy: 'user-1',
      createdAt: '2026-05-23T10:00:00Z',
      updatedAt: '2026-05-23T10:00:00Z',
    },
  },
];

const meta = {
  title: 'Bookkeeping/TransactionsTable',
  component: TransactionsTable,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-5xl p-6 bg-background rounded-2xl border border-border/80 shadow-xs">
        <Story />
      </div>
    ),
  ],
  args: {
    data: mockTransactions,
    searchValue: '',
    onSearchChange: (value) => console.log('Search changed:', value),
    onSortChange: (key, direction) =>
      console.log('Sort changed:', key, direction),
  },
} satisfies Meta<typeof TransactionsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selectable: Story = {
  render: (args) => {
    const [selectedRowIds, setSelectedRowIds] = useState<(string | number)[]>([
      'txn-2',
    ]);

    return (
      <TransactionsTable
        {...args}
        selectable
        selectedRowIds={selectedRowIds}
        onRowSelectionChange={setSelectedRowIds}
      />
    );
  },
};

export const Paginated: Story = {
  args: {
    pagination: {
      page: 1,
      limit: 10,
      total: 24,
      totalPages: 3,
    },
    onPageChange: (page) => console.log('Page changed:', page),
  },
};

export const LoadingState: Story = {
  args: {
    data: [],
    loading: true,
  },
};

export const EmptyState: Story = {
  args: {
    data: [],
    loading: false,
  },
};
