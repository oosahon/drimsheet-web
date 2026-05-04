import { NavConfigurations } from '@/shared/ui/components/nav-configurations';
import { SidebarProvider } from '@/shared/ui/components/sidebar';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Settings } from 'lucide-react';

const meta = {
  title: 'Shared UI/NavConfigurations',
  component: NavConfigurations,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className="w-64 border p-2">
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof NavConfigurations>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    projects: [
      { name: 'Settings', url: '#', icon: <Settings className="size-4" /> },
    ],
  },
};
