import { TransactionArchiveAction } from '@/journal-entries/components/transaction-details-drawer/parts/transaction-archive-action';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

const meta = {
  title: 'Journal Entries/TransactionDetailsDrawer/TransactionArchiveAction',
  component: TransactionArchiveAction,
  tags: ['autodocs'],
  args: {
    onArchive: fn(),
  },
} satisfies Meta<typeof TransactionArchiveAction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
