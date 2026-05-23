import { AppSidebar } from '@/shared/ui/components/app';
import { SidebarProvider } from '@/shared/ui/components/sidebar';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Shared UI/AppSidebar',
  component: AppSidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <SidebarProvider>
          <div className="flex h-screen w-full bg-background">
            <Story />
            <main className="flex-1 p-4">Main Content Area</main>
          </div>
        </SidebarProvider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof AppSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
