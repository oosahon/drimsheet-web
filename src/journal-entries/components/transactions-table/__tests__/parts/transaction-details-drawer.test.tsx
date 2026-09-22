import { TransactionDetailsDrawer } from '@/journal-entries/components/transactions-table/parts/transaction-details-drawer';
import type { ICashTransactionDetails } from '@/journal-entries/lib/types/transaction-details';
import { EJournalEntrySourceType } from '@/shared/lib/api/Api';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

const details: ICashTransactionDetails = {
  amount: { amount: 85_000, currencyCode: 'NGN', isMinorUnit: false },
  attachments: [],
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

function TransactionDetailsDrawerHarness({
  onEdit,
  onOpenChange,
}: Readonly<{
  onEdit: () => void;
  onOpenChange: (open: boolean) => void;
}>) {
  const [open, setOpen] = useState(true);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    setOpen(nextOpen);
  }

  return (
    <TransactionDetailsDrawer
      details={details}
      onEdit={onEdit}
      onOpenChange={handleOpenChange}
      open={open}
    />
  );
}

describe('TransactionDetailsDrawer', () => {
  it('renders the standalone details inside an accessible dialog', () => {
    render(
      <TransactionDetailsDrawer
        details={details}
        onEdit={vi.fn()}
        onOpenChange={vi.fn()}
        open
      />
    );

    const drawer = screen.getByRole('dialog', { name: 'Transaction details' });
    expect(within(drawer).getByText('Inflow')).toBeInTheDocument();
    expect(within(drawer).getByText('Main checking')).toBeInTheDocument();
  });

  it('renders inert Delete before Edit and emits only the edit intent', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <TransactionDetailsDrawer
        details={details}
        onEdit={onEdit}
        onOpenChange={vi.fn()}
        open
      />
    );

    const drawer = screen.getByRole('dialog', { name: 'Transaction details' });
    const deleteButton = within(drawer).getByRole('button', { name: 'Delete' });
    const editButton = within(drawer).getByRole('button', { name: 'Edit' });

    expect(
      deleteButton.compareDocumentPosition(editButton) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();

    await user.click(deleteButton);
    expect(onEdit).not.toHaveBeenCalled();
    expect(drawer).toBeInTheDocument();

    await user.click(editButton);
    expect(onEdit).toHaveBeenCalledOnce();
  });

  it('closes through its translated close action', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <TransactionDetailsDrawerHarness
        onEdit={vi.fn()}
        onOpenChange={onOpenChange}
      />
    );

    await user.click(
      screen.getByRole('button', { name: 'Close transaction details' })
    );

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <TransactionDetailsDrawerHarness
        onEdit={vi.fn()}
        onOpenChange={onOpenChange}
      />
    );

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not expose a blank dialog without details', () => {
    render(
      <TransactionDetailsDrawer onEdit={vi.fn()} onOpenChange={vi.fn()} open />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
