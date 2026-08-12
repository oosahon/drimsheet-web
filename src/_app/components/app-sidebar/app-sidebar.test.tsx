import { AppSidebar } from '@/_app/components/app-sidebar';
import { SidebarProvider } from '@/shared/components/sidebar';
import { TooltipProvider } from '@/shared/components/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('AppSidebar', () => {
  it('highlights Accounts instead of Dashboard on an account route', () => {
    render(
      <MemoryRouter initialEntries={['/accounts']}>
        <QueryClientProvider client={queryClient}>
          <SidebarProvider>
            <TooltipProvider>
              <AppSidebar currentPath="/accounts" />
            </TooltipProvider>
          </SidebarProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Purple Ledger')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'data-active',
      'false'
    );
    expect(screen.getByRole('link', { name: 'Accounts' })).toHaveAttribute(
      'data-active',
      'true'
    );
    expect(screen.queryByText('Bank accounts')).not.toBeInTheDocument();
    expect(screen.queryByText('Petty cash accounts')).not.toBeInTheDocument();
  });

  it('highlights Transactions and removes Income and Expenses', () => {
    render(
      <MemoryRouter initialEntries={['/transactions/transfer']}>
        <QueryClientProvider client={queryClient}>
          <SidebarProvider>
            <TooltipProvider>
              <AppSidebar currentPath="/transactions/transfer" />
            </TooltipProvider>
          </SidebarProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Transactions' })).toHaveAttribute(
      'data-active',
      'true'
    );
    expect(
      screen.queryByRole('link', { name: 'Income' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Expenses' })
    ).not.toBeInTheDocument();
  });
});
