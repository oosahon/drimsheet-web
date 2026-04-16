import { AccountingEntitySelect } from '@/onboarding/ui/accounting-entity-select';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Onboarding/AccountingEntitySelect',
  component: AccountingEntitySelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onChange: () => {} },
} satisfies Meta<typeof AccountingEntitySelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
  },
};

export const Selected: Story = {
  args: {
    value: 'individual',
  },
};

export const WithError: Story = {
  args: {
    value: '',
    error: [{ message: 'This field is required.' }],
  },
};
