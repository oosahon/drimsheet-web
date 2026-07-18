import { BalanceEffectIcon } from '@/bookkeeping/ui/components/balance-effect-icon';
import { ELedgerAccountBalanceEffect } from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Bookkeeping/BalanceEffectIcon',
  component: BalanceEffectIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8 bg-background border border-border rounded-xl">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    effect: {
      control: 'select',
      options: Object.values(ELedgerAccountBalanceEffect),
    },
  },
} satisfies Meta<typeof BalanceEffectIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Increase: Story = {
  args: {
    effect: ELedgerAccountBalanceEffect.Increase,
  },
};

export const Decrease: Story = {
  args: {
    effect: ELedgerAccountBalanceEffect.Decrease,
  },
};

export const Noop: Story = {
  args: {
    effect: ELedgerAccountBalanceEffect.Noop,
  },
};
