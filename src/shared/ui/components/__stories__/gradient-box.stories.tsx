import { GradientBox } from '@/shared/ui/components/gradient-box';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/GradientBox',
  component: GradientBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof GradientBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Gradient Box',
    variant: 'primary',
  },
};

export const Success: Story = {
  args: {
    children: 'Success Gradient Box',
    variant: 'success',
  },
};

export const Info: Story = {
  args: {
    children: 'Info Gradient Box',
    variant: 'info',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning Gradient Box',
    variant: 'warning',
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger Gradient Box',
    variant: 'danger',
  },
};

export const Grey: Story = {
  args: {
    children: 'Grey Gradient Box',
    variant: 'grey',
  },
};
