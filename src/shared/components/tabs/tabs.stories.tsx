import { Tabs } from '@/shared/components/tabs';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ariaLabel: 'Transaction type',
    value: 'inflow',
    items: [
      { value: 'inflow', label: 'Inflow' },
      { value: 'outflow', label: 'Outflow' },
      { value: 'transfer', label: 'Transfer' },
    ],
    onValueChange: () => undefined,
  },
};
