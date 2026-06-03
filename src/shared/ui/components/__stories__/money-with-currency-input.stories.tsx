import uiCurrencies from '@/shared/config/currencies.json' with { type: 'json' };
import { MoneyWithCurrencyInput } from '@/shared/ui/components/money-with-currency-input';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const currencies = uiCurrencies.map((currency) => ({
  code: currency.code,
  symbol: currency.symbol,
  name: currency.name,
  minorUnit: currency.minorUnit,
}));

const meta = {
  title: 'Shared UI/MoneyWithCurrencyInput',
  component: MoneyWithCurrencyInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    currencies,
    placeholder: '0',
    value: { amount: 0, currencyCode: 'USD', isMinorUnit: false },
  },
  render: (args) => {
    const [money, setMoney] = useState(
      args.value ?? { amount: 0, currencyCode: 'USD', isMinorUnit: false }
    );

    return (
      <div className="w-80">
        <MoneyWithCurrencyInput
          {...args}
          value={money}
          onChange={(value, event) => {
            setMoney(value);
            if (event) {
              args.onChange?.(value, event);
            } else {
              args.onChange?.(value);
            }
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof MoneyWithCurrencyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAmount: Story = {
  args: {
    value: { amount: 30000, currencyCode: 'USD', isMinorUnit: false },
  },
};

export const NigerianNaira: Story = {
  args: {
    value: { amount: 30000, currencyCode: 'NGN', isMinorUnit: false },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: { amount: 30000, currencyCode: 'USD', isMinorUnit: false },
  },
};
