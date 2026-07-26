import { AccountingEntityCreationFormSkeleton } from '@/accounting/components/accounting-entity-creation-form';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Accounting/AccountingEntityCreationForm/Skeleton',
  component: AccountingEntityCreationFormSkeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccountingEntityCreationFormSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
