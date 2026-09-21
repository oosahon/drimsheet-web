import { CashTransactionDetails } from '@/journal-entries/components/transaction-details/parts/cash-transaction-details';
import type { ICashTransactionDetails } from '@/journal-entries/lib/types/transaction-details';
import {
  EExchangeRateType,
  EJournalEntrySourceType,
} from '@/shared/lib/api/Api';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const outflowDetails: ICashTransactionDetails = {
  amount: { amount: 1_000, currencyCode: 'USD', isMinorUnit: false },
  attachments: [],
  cashAccountName: 'USD account',
  categories: [
    {
      accountId: 'gift',
      accountName: 'Community gifts',
      amount: { amount: 750, currencyCode: 'USD', isMinorUnit: false },
      description: 'September outreach',
      id: 'line-2',
    },
    {
      accountId: 'donations',
      accountName: 'Donations',
      amount: { amount: 250, currencyCode: 'USD', isMinorUnit: false },
      description: null,
      id: 'line-3',
    },
  ],
  counterparties: [
    { id: 'counterparty-1', name: 'Osahon Oboite' },
    { id: 'counterparty-2', name: 'Ada Okafor' },
  ],
  direction: EJournalEntrySourceType.Payment,
  effectiveDate: '2026-09-16T00:00:00Z',
  exchangeRate: {
    asOf: '2026-09-16T00:00:00Z',
    baseCurrencyCode: 'USD',
    createdAt: '2026-09-16T10:00:00Z',
    currencyPair: 'USD/NGN',
    rate: 1590,
    source: 'User supplied',
    targetCurrencyCode: 'NGN',
    type: EExchangeRateType.Negotiated,
  },
  functionalAmount: {
    amount: 1_590_000,
    currencyCode: 'NGN',
    isMinorUnit: false,
  },
  kind: 'cash',
  memo: null,
};

describe('CashTransactionDetails', () => {
  it('renders outflow terminology, all categories, and conversion details', () => {
    render(<CashTransactionDetails details={outflowDetails} />);

    expect(screen.getByText('Paid from')).toBeInTheDocument();
    expect(screen.getByText('USD account')).toBeInTheDocument();
    expect(screen.getByText('Paid to')).toBeInTheDocument();
    expect(screen.getByText('Osahon Oboite, Ada Okafor')).toBeInTheDocument();
    expect(screen.getByText('Community gifts')).toBeInTheDocument();
    expect(screen.getByText('September outreach')).toBeInTheDocument();
    expect(screen.getByText('Donations')).toBeInTheDocument();
    expect(screen.getByText('1 USD = 1,590 NGN')).toBeInTheDocument();
  });

  it('uses inflow terminology and hides conversion when it is not applicable', () => {
    render(
      <CashTransactionDetails
        details={{
          ...outflowDetails,
          amount: { amount: 85_000, currencyCode: 'NGN', isMinorUnit: false },
          cashAccountName: 'Main checking',
          categories: [
            {
              accountId: 'services',
              accountName: 'Professional services',
              amount: {
                amount: 85_000,
                currencyCode: 'NGN',
                isMinorUnit: false,
              },
              description: null,
              id: 'line-1',
            },
          ],
          counterparties: [{ id: 'client-1', name: 'Northwind Ltd' }],
          direction: EJournalEntrySourceType.Receipt,
          exchangeRate: null,
          functionalAmount: {
            amount: 85_000,
            currencyCode: 'NGN',
            isMinorUnit: false,
          },
        }}
      />
    );

    expect(screen.getByText('Received into')).toBeInTheDocument();
    expect(screen.getByText('Received from')).toBeInTheDocument();
    expect(screen.getByText('Northwind Ltd')).toBeInTheDocument();
    expect(screen.getByText('Professional services')).toBeInTheDocument();
    expect(screen.queryByText('Conversion')).not.toBeInTheDocument();
  });
});
