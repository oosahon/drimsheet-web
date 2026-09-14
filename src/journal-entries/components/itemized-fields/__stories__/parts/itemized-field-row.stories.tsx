import { ItemizedFieldRow } from '@/journal-entries/components/itemized-fields/parts/itemized-field-row';
import type { Meta, StoryObj } from '@storybook/react-vite';

const accounts = [
  {
    id: 'sales',
    code: '4000',
    name: 'Sales revenue',
    type: 'revenue',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
] as never[];

const meta = {
  title: 'Journal Entries/ItemizedFields/Row',
  component: ItemizedFieldRow,
  tags: ['autodocs'],
  args: {
    accounts,
    disabled: false,
    index: 0,
    item: {
      id: 'story-row',
      amount: { amount: 1250, currencyCode: 'NGN', isMinorUnit: false },
      accountId: 'sales',
      description: '',
    },
    onChange: () => undefined,
    onDelete: () => undefined,
  },
} satisfies Meta<typeof ItemizedFieldRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    item: {
      id: 'described-row',
      amount: { amount: 1250, currencyCode: 'NGN', isMinorUnit: false },
      accountId: 'sales',
      description: 'Consulting work for August',
    },
  },
};

export const WithValidationErrors: Story = {
  args: {
    errors: {
      amount: [{ message: 'Item amount is required' }],
      accountId: [{ message: 'Item category is required' }],
    },
    item: {
      id: 'invalid-row',
      amount: {
        amount: Number.NaN,
        currencyCode: 'NGN',
        isMinorUnit: false,
      },
      accountId: '',
      description: '',
    },
  },
};
