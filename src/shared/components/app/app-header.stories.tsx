import { AppHeader } from '@/shared/components/app';
import { SidebarProvider } from '@/shared/components/sidebar';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Shared UI/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <SidebarProvider>
          <div className="w-full min-h-[100px] bg-background p-4">
            <Story />
          </div>
        </SidebarProvider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <span className="text-sm text-muted-foreground">
        Custom header content
      </span>
    ),
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    breadcrumbs: [
      { label: 'Accounts', to: '/accounts' },
      { label: 'Petty Cash' },
    ],
  },
};
