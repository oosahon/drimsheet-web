import { OutflowForm } from '@/journal-entries/components/outflow-form';
import type { Meta, StoryObj } from '@storybook/react-vite';
const meta = {
  title: 'Journal Entries/OutflowForm',
  component: OutflowForm,
  tags: ['autodocs'],
} satisfies Meta<typeof OutflowForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {
  args: {
    accounts: [],
    functionalCurrencyCode: 'NGN',
    values: {
      sourceAccountId: '',
      categoryAccountId: '',
      amount: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
      exchangeRate: '',
      counterpartyName: '',
      description: '',
      createAnother: false,
    },
    onChange: () => undefined,
    onCreate: () => undefined,
  },
};
