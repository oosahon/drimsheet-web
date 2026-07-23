import { NavMain } from '@/_app/components/nav-main';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home, Settings } from 'lucide-react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Shared UI/NavMain',
  component: NavMain,
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
} satisfies Meta<typeof NavMain>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        title: 'Home',
        url: '/',
        icon: React.createElement(Home),
        isActive: true,
      },
      {
        title: 'Settings',
        url: '/settings',
        icon: React.createElement(Settings),
      },
    ],
  },
};
