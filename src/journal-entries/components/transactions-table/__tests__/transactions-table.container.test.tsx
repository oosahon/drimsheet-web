import { TransactionsTableContainer } from '@/journal-entries/components/transactions-table';
import { useJournalEntries } from '@/journal-entries/hooks/use-journal-entries';
import {
  EJournalEntrySourceType,
  EJournalEntryStatus,
  EJournalSide,
  type IJournalEntryListDto,
} from '@/shared/lib/api/Api';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/journal-entries/hooks/use-journal-entries');

const money = { amount: 125_000, currencyCode: 'NGN', isMinorUnit: false };
const paymentEntry = {
  id: 'payment-entry',
  accountingEntityId: 'entity-1',
  sourceType: EJournalEntrySourceType.Payment,
  memo: null,
  status: EJournalEntryStatus.Posted,
  effectiveDate: '2026-09-16T00:00:00Z',
  postedAt: '2026-09-16T10:00:00Z',
  voidedAt: null,
  voidingEntryId: null,
  version: 1,
  createdBy: 'user-1',
  createdAt: '2026-09-16T10:00:00Z',
  updatedAt: '2026-09-16T10:00:00Z',
  attachments: [],
  lines: [
    {
      id: 'cash-line',
      entryId: 'payment-entry',
      account: { id: 'cash-main', name: 'Main checking' },
      counterparty: { id: 'counterparty-1', name: 'Osahon Oboite' },
      sequenceOrder: 1,
      amount: money,
      exchangeRate: null,
      functionalAmount: money,
      side: EJournalSide.Credit,
      description: null,
      version: 1,
      createdAt: '2026-09-16T10:00:00Z',
      updatedAt: '2026-09-16T10:00:00Z',
    },
    {
      id: 'category-line',
      entryId: 'payment-entry',
      account: { id: 'gift', name: 'Gift' },
      counterparty: { id: 'counterparty-1', name: 'Osahon Oboite' },
      sequenceOrder: 2,
      amount: money,
      exchangeRate: null,
      functionalAmount: money,
      side: EJournalSide.Debit,
      description: null,
      version: 1,
      createdAt: '2026-09-16T10:00:00Z',
      updatedAt: '2026-09-16T10:00:00Z',
    },
  ],
} satisfies IJournalEntryListDto;

function LocationSearch() {
  return <div aria-label="Location search">{useLocation().search}</div>;
}

function renderContainer(initialEntry = '/transactions') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <TransactionsTableContainer />
      <LocationSearch />
    </MemoryRouter>
  );
}

describe('TransactionsTableContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useJournalEntries).mockReturnValue({
      data: {
        data: [paymentEntry],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      },
      isPending: false,
    } as never);
  });

  it('requests newest-first entries and renders resolved row labels without a dead action', () => {
    renderContainer();

    expect(useJournalEntries).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      orderBy: 'effectiveDate',
      sortDirection: 'desc',
    });
    expect(screen.getByText('Main checking')).toBeInTheDocument();
    expect(screen.getByText('Payment to Osahon Oboite')).toBeInTheDocument();
    expect(screen.getByText('Gift')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Open transaction' })
    ).not.toBeInTheDocument();
  });

  it('keeps search and reversible date sorting in URL-backed query state', async () => {
    const user = userEvent.setup();
    renderContainer();

    await user.type(
      screen.getByPlaceholderText('Search transactions...'),
      'gift'
    );
    await user.click(screen.getByRole('columnheader', { name: 'Date' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Location search')).toHaveTextContent(
        'q=gift'
      );
      expect(screen.getByLabelText('Location search')).toHaveTextContent(
        'order=asc'
      );
      expect(useJournalEntries).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: 'gift', sortDirection: 'asc' })
      );
    });
  });

  it('keeps the skeleton visible until journal entries are ready', () => {
    vi.mocked(useJournalEntries).mockReturnValue({
      data: undefined,
      isPending: true,
    } as never);

    renderContainer();

    expect(screen.getByRole('status')).toHaveTextContent(
      'Loading transactions'
    );
  });
});
