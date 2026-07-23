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
  it('renders sidebar brand logo and title correctly', () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <SidebarProvider>
            <TooltipProvider>
              <AppSidebar />
            </TooltipProvider>
          </SidebarProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );

    // Title should be visible
    expect(screen.getByText('Purple Ledger')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();

    // Main navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Accounts')).toBeInTheDocument();
  });
});
