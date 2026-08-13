import { AccountingEntityAvatar } from '@/user/components/accounting-entity-avatar';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'User/AccountingEntityAvatar',
  component: AccountingEntityAvatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { name: 'Purple Ledger' },
} satisfies Meta<typeof AccountingEntityAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    size: 'lg',
    fallbackClassName:
      'bg-primary text-base font-semibold text-primary-foreground',
  },
};

export const SingleWord: Story = {
  args: { name: 'Purple' },
};

export const EmptyName: Story = {
  args: { name: '' },
};

export const LongName: Story = {
  args: { name: 'Purple Ledger International Limited' },
};
