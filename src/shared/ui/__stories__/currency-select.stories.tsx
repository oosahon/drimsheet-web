import { CurrencySelect } from '@/shared/ui/currency-select';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/CurrencySelect',
  component: CurrencySelect,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onChange: () => {} },
} satisfies Meta<typeof CurrencySelect>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { label: 'Currency', value: '' } };
