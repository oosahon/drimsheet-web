import { CurrencyExchangeRateInput } from '@/shared/components/currency-exchange-rate-input';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/CurrencyExchangeRateInput',
  component: CurrencyExchangeRateInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    baseCurrency: 'USD',
    targetCurrency: 'NGN',
  },
} satisfies Meta<typeof CurrencyExchangeRateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 1500,
  },
};

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: '0',
  },
};

export const Compact: Story = {
  args: {
    defaultValue: 1500,
    layout: 'compact',
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};
