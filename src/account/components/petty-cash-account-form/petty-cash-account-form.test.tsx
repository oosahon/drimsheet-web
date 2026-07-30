import type { ICurrencyDto } from '@/shared/lib/api/Api';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { PettyCashAccountForm } from './petty-cash-account-form';
import type { PettyCashAccountFormProps } from './types';

const currencies: ICurrencyDto[] = [
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    minorUnit: 2,
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    minorUnit: 2,
  },
];

const validInitialValues = {
  name: 'Office petty cash',
  currencyCode: 'NGN',
  openingBalance: 100,
  openingDate: '2026-07-01',
};

function renderForm(props?: Partial<PettyCashAccountFormProps>) {
  const onSubmit = props?.onSubmit ?? vi.fn();

  render(
    <PettyCashAccountForm
      accountingCurrencyCode="NGN"
      currencies={currencies}
      onSubmit={onSubmit}
      {...props}
    />
  );

  return { onSubmit };
}

describe('PettyCashAccountForm', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.hasPointerCapture = vi.fn(
      () => false
    ) as unknown as typeof window.HTMLElement.prototype.hasPointerCapture;
    window.HTMLElement.prototype.releasePointerCapture =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.releasePointerCapture;
    window.HTMLElement.prototype.setPointerCapture =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.setPointerCapture;
    window.HTMLElement.prototype.scrollIntoView =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.scrollIntoView;
  });

  it('renders the form controls with accessible labels', () => {
    renderForm();

    expect(screen.getByLabelText('Account name')).toBeInTheDocument();
    expect(screen.getByLabelText('Currency')).toBeInTheDocument();
    expect(screen.getByLabelText('Opening balance')).toBeInTheDocument();
    expect(screen.getByLabelText('Opening date')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Create as a sub account')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create account' })
    ).toBeInTheDocument();
  });

  it('shows required validation errors after an empty submit', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(
      await screen.findByText('Account name is required')
    ).toBeInTheDocument();
    expect(screen.getByText('Currency is required')).toBeInTheDocument();
    expect(screen.getByText('Opening balance is required')).toBeInTheDocument();
    expect(screen.getByText('Opening date is required')).toBeInTheDocument();
  });

  it('disables opening fields when opening without a balance', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(
      screen.getByLabelText('Create without an opening balance')
    );

    expect(screen.getByLabelText('Opening balance')).toBeDisabled();
    expect(screen.getByLabelText('Opening date')).toBeDisabled();
  });

  it('only shows exchange rate for a foreign currency', () => {
    const { rerender } = render(
      <PettyCashAccountForm
        accountingCurrencyCode="NGN"
        currencies={currencies}
        initialValues={{ currencyCode: 'NGN' }}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.queryByLabelText('Exchange rate')).not.toBeInTheDocument();

    rerender(
      <PettyCashAccountForm
        accountingCurrencyCode="NGN"
        currencies={currencies}
        initialValues={{ currencyCode: 'USD' }}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Exchange rate')).toBeInTheDocument();
  });

  it('submits a valid same-currency account', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm({
      initialValues: validInitialValues,
    });

    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Office petty cash',
        currencyCode: 'NGN',
        createWithoutOpeningBalance: false,
        openingBalance: 100,
        openingDate: '2026-07-01',
        exchangeRate: '',
        isSubAccount: false,
      })
    );
  });

  it('submits the selected sub-account state', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm({
      initialValues: validInitialValues,
    });

    await user.click(screen.getByLabelText('Create as a sub account'));
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ isSubAccount: true })
      )
    );
  });

  it('normalizes opening fields when creating without a balance', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm({
      initialValues: {
        ...validInitialValues,
        createWithoutOpeningBalance: true,
        openingBalance: 500,
        openingDate: '2026-07-01',
        exchangeRate: 1500,
        isSubAccount: true,
      },
    });

    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          createWithoutOpeningBalance: true,
          openingBalance: '',
          openingDate: '',
          exchangeRate: '',
          isSubAccount: true,
        })
      )
    );
  });
});
