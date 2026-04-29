import { FiscalYearStartSelect } from '@/accounting/ui/fiscal-year-start-select';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Accounting/FiscalYearStartSelect',
  component: FiscalYearStartSelect,
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
} satisfies Meta<typeof FiscalYearStartSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: undefined as unknown as { month: number; day: number },
  },
};

export const Selected: Story = {
  args: {
    value: { month: 1, day: 1 },
  },
};

export const WithError: Story = {
  args: {
    value: undefined as unknown as { month: number; day: number },
    error: 'Start date is required',
  },
};
