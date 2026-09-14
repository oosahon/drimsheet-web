import {
  FreeSoloCombobox,
  type UFreeSoloComboboxValue,
} from '@/shared/components/free-solo-combobox';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

interface IPayerOption {
  id: string;
  name: string;
}

const payerOptions: IPayerOption[] = [
  { id: 'payer-1', name: 'Acme Consulting' },
  { id: 'payer-2', name: 'Northwind Traders' },
  { id: 'payer-3', name: 'Drimsheet Ltd' },
];

const meta = {
  title: 'Shared UI/FreeSoloCombobox',
  component: FreeSoloCombobox<IPayerOption>,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    getOptionLabel: (option) => option.name,
    id: 'payer',
    label: 'Payer',
    onValueChange: () => undefined,
    options: payerOptions,
    placeholder: 'Select or enter a payer',
    value: null,
  },
} satisfies Meta<typeof FreeSoloCombobox<IPayerOption>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<UFreeSoloComboboxValue<IPayerOption>>(
      args.value
    );

    return (
      <div className="w-96">
        <FreeSoloCombobox {...args} value={value} onValueChange={setValue} />
      </div>
    );
  },
};

export const Invalid: Story = {
  args: {
    error: [{ message: 'Payer is required' }],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: payerOptions[0],
  },
};

export const EmptyOptions: Story = {
  args: {
    emptyMessage: 'No payers found. Your entry will be used as a new payer.',
    options: [],
  },
};
