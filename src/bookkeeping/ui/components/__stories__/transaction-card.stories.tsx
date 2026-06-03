import { TransactionCard } from '@/bookkeeping/ui/components/transaction-card';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Bookkeeping/TransactionCard',
  component: TransactionCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[920px] max-w-[calc(100vw-2rem)] p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    constinerProps: {},
    direction: 'increase',
    variant: 'default',
  },
  argTypes: {
    constinerProps: { control: false },
    direction: {
      control: 'select',
      options: ['increase', 'decrease', 'noop'],
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'muted'],
    },
  },
} satisfies Meta<typeof TransactionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Increase: Story = {
  args: {
    direction: 'increase',
  },
};

export const Decrease: Story = {
  args: {
    direction: 'decrease',
  },
};

export const Noop: Story = {
  args: {
    direction: 'noop',
  },
};
