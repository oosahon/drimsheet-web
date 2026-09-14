import { JournalLineItemOverview } from '@/journal-entries/components/journal-line-item-overview';
import { ELedgerAccountBalanceEffect } from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Journal Entries/JournalLineItemOverview',
  component: JournalLineItemOverview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[400px] max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
  args: {
    categoryName: 'Category name',
    effectiveDate: new Date('2026-06-01T12:00:00Z'),
    amount: {
      amount: 500000,
      currencyCode: 'NGN',
      isMinorUnit: false,
    },
    functionalAmount: {
      amount: 500000,
      currencyCode: 'NGN',
      isMinorUnit: false,
    },
    balanceEffect: ELedgerAccountBalanceEffect.Increase,
    countryCode: 'NG',
  },
  argTypes: {
    balanceEffect: {
      control: 'select',
      options: Object.values(ELedgerAccountBalanceEffect),
    },
  },
} satisfies Meta<typeof JournalLineItemOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SameCurrency: Story = {};

export const ConvertedCurrency: Story = {
  args: {
    functionalAmount: {
      amount: 900,
      currencyCode: 'USD',
      isMinorUnit: false,
    },
    balanceEffect: ELedgerAccountBalanceEffect.Decrease,
  },
};

export const LongCategoryAtNarrowWidth: Story = {
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
  args: {
    categoryName: 'International professional services and consulting expenses',
    functionalAmount: {
      amount: 900,
      currencyCode: 'USD',
      isMinorUnit: false,
    },
    balanceEffect: ELedgerAccountBalanceEffect.Noop,
  },
};
