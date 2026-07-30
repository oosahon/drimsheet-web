import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OpeningBalanceFields } from './opening-balance-fields';
import type { OpeningBalanceFieldsProps } from './types';

describe('OpeningBalanceFields', () => {
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
