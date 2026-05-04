import { PettyCashAccountForm } from '@/ledger-accounts/ui/components/petty-cash-account-form';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'LedgerAccounts/PettyCashAccountForm',
  component: PettyCashAccountForm,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="p-4 max-w-sm mx-auto">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onSubmit: () => {} },
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
} satisfies Meta<typeof PettyCashAccountForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
