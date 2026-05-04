import { RequestPasswordResetSuccess } from '@/auth/ui/components/reset-password-request-success';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Auth/RequestPasswordResetSuccess',
  component: RequestPasswordResetSuccess,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="p-4 max-w-sm mx-auto">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { retry: () => {} },
  argTypes: {
    retry: { action: 'retry clicked' },
  },
} satisfies Meta<typeof RequestPasswordResetSuccess>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
