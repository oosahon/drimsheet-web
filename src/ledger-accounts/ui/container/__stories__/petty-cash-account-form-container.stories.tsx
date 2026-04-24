import PettyCashAccountFormContainer from '@/ledger-accounts/ui/container/petty-cash-account-form-container';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta = {
  title: 'LedgerAccounts/PettyCashAccountFormContainer',
  component: PettyCashAccountFormContainer,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <div className="p-4 max-w-sm mx-auto">
            <Story />
          </div>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PettyCashAccountFormContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
