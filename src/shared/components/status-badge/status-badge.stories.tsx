import { StatusBadge } from '@/shared/components/status-badge';
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
    label: 'Success',
    variant: 'success',
    showDot: true,
  },
};

export const Info: Story = {
  args: {
    label: 'Info',
    variant: 'info',
    showDot: true,
  },
};

export const Warning: Story = {
  args: {
    label: 'Warning',
    variant: 'warning',
    showDot: true,
  },
};

export const Error: Story = {
  args: {
    label: 'Error',
    variant: 'error',
    showDot: true,
  },
};

export const Neutral: Story = {
  args: {
    label: 'Neutral',
    variant: 'neutral',
    showDot: true,
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary',
    variant: 'primary',
    showDot: true,
  },
};

export const WithoutDot: Story = {
  args: {
    label: 'No Dot Badge',
    variant: 'primary',
    showDot: false,
  },
};
