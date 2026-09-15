import { OpeningBalanceFields } from '@/account/components/opening-balance-fields';
import type { OpeningBalanceFieldsProps } from '@/account/components/opening-balance-fields/types';
import type { IExchangeRate } from '@/shared/lib/api/Api';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('OpeningBalanceFields', () => {
  const officialExchangeRate = {
    baseCurrencyCode: 'USD',
    targetCurrencyCode: 'NGN',
    rate: 1500,
    asOf: '2026-07-01T00:00:00.000Z',
  } as IExchangeRate;

  const defaultProps: OpeningBalanceFieldsProps = {
    accountingCurrencyCode: 'NGN',
    currencyCode: 'NGN',
    createWithoutOpeningBalance: false,
    openingBalance: '',
    openingDate: '',
    exchangeRate: '',
    onCreateWithoutOpeningBalanceChange: vi.fn(),
    onOpeningBalanceChange: vi.fn(),
    onOpeningDateChange: vi.fn(),
    onExchangeRateChange: vi.fn(),
  };

  it('renders inputs and checkbox with accessible labels', () => {
    render(<OpeningBalanceFields {...defaultProps} />);

    expect(
      screen.getByLabelText('Create without an opening balance')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Opening balance')).toBeInTheDocument();
    expect(screen.getByLabelText('Opening date')).toBeInTheDocument();
    expect(screen.queryByLabelText('Exchange rate')).not.toBeInTheDocument();
  });

  it('disables inputs when createWithoutOpeningBalance is true', () => {
    render(
      <OpeningBalanceFields {...defaultProps} createWithoutOpeningBalance />
    );

    expect(screen.getByLabelText('Opening balance')).toBeDisabled();
    expect(screen.getByLabelText('Opening date')).toBeDisabled();
  });

  it('calls onCreateWithoutOpeningBalanceChange when checkbox is toggled', async () => {
    const user = userEvent.setup();
    const onCreateWithoutOpeningBalanceChange = vi.fn();

    render(
      <OpeningBalanceFields
        {...defaultProps}
        onCreateWithoutOpeningBalanceChange={
          onCreateWithoutOpeningBalanceChange
        }
      />
    );

    await user.click(
      screen.getByLabelText('Create without an opening balance')
    );

    expect(onCreateWithoutOpeningBalanceChange).toHaveBeenCalledWith(true);
  });

  it('shows exchange rate input only when currency is foreign and opening balance is enabled', () => {
    const { rerender } = render(
      <OpeningBalanceFields {...defaultProps} currencyCode="USD" />
    );

    expect(screen.getByLabelText('Exchange rate')).toBeInTheDocument();

    rerender(
      <OpeningBalanceFields
        {...defaultProps}
        createWithoutOpeningBalance
        currencyCode="USD"
      />
    );

    expect(screen.queryByLabelText('Exchange rate')).not.toBeInTheDocument();
  });

  it('waits for an opening date before showing official-rate helper text', () => {
    render(<OpeningBalanceFields {...defaultProps} currencyCode="USD" />);

    expect(
      screen.queryByText('No system official rate')
    ).not.toBeInTheDocument();
  });

  it('shows the available official rate as helper text', () => {
    render(
      <OpeningBalanceFields
        {...defaultProps}
        currencyCode="USD"
        officialExchangeRate={officialExchangeRate}
        openingDate="2026-07-01"
      />
    );

    expect(screen.getByText(/Official rate:/)).toHaveTextContent(
      'Official rate: 1500'
    );
    expect(screen.getByLabelText('Exchange rate')).toHaveValue('1,500');
  });

  it('shows unavailable helper text after an opening date is selected', () => {
    render(
      <OpeningBalanceFields
        {...defaultProps}
        currencyCode="USD"
        openingDate="2026-07-01"
      />
    );

    expect(screen.getByText('No system official rate')).toHaveClass(
      'text-warning'
    );
  });

  it('displays field errors when provided', () => {
    render(
      <OpeningBalanceFields
        {...defaultProps}
        currencyCode="USD"
        exchangeRateError={[{ message: 'Exchange rate required' }]}
        openingBalanceError={[{ message: 'Opening balance required' }]}
        openingDateError={[{ message: 'Opening date required' }]}
      />
    );

    expect(screen.getByText('Opening balance required')).toBeInTheDocument();
    expect(screen.getByText('Opening date required')).toBeInTheDocument();
    expect(screen.getByText('Exchange rate required')).toBeInTheDocument();
  });
});
