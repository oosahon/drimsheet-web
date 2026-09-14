import { PageBreadcrumbs } from '@/shared/components/page-breadcrumbs';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Shared UI/PageBreadcrumbs',
  component: PageBreadcrumbs,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="bg-background p-4">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PageBreadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PettyCashAccount: Story = {
  args: {
    breadcrumb: {
      label: 'Petty Cash',
      link: '/accounts/petty-cash',
      next: {
        label: 'Office Float',
        link: '#',
      },
    },
  },
};

export const CurrentPage: Story = {
  args: {
    breadcrumb: {
      label: 'Accounts',
      link: '/accounts',
      next: {
        label: 'Petty Cash',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    breadcrumb: {
      label: 'Petty Cash',
      link: '/accounts/petty-cash',
      next: {
        label: 'Office Float',
        link: '#',
      },
    },
  },
};
