import { AppSidebar } from '@/_app/components/app-sidebar';
import { SidebarProvider } from '@/shared/components/sidebar';
import { TooltipProvider } from '@/shared/components/tooltip';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Shared UI/AppSidebar',
  component: AppSidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <TooltipProvider>
          <SidebarProvider>
            <div className="flex h-screen w-full bg-background">
              <Story />
              <main className="flex-1 p-4">Main Content Area</main>
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof AppSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
