import { NavUser } from '@/user/components/nav-user';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'User/NavUser',
  component: NavUser,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="w-64 border p-2">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof NavUser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
