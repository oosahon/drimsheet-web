import { AppHeaderTitle } from '@/shared/components/app';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/AppHeaderTitle',
  component: AppHeaderTitle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AppHeaderTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Dashboard Title',
  },
};
