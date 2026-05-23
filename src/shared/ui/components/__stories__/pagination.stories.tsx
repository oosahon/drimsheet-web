import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/components/pagination';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/Pagination',
  component: Pagination,
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
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={(e) => e.preventDefault()} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" onClick={(e) => e.preventDefault()} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};
