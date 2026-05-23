import { SearchField } from '@/shared/ui/components/search-field';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search...',
    className: 'w-[300px]',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Search...',
    defaultValue: 'Petty Cash',
    className: 'w-[300px]',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Search...',
    disabled: true,
    className: 'w-[300px]',
  },
};

export const LargePlaceholder: Story = {
  args: {
    placeholder: 'Search transactions, accounts, or ledger items...',
    className: 'w-[400px]',
  },
};
