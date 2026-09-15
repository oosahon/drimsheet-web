import { CurrencyExchangeRateInput } from '@/shared/components/currency-exchange-rate-input';
import { currencyExchangeRateInputValidation } from '@/shared/components/currency-exchange-rate-input/validation';
import type { IExchangeRate } from '@/shared/lib/api/Api';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('CurrencyExchangeRateInput', () => {
  const officialRate = {
    baseCurrencyCode: 'USD',
    targetCurrencyCode: 'NGN',
    rate: 1500,
    asOf: '2026-06-01T00:00:00.000Z',
  } as IExchangeRate;

  it('renders fixed base and target currencies without a selector', () => {
    render(
      <CurrencyExchangeRateInput baseCurrency="USD" targetCurrency="NGN" />
    );

    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('NGN')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('keeps the base amount fixed at one and disabled', () => {
    render(
      <CurrencyExchangeRateInput baseCurrency="USD" targetCurrency="NGN" />
    );

    expect(screen.getByLabelText('USD base amount')).toHaveValue('1');
    expect(screen.getByLabelText('USD base amount')).toBeDisabled();
  });

  it('formats the target default value and allows it to be edited', async () => {
    const user = userEvent.setup();

    render(
      <CurrencyExchangeRateInput
        baseCurrency="USD"
        targetCurrency="NGN"
        defaultValue={1500}
      />
    );

    const targetInput = screen.getByLabelText('NGN exchange rate');

    expect(targetInput).toHaveValue('1,500');
    expect(targetInput).not.toBeDisabled();

    await user.clear(targetInput);
    await user.type(targetInput, '2500.5');

    expect(targetInput).toHaveValue('2,500.5');
  });

  it('passes target input attributes and change events through', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <CurrencyExchangeRateInput
        aria-label="Custom exchange rate"
        baseCurrency="USD"
        name="exchangeRate"
        onChange={onChange}
        targetCurrency="NGN"
      />
    );

    const targetInput = screen.getByLabelText('Custom exchange rate');

    expect(targetInput).toHaveAttribute('name', 'exchangeRate');

    await user.type(targetInput, '2');

    expect(onChange).toHaveBeenCalled();
  });

  it('supports an opt-in compact responsive layout', () => {
    render(
      <CurrencyExchangeRateInput
        baseCurrency="USD"
        layout="compact"
        targetCurrency="NGN"
      />
    );

    expect(
      screen
        .getByLabelText('NGN exchange rate')
        .closest('[data-slot="currency-exchange-rate-input"]')
    ).toHaveAttribute('data-layout', 'compact');
  });

  it('shows warning-colored helper text when no official rate is available', () => {
    render(
      <CurrencyExchangeRateInput
        baseCurrency="USD"
        displayOfficialRate
        targetCurrency="NGN"
      />
    );

    const helperText = screen.getByText('No system official rate');

    expect(helperText).toHaveAttribute('data-slot', 'field-description');
    expect(helperText).toHaveClass('text-warning');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the official rate without a trailing period', () => {
    render(
      <CurrencyExchangeRateInput
        baseCurrency="USD"
        displayOfficialRate
        officialRate={officialRate}
        targetCurrency="NGN"
      />
    );

    const helperText = screen.getByText(/Official rate:/);

    expect(helperText).toHaveTextContent('Official rate: 1500');
    expect(helperText).toHaveAttribute('data-slot', 'field-description');
    expect(screen.getByLabelText('NGN exchange rate')).toHaveValue('1,500');
    expect(screen.getByText('1500')).toHaveClass('font-semibold');
    expect(helperText).toHaveClass('text-success');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps the official-rate helper hidden unless display is enabled', () => {
    render(
      <CurrencyExchangeRateInput
        baseCurrency="USD"
        officialRate={officialRate}
        targetCurrency="NGN"
      />
    );

    expect(screen.queryByText(/Official rate:/)).not.toBeInTheDocument();
  });
});

describe('currencyExchangeRateInputValidation', () => {
  it('accepts positive numeric exchange rates', async () => {
    await expect(
      currencyExchangeRateInputValidation.validate('1.5')
    ).resolves.toBe(1.5);
  });

  it('requires an exchange rate', async () => {
    await expect(
      currencyExchangeRateInputValidation.validate('')
    ).rejects.toThrow('Exchange rate is required');
  });

  it('rejects non-numeric exchange rates', async () => {
    await expect(
      currencyExchangeRateInputValidation.validate('invalid')
    ).rejects.toThrow('Exchange rate must be a number');
  });

  it('rejects zero and negative exchange rates', async () => {
    await expect(
      currencyExchangeRateInputValidation.validate(0)
    ).rejects.toThrow('Exchange rate must be greater than zero');
    await expect(
      currencyExchangeRateInputValidation.validate(-1)
    ).rejects.toThrow('Exchange rate must be greater than zero');
  });
});
