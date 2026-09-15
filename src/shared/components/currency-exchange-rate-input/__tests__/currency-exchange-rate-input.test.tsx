import type { ICurrencyExchangeRateInputValue } from '@/shared/components/currency-exchange-rate-input';
import { CurrencyExchangeRateInput } from '@/shared/components/currency-exchange-rate-input';
import { currencyExchangeRateInputValidation } from '@/shared/components/currency-exchange-rate-input/validation';
import type { IExchangeRate } from '@/shared/lib/api/Api';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

function ControlledCurrencyExchangeRateInput({
  officialRate,
}: Readonly<{
  officialRate?: IExchangeRate;
}>) {
  const [value, setValue] = useState<ICurrencyExchangeRateInputValue | null>({
    value: 1000,
    inverted: false,
  });

  return (
    <CurrencyExchangeRateInput
      baseCurrency="USD"
      officialRate={officialRate}
      onChange={setValue}
      targetCurrency="NGN"
      value={value}
    />
  );
}

describe('CurrencyExchangeRateInput', () => {
  const officialRate = {
    baseCurrencyCode: 'USD',
    targetCurrencyCode: 'NGN',
    rate: 1500,
    asOf: '2026-06-01T00:00:00.000Z',
  } as IExchangeRate;

  it('renders fixed base and target currencies without a selector', () => {
    render(
      <CurrencyExchangeRateInput
        baseCurrency="USD"
        onChange={vi.fn()}
        targetCurrency="NGN"
        value={null}
      />
    );

    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('NGN')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('keeps the base amount fixed at one and disabled', () => {
    render(
      <CurrencyExchangeRateInput
        baseCurrency="USD"
        onChange={vi.fn()}
        targetCurrency="NGN"
        value={null}
      />
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
        onChange={vi.fn()}
        value={{ value: 1500, inverted: false }}
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
        value={null}
      />
    );

    const targetInput = screen.getByLabelText('Custom exchange rate');

    expect(targetInput).toHaveAttribute('name', 'exchangeRate');

    await user.type(targetInput, '2');

    expect(onChange).toHaveBeenLastCalledWith({
      value: 2,
      inverted: false,
    });
  });

  it('supports an opt-in compact responsive layout', () => {
    render(
      <CurrencyExchangeRateInput
        baseCurrency="USD"
        layout="compact"
        onChange={vi.fn()}
        targetCurrency="NGN"
        value={null}
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
        onChange={vi.fn()}
        targetCurrency="NGN"
        value={null}
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
        onChange={vi.fn()}
        targetCurrency="NGN"
        value={null}
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
        onChange={vi.fn()}
        targetCurrency="NGN"
        value={null}
      />
    );

    expect(screen.queryByText(/Official rate:/)).not.toBeInTheDocument();
  });

  it('keeps the arrow decorative and renders a separate invert action', () => {
    const { container } = render(
      <CurrencyExchangeRateInput
        baseCurrency="USD"
        onChange={vi.fn()}
        targetCurrency="NGN"
        value={null}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Invert rates' })
    ).toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('inverts the displayed currencies and preserves number precision', async () => {
    const user = userEvent.setup();
    render(<ControlledCurrencyExchangeRateInput />);

    expect(screen.getByLabelText('USD base amount')).toHaveValue('1');
    expect(screen.getByLabelText('NGN exchange rate')).toHaveValue('1,000');

    await user.click(screen.getByRole('button', { name: 'Invert rates' }));

    expect(screen.getByLabelText('NGN base amount')).toHaveValue('1');
    expect(screen.getByLabelText('USD exchange rate')).toHaveValue('0.001');

    await user.click(screen.getByRole('button', { name: 'Invert rates' }));

    expect(screen.getByLabelText('USD base amount')).toHaveValue('1');
    expect(screen.getByLabelText('NGN exchange rate')).toHaveValue('1,000');
  });

  it('defaults a null value to the canonical direction', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <CurrencyExchangeRateInput
        baseCurrency="USD"
        onChange={onChange}
        targetCurrency="NGN"
        value={null}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Invert rates' }));

    expect(onChange).toHaveBeenCalledWith(null);
    expect(screen.getByLabelText('USD base amount')).toHaveValue('1');
    expect(screen.getByLabelText('NGN exchange rate')).toHaveValue('');
  });

  it('inverts an official-rate fallback into an explicit value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <CurrencyExchangeRateInput
        baseCurrency="USD"
        officialRate={officialRate}
        onChange={onChange}
        targetCurrency="NGN"
        value={null}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Invert rates' }));

    expect(onChange).toHaveBeenCalledWith({
      value: 1 / 1500,
      inverted: true,
    });
  });

  it('renders official helper content in the selected direction', () => {
    render(
      <CurrencyExchangeRateInput
        baseCurrency="USD"
        displayOfficialRate
        officialRate={officialRate}
        onChange={vi.fn()}
        targetCurrency="NGN"
        value={{ value: 1 / 1500, inverted: true }}
      />
    );

    expect(screen.getByLabelText('NGN base amount')).toBeInTheDocument();
    expect(screen.getByLabelText('USD exchange rate')).toHaveValue(
      '0.0006666666666666666'
    );
    expect(screen.getByText(/Official rate:/)).toHaveTextContent(
      'Official rate: 0.0006666666666666666'
    );
  });

  it('disables the invert action with the editable input', () => {
    render(
      <CurrencyExchangeRateInput
        baseCurrency="USD"
        disabled
        onChange={vi.fn()}
        targetCurrency="NGN"
        value={null}
      />
    );

    expect(screen.getByRole('button', { name: 'Invert rates' })).toBeDisabled();
    expect(screen.getByLabelText('NGN exchange rate')).toBeDisabled();
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
