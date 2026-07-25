import { RequestPasswordResetForm } from '@/auth/components/request-password-reset-form';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Auth/RequestPasswordResetForm',
  component: RequestPasswordResetForm,
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
  args: { onSubmit: () => {}, loading: false },
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
} satisfies Meta<typeof RequestPasswordResetForm>;

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
