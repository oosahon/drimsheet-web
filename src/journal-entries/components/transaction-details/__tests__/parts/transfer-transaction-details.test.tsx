import { TransferTransactionDetails } from '@/journal-entries/components/transaction-details/parts/transfer-transaction-details';
import type { ITransferTransactionDetails } from '@/journal-entries/lib/types/transaction-details';
import {
  EExchangeRateType,
  EJournalEntrySourceType,
} from '@/shared/lib/api/Api';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const baseDetails: ITransferTransactionDetails = {
  attachments: [],
  destinationAccountName: 'Main checking',
  destinationAmount: {
    amount: 1_590_000,
    currencyCode: 'NGN',
    isMinorUnit: false,
  },
  direction: EJournalEntrySourceType.Transfer,
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
  fees: [
    {
      accountId: 'bank-fees',
      accountName: 'Bank fees',
      amount: { amount: 10, currencyCode: 'USD', isMinorUnit: false },
      description: 'International transfer charge',
      id: 'line-3',
    },
    {
      accountId: 'correspondent-fees',
      accountName: 'Correspondent fees',
      amount: { amount: 5, currencyCode: 'USD', isMinorUnit: false },
      description: null,
      id: 'line-4',
    },
  ],
  kind: 'transfer',
  memo: null,
  sourceAccountName: 'USD account',
  sourceAmount: { amount: 1_000, currencyCode: 'USD', isMinorUnit: false },
};

describe('TransferTransactionDetails', () => {
  it('renders both cash accounts, conversion, and every fee', () => {
    render(<TransferTransactionDetails details={baseDetails} />);

    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('USD account')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByText('Main checking')).toBeInTheDocument();
    expect(screen.getAllByText('USD').length).toBeGreaterThan(0);
    expect(screen.getAllByText('NGN').length).toBeGreaterThan(0);
    expect(screen.getByText('1 USD = 1,590 NGN')).toBeInTheDocument();
    expect(screen.getByText('Bank fees')).toBeInTheDocument();
    expect(
      screen.getByText('International transfer charge')
    ).toBeInTheDocument();
    expect(screen.getByText('Correspondent fees')).toBeInTheDocument();
  });

  it('hides conversion and fees for a same-currency transfer without charges', () => {
    render(
      <TransferTransactionDetails
        details={{
          ...baseDetails,
          destinationAmount: {
            amount: 250_000,
            currencyCode: 'NGN',
            isMinorUnit: false,
          },
          exchangeRate: null,
          fees: [],
          sourceAmount: {
            amount: 250_000,
            currencyCode: 'NGN',
            isMinorUnit: false,
          },
        }}
      />
    );

    expect(screen.queryByText('Conversion')).not.toBeInTheDocument();
    expect(screen.queryByText('Transfer fee')).not.toBeInTheDocument();
  });
});
