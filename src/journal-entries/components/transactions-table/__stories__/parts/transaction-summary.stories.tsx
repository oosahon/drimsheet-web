import { TransactionSummary } from '@/journal-entries/components/transactions-table/parts/transaction-summary';
import { EJournalEntrySourceType } from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Journal Entries/TransactionsTable/TransactionSummary',
  component: TransactionSummary,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-sm rounded-lg border bg-background p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    row: {
      direction: EJournalEntrySourceType.Payment,
      firstCounterpartyName: 'Osahon Oboite',
      additionalCounterpartyCount: 0,
      firstCategoryName: 'Gift',
      additionalCategoryCount: 0,
    },
  },
} satisfies Meta<typeof TransactionSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Payment: Story = {};

export const MultiplePartiesAndCategories: Story = {
  args: {
    row: {
      direction: EJournalEntrySourceType.Payment,
      firstCounterpartyName: 'Osahon Oboite',
      additionalCounterpartyCount: 1,
      firstCategoryName: 'Gift',
      additionalCategoryCount: 2,
    },
  },
};

export const Receipt: Story = {
  args: {
    row: {
      direction: EJournalEntrySourceType.Receipt,
      firstCounterpartyName: 'Ada Okafor',
      additionalCounterpartyCount: 0,
      firstCategoryName: 'Professional services',
      additionalCategoryCount: 0,
    },
  },
};

export const Transfer: Story = {
  args: {
    row: {
      direction: EJournalEntrySourceType.Transfer,
      sourceAccountName: 'USD account',
      destinationAccountName: 'Main checking',
      additionalCounterpartyCount: 0,
      additionalCategoryCount: 0,
    },
  },
};
