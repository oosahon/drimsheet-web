import { TransactionDetails } from '@/journal-entries/components/transaction-details';
import type { ICashTransactionDetails } from '@/journal-entries/lib/types/transaction-details';
import { EJournalEntrySourceType } from '@/shared/lib/api/Api';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

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

describe('TransactionDetails', () => {
  it('renders recorded details without creating a dialog', () => {
    render(<TransactionDetails details={details} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Inflow')).toBeInTheDocument();
    expect(screen.getAllByText(/85,000/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('NGN').length).toBeGreaterThan(0);
    expect(
      screen.getByText('September consulting invoice')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'Open attachment customer-receipt.pdf',
      })
    ).toHaveAttribute('href', 'https://example.com/customer-receipt.pdf');
    expect(screen.getByText('PDF · 2 KB')).toBeInTheDocument();
  });
});
