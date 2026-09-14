import { FiscalDateSelect } from '@/accounting/components/fiscal-date-select';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Accounting/FiscalDateSelect',
  component: FiscalDateSelect,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  args: { onChange: () => {} },
} satisfies Meta<typeof FiscalDateSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'When does your financial year start?',
    value: undefined as unknown as Date,
  },
};

export const Selected: Story = {
  args: {
    label: 'When does your financial year start?',
    value: new Date(2024, 0, 1),
  },
};

export const WithError: Story = {
  args: {
    label: 'When does your financial year start?',
    value: undefined as unknown as Date,
    error: 'Start date is required',
  },
};
