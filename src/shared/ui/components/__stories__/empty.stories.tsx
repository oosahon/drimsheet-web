import { Button } from '@/shared/ui/components/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/components/empty';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileQuestion, SearchX } from 'lucide-react';

const meta = {
  title: 'Shared UI/Empty',
  component: Empty,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Empty className="w-[400px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileQuestion />
        </EmptyMedia>
        <EmptyTitle>No items found</EmptyTitle>
        <EmptyDescription>Get started by creating a new item.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create Item</Button>
      </EmptyContent>
    </Empty>
  ),
};

export const WithoutAction: Story = {
  render: () => (
    <Empty className="w-[400px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchX />
        </EmptyMedia>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          We couldn't find any results matching your search query. Please try
          again with different keywords.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

export const Simple: Story = {
  render: () => (
    <Empty className="w-[300px]">
      <EmptyHeader>
        <EmptyTitle>Nothing to see here</EmptyTitle>
      </EmptyHeader>
    </Empty>
  ),
};
