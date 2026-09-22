import { TransactionDeleteAction } from '@/journal-entries/components/transaction-details-drawer/parts/transaction-delete-action';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

const meta = {
  title: 'Journal Entries/TransactionDetailsDrawer/TransactionDeleteAction',
  component: TransactionDeleteAction,
  tags: ['autodocs'],
  args: {
    onArchive: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof TransactionDeleteAction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
