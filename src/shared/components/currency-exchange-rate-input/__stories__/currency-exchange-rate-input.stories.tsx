import { CurrencyExchangeRateInput } from '@/shared/components/currency-exchange-rate-input';
import type { IExchangeRate } from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Shared UI/CurrencyExchangeRateInput',
  component: CurrencyExchangeRateInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    baseCurrency: 'USD',
    onChange: () => undefined,
    targetCurrency: 'NGN',
    value: null,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <CurrencyExchangeRateInput
        {...args}
        onChange={(nextValue) => {
          setValue(nextValue);
          args.onChange(nextValue);
        }}
        value={value}
      />
    );
  },
} satisfies Meta<typeof CurrencyExchangeRateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: {
    value: { value: 1500, inverted: false },
  },
};

export const Inverted: Story = {
  args: {
    value: { value: 0.001, inverted: true },
  },
};

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    value: { value: 0, inverted: false },
  },
};

export const Compact: Story = {
  args: {
    layout: 'compact',
    value: { value: 1500, inverted: false },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export const WithoutOfficialRate: Story = {
  args: {
    displayOfficialRate: true,
    layout: 'compact',
  },
  decorators: [
    (Story) => (
      <div className="w-xl max-w-full">
        <Story />
      </div>
    ),
  ],
};

export const WithOfficialRate: Story = {
  args: {
    displayOfficialRate: true,
    layout: 'compact',
    officialRate: {
      baseCurrencyCode: 'USD',
      targetCurrencyCode: 'NGN',
      rate: 1500,
      asOf: '2026-06-01T00:00:00.000Z',
    } as IExchangeRate,
  },
  decorators: [
    (Story) => (
      <div className="w-xl max-w-full">
        <Story />
      </div>
    ),
  ],
};
