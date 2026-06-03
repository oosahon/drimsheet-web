import { LedgerAccountsOverview } from '@/ledger-accounts/ui/components/accounts-overview';
import { ELedgerType } from '@/shared/utils/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Ledger Accounts/LedgerAccountsOverview',
  component: LedgerAccountsOverview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[600px] sm:w-[700px] md:w-[800px] p-8 bg-background rounded-3xl border border-border shadow-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LedgerAccountsOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShowcaseList: StoryObj<unknown> = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-foreground font-heading mb-2">
        Ledger Types Overview
      </h3>
      <LedgerAccountsOverview
        type={ELedgerType.Revenue}
        title="Software SaaS Subscriptions"
        balance={{ amount: 75000000, currencyCode: 'USD', isMinorUnit: true }}
        description="Monthly recurring software-as-a-service subscriber inflows"
      />
      <LedgerAccountsOverview
        type={ELedgerType.Asset}
        title="Silicon Valley Bank Operations"
        balance={{ amount: 1545000000, currencyCode: 'USD', isMinorUnit: true }}
        description="Core operational business cash reserves"
      />
      <LedgerAccountsOverview
        type={ELedgerType.Equity}
        title="Common Stock & Paid-in Capital"
        balance={{ amount: 5000000000, currencyCode: 'USD', isMinorUnit: true }}
        description="Founders and seed investors equity shares"
      />
      <LedgerAccountsOverview
        type={ELedgerType.Liability}
        title="Term Loan (Series B Funding)"
        balance={{ amount: 120000000, currencyCode: 'USD', isMinorUnit: true }}
        description="Outstanding long-term bank obligations"
      />
      <LedgerAccountsOverview
        type={ELedgerType.Expense}
        title="AWS Hosting & Infrastructure"
        balance={{ amount: 4850000, currencyCode: 'USD', isMinorUnit: true }}
        description="Cloud database and compute monthly expenditures"
      />
    </div>
  ),
};

export const Revenue: Story = {
  args: {
    type: ELedgerType.Revenue,
    title: 'Consulting & Advisory Services',
    balance: { amount: 1250000, currencyCode: 'EUR', isMinorUnit: true },
    description: 'Incoming client advisory fees',
  },
};

export const Asset: Story = {
  args: {
    type: ELedgerType.Asset,
    title: 'Main Operating Cash Account',
    balance: { amount: 8945000, currencyCode: 'USD', isMinorUnit: true },
    description: 'Liquid cash in commercial checking account',
  },
};

export const Equity: Story = {
  args: {
    type: ELedgerType.Equity,
    title: 'Retained Earnings',
    balance: { amount: 35000000, currencyCode: 'USD', isMinorUnit: true },
    description: 'Cumulative net earnings retained by the business',
  },
};

export const Liability: Story = {
  args: {
    type: ELedgerType.Liability,
    title: 'Accounts Payable',
    balance: { amount: 432000, currencyCode: 'GBP', isMinorUnit: true },
    description: 'Outstanding vendor invoices and short-term payables',
  },
};

export const Expense: Story = {
  args: {
    type: ELedgerType.Expense,
    title: 'Global Office Rent & Leases',
    balance: { amount: 950000, currencyCode: 'USD', isMinorUnit: true },
    description: 'Monthly office lease and utilities expenses',
  },
};
