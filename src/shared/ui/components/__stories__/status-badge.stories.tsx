import { StatusBadge } from '@/shared/ui/components/status-badge';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error', 'neutral', 'primary'],
    },
    showDot: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
    showDot: true,
  },
};

export const Info: Story = {
  args: {
    children: 'Info',
    variant: 'info',
    showDot: true,
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning',
    showDot: true,
  },
};

export const Error: Story = {
  args: {
    children: 'Error',
    variant: 'error',
    showDot: true,
  },
};

export const Neutral: Story = {
  args: {
    children: 'Neutral',
    variant: 'neutral',
    showDot: true,
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
    showDot: true,
  },
};

export const WithoutDot: Story = {
  args: {
    children: 'No Dot Badge',
    variant: 'primary',
    showDot: false,
  },
};
