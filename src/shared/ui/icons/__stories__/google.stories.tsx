import { GoogleIcon } from '@/shared/ui/icons/google';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared Icons/Google',
  component: GoogleIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GoogleIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
