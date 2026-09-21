import { TransactionDetails } from '@/journal-entries/components/transaction-details';
import type { ICashTransactionDetails } from '@/journal-entries/lib/types/transaction-details';
import { EJournalEntrySourceType } from '@/shared/lib/api/Api';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

const details: ICashTransactionDetails = {
  amount: { amount: 85_000, currencyCode: 'NGN', isMinorUnit: false },
  attachments: [
    {
      name: 'customer-receipt.pdf',
      size: 2048,
      type: 'application/pdf',
      url: 'https://example.com/customer-receipt.pdf',
    },
  ],
  cashAccountName: 'Main checking',
  categories: [
    {
      accountId: 'services',
      accountName: 'Professional services',
      amount: { amount: 85_000, currencyCode: 'NGN', isMinorUnit: false },
      description: null,
      id: 'line-1',
    },
  ],
  counterparties: [{ id: 'client-1', name: 'Northwind Ltd' }],
  direction: EJournalEntrySourceType.Receipt,
  effectiveDate: '2026-09-16T00:00:00Z',
  exchangeRate: null,
  functionalAmount: {
    amount: 85_000,
    currencyCode: 'NGN',
    isMinorUnit: false,
  },
  kind: 'cash',
  memo: 'September consulting invoice',
};

function TransactionDetailsHarness({
  onOpenChange,
}: Readonly<{ onOpenChange: (open: boolean) => void }>) {
  const [open, setOpen] = useState(true);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    setOpen(nextOpen);
  }

  return (
    <TransactionDetails
      details={details}
      onOpenChange={handleOpenChange}
      open={open}
    />
  );
}

describe('TransactionDetails', () => {
  it('renders an accessible title and common recorded details', () => {
    render(
      <TransactionDetails
        details={details}
        onOpenChange={vi.fn()}
        open={true}
      />
    );

    const drawer = screen.getByRole('dialog', { name: 'Transaction details' });
    expect(within(drawer).getByText('Inflow')).toBeInTheDocument();
    expect(within(drawer).getAllByText(/85,000/).length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('NGN').length).toBeGreaterThan(0);
    expect(
      within(drawer).getByText('September consulting invoice')
    ).toBeInTheDocument();
    expect(
      within(drawer).getByRole('link', {
        name: 'Open attachment customer-receipt.pdf',
      })
    ).toHaveAttribute('href', 'https://example.com/customer-receipt.pdf');
    expect(within(drawer).getByText('PDF · 2 KB')).toBeInTheDocument();
  });

  it('closes through its translated close action', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TransactionDetailsHarness onOpenChange={onOpenChange} />);

    await user.click(
      screen.getByRole('button', { name: 'Close transaction details' })
    );

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TransactionDetailsHarness onOpenChange={onOpenChange} />);

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not expose a blank dialog without supported details', () => {
    render(<TransactionDetails onOpenChange={vi.fn()} open={true} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
