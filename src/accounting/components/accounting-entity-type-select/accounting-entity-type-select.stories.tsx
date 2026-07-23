import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccountingEntityTypeSelect } from './accounting-entity-type-select';

const meta = {
  title: 'Accounting/AccountingEntityTypeSelect',
  component: AccountingEntityTypeSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onChange: () => {} },
} satisfies Meta<typeof AccountingEntityTypeSelect>;

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
