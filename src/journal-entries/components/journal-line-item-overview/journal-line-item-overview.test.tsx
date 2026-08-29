import { JournalLineItemOverview } from '@/journal-entries/components/journal-line-item-overview';
import { ELedgerAccountBalanceEffect } from '@/shared/lib/api/Api';
import { render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';

const defaultProps: ComponentProps<typeof JournalLineItemOverview> = {
  categoryName: 'Professional services',
  effectiveDate: new Date('2026-06-01T12:00:00Z'),
  amount: {
    amount: 500000,
    currencyCode: 'NGN',
    isMinorUnit: false,
  },
  functionalAmount: {
    amount: 500000,
    currencyCode: 'NGN',
    isMinorUnit: false,
  },
  balanceEffect: ELedgerAccountBalanceEffect.Increase,
  countryCode: 'NG',
};

function renderOverview(
  props: Partial<ComponentProps<typeof JournalLineItemOverview>> = {}
) {
  return render(<JournalLineItemOverview {...defaultProps} {...props} />);
}

describe('JournalLineItemOverview', () => {
  it('renders the category, effective date, and journal-line amount', () => {
    renderOverview();

    expect(screen.getByText('Professional services')).toBeInTheDocument();
    expect(screen.getByText('1 Jun 2026')).toBeInTheDocument();
    expect(screen.getByText(/500,000/)).toBeInTheDocument();
  });

  it.each([
    [ELedgerAccountBalanceEffect.Increase, 'Increases balance'],
    [ELedgerAccountBalanceEffect.Decrease, 'Decreases balance'],
    [ELedgerAccountBalanceEffect.Noop, 'Does not affect balance'],
  ])('labels the %s balance effect', (balanceEffect, accessibleName) => {
    renderOverview({ balanceEffect });

    expect(
      screen.getByRole('img', { name: accessibleName })
    ).toBeInTheDocument();
  });

  it('omits the functional amount when its currency matches the line amount', () => {
    renderOverview();

    expect(screen.queryByText('≈')).not.toBeInTheDocument();
    expect(screen.getAllByText(/500,000/)).toHaveLength(1);
  });

  it('shows the approximate functional amount for a different currency', () => {
    renderOverview({
      functionalAmount: {
        amount: 900,
        currencyCode: 'USD',
        isMinorUnit: false,
      },
    });

    expect(screen.getByText('≈')).toBeInTheDocument();
    expect(screen.getByText(/900/)).toBeInTheDocument();
  });

  it('forwards native item props to the overview', () => {
    renderOverview({
      className: 'custom-overview-class',
      id: 'journal-line-overview',
    });

    expect(document.querySelector('#journal-line-overview')).toHaveClass(
      'custom-overview-class'
    );
  });
});
