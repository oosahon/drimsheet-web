import { ResetPasswordForm } from '@/auth/ui/reset-password-form';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Auth/ResetPasswordForm',
  component: ResetPasswordForm,
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
  args: { onSubmit: () => {} },
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
} satisfies Meta<typeof ResetPasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    email: 'user@example.com',
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    email: 'user@example.com',
    loading: true,
  },
};
