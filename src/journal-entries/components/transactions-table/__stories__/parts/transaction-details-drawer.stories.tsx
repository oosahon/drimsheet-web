import { TransactionDetailsDrawer } from '@/journal-entries/components/transactions-table/parts/transaction-details-drawer';
import type { ICashTransactionDetails } from '@/journal-entries/lib/types/transaction-details';
import { EJournalEntrySourceType } from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentProps } from 'react';

const details: ICashTransactionDetails = {
  amount: { amount: 850_000, currencyCode: 'NGN', isMinorUnit: false },
  attachments: [
    {
      name: 'northwind-september-receipt.pdf',
      size: 348_160,
      type: 'application/pdf',
      url: 'https://example.com/northwind-september-receipt.pdf',
    },
  ],
  cashAccountName: 'Main checking',
  categories: [
    {
      accountId: 'services',
      accountName: 'Professional services',
      amount: { amount: 850_000, currencyCode: 'NGN', isMinorUnit: false },
      description: 'Website implementation milestone',
      id: 'line-1',
    },
  ],
  counterparties: [{ id: 'client-1', name: 'Northwind Ltd' }],
  direction: EJournalEntrySourceType.Receipt,
  effectiveDate: '2026-09-16T00:00:00Z',
  exchangeRate: null,
  functionalAmount: {
    amount: 850_000,
    currencyCode: 'NGN',
    isMinorUnit: false,
  },
  kind: 'cash',
  memo: 'September consulting invoice paid in full.',
};

function OpenDrawer(args: ComponentProps<typeof TransactionDetailsDrawer>) {
  const [open, setOpen] = useState(true);

  return (
    <TransactionDetailsDrawer {...args} onOpenChange={setOpen} open={open} />
  );
}

const meta = {
  title: 'Journal Entries/TransactionsTable/TransactionDetailsDrawer',
  component: TransactionDetailsDrawer,
  tags: ['autodocs'],
  args: {
    details,
    onArchive: async () => {},
    onEdit: () => undefined,
    onOpenChange: () => undefined,
    open: true,
  },
  render: (args) => <OpenDrawer {...args} />,
} satisfies Meta<typeof TransactionDetailsDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InflowWithMemoAndAttachment: Story = {};
