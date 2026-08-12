import { TransferForm } from '@/journal-entries/components/transfer-form';
import type { Meta, StoryObj } from '@storybook/react-vite';
const meta = {
  title: 'Journal Entries/TransferForm',
  component: TransferForm,
  tags: ['autodocs'],
} satisfies Meta<typeof TransferForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {
  args: {
    accounts: [],
    values: {
      sourceAccountId: '',
      destinationAccountId: '',
      amountSent: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
      amountReceived: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
      description: '',
      createAnother: false,
    },
    onChange: () => undefined,
    onCreate: () => undefined,
  },
};
