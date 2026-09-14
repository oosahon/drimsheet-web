import { TablePagination } from '@/shared/components/table-pagination';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/TablePagination',
  component: TablePagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[500px] p-8 bg-background border border-border rounded-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TablePagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    meta: {
      page: 2,
      limit: 10,
      total: 50,
      totalPages: 5,
    },
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};
