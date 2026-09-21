import { TransactionSummary } from '@/journal-entries/components/transactions-table/parts/transaction-summary';
import { EJournalEntrySourceType } from '@/shared/lib/api/Api';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('TransactionSummary', () => {
  it('renders a payment with additional counterparties and categories', () => {
    render(
      <TransactionSummary
        row={{
          direction: EJournalEntrySourceType.Payment,
          firstCounterpartyName: 'Osahon Oboite',
          additionalCounterpartyCount: 1,
          firstCategoryName: 'Gift',
          additionalCategoryCount: 2,
        }}
      />
    );

    expect(
      screen.getByText('Payment to Osahon Oboite & 1 other')
    ).toBeInTheDocument();
    expect(screen.getByText('Gift & 2 others')).toBeInTheDocument();
  });

  it('renders a receipt with one counterparty and category', () => {
    render(
      <TransactionSummary
        row={{
          direction: EJournalEntrySourceType.Receipt,
          firstCounterpartyName: 'Ada Okafor',
          additionalCounterpartyCount: 0,
          firstCategoryName: 'Professional services',
          additionalCategoryCount: 0,
        }}
      />
    );

    expect(screen.getByText('Receipt from Ada Okafor')).toBeInTheDocument();
    expect(screen.getByText('Professional services')).toBeInTheDocument();
  });

  it('renders only the account path for a transfer', () => {
    render(
      <TransactionSummary
        row={{
          direction: EJournalEntrySourceType.Transfer,
          sourceAccountName: 'USD account',
          destinationAccountName: 'Main checking',
          additionalCounterpartyCount: 0,
          additionalCategoryCount: 0,
        }}
      />
    );

    const title = screen.getByText('USD account → Main checking');

    expect(title).toBeInTheDocument();
    expect(title.parentElement?.children).toHaveLength(1);
  });
});
