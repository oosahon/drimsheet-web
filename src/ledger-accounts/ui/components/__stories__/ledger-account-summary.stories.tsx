import { LedgerAccountSummary } from '@/ledger-accounts/ui/components/ledger-account-summary';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Ledger Accounts/LedgerAccountSummary',
  component: LedgerAccountSummary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8 bg-background rounded-3xl border border-border flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LedgerAccountSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
