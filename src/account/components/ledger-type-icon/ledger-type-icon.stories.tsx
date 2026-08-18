import { LedgerTypeIcon } from '@/account/components/ledger-type-icon';
import { ELedgerType, type ULedgerType } from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Ledger Accounts/LedgerTypeIcon',
  component: LedgerTypeIcon,
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
} satisfies Meta<typeof LedgerTypeIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const LEDGER_TYPE_LABELS: Record<ULedgerType, string> = {
  [ELedgerType.Revenue]: 'Revenue (Success Green)',
  [ELedgerType.Expense]: 'Expense (Destructive Red)',
  [ELedgerType.Asset]: 'Asset (Info Blue)',
  [ELedgerType.Liability]: 'Liability (Warning Yellow)',
  [ELedgerType.Equity]: 'Equity (Primary Blue)',
};

export const ShowcaseGrid: StoryObj<unknown> = {
  render: () => (
    <div className="flex flex-col gap-6 w-[450px]">
      <h3 className="text-lg font-semibold text-foreground font-heading mb-2">
        Ledger Icons Showcase
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {(Object.keys(LEDGER_TYPE_LABELS) as ULedgerType[]).map((type) => (
          <div
            key={type}
            className="flex items-center gap-4 p-3 border border-border rounded-2xl bg-card"
          >
            <LedgerTypeIcon type={type} />
            <span className="text-sm font-semibold text-foreground tracking-wide font-heading">
              {LEDGER_TYPE_LABELS[type]}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Revenue: Story = {
  args: {
    type: ELedgerType.Revenue,
  },
};

export const Expense: Story = {
  args: {
    type: ELedgerType.Expense,
  },
};

export const Asset: Story = {
  args: {
    type: ELedgerType.Asset,
  },
};

export const Liability: Story = {
  args: {
    type: ELedgerType.Liability,
  },
};

export const Equity: Story = {
  args: {
    type: ELedgerType.Equity,
  },
};
