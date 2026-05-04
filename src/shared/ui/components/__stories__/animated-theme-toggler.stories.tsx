import { AnimatedThemeToggler } from '@/shared/ui/components/animated-theme-toggler';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/AnimatedThemeToggler',
  component: AnimatedThemeToggler,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    showText: false,
  },
} satisfies Meta<typeof AnimatedThemeToggler>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithText: Story = {
  args: {
    showText: true,
  },
};
