import { ELedgerAccountBehavior } from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccountBehaviorNote } from './account-behavior-note';

const meta = {
  title: 'Ledger Accounts/AccountCreationForm/AccountBehaviorNote',
  component: AccountBehaviorNote,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-96 max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AccountBehaviorNote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PettyCash: Story = {
  args: {
    behavior: ELedgerAccountBehavior.PettyCash,
  },
};

export const Bank: Story = {
  args: {
    behavior: ELedgerAccountBehavior.Bank,
  },
};

export const TradeReceivable: Story = {
  args: {
    behavior: ELedgerAccountBehavior.TradeReceivable,
  },
};

export const PayrollAndPersonnel: Story = {
  args: {
    behavior: ELedgerAccountBehavior.PayrollAndPersonnel,
  },
};

export const OtherLoss: Story = {
  args: {
    behavior: ELedgerAccountBehavior.OtherLoss,
  },
};
