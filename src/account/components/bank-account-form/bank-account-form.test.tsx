import type { IBankDirectoryDto, ICurrencyDto } from '@/shared/lib/api/Api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { BankAccountForm } from './bank-account-form';
import { BankAccountFormContainer } from './bank-account-form.container';
import type { BankAccountFormProps, IBankAccountFormValues } from './types';

const currencies: ICurrencyDto[] = [
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', minorUnit: 2 },
  { code: 'USD', name: 'US Dollar', symbol: '$', minorUnit: 2 },
];

const bankLocations = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'US', name: 'United States' },
];

const banks: IBankDirectoryDto[] = [
  { countryCode: 'NG', bankCode: 'GTB', bankName: 'Guaranty Trust Bank' },
  { countryCode: 'NG', bankCode: 'ACCESS', bankName: 'Access Bank' },
];

const validInitialValues: Partial<IBankAccountFormValues> = {
  name: 'Operating Account',
  currencyCode: 'NGN',
  bankLocation: 'NG',
  bankName: 'Access Bank',
  accountNumber: '0123456789',
  accountName: 'Acme Ltd',
  openingBalance: 5000,
  openingDate: '2026-07-01',
};

function renderForm(props?: Partial<BankAccountFormProps>) {
  const onSubmit = props?.onSubmit ?? vi.fn();
  const onBankLocationChange = props?.onBankLocationChange ?? vi.fn();

  render(
    <BankAccountForm
      accountingCurrencyCode="NGN"
      bankLocations={bankLocations}
      banks={banks}
      currencies={currencies}
      onBankLocationChange={onBankLocationChange}
      onSubmit={onSubmit}
      {...props}
    />
  );

  return { onSubmit, onBankLocationChange };
}

describe('BankAccountForm', () => {
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

  it('renders all form controls with accessible labels and info alert', () => {
    renderForm();

    expect(screen.getByLabelText('Account name')).toBeInTheDocument();
    expect(screen.getByLabelText('Currency')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Bank location' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Bank name' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Bank account number')).toBeInTheDocument();
    expect(screen.getByLabelText('Bank account name')).toBeInTheDocument();
    expect(
      screen.getByText(
        /We collect these details to ensure accurate reconciliation/i
      )
    ).toBeInTheDocument();
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
    expect(screen.getByText('Bank location is required')).toBeInTheDocument();
    expect(screen.getByText('Bank name is required')).toBeInTheDocument();
    expect(
      screen.getByText('Bank account number is required')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Bank account name is required')
    ).toBeInTheDocument();
    expect(screen.getByText('Opening balance is required')).toBeInTheDocument();
    expect(screen.getByText('Opening date is required')).toBeInTheDocument();
  });

  it('handles field changes and location change callback', async () => {
    const user = userEvent.setup();
    const { onBankLocationChange } = renderForm({
      initialValues: validInitialValues,
    });

    const locationInput = screen.getByPlaceholderText('Select a country');
    await user.click(locationInput);
    const usOption = await screen.findByRole('option', {
      name: /United States/i,
    });
    await user.click(usOption);

    expect(onBankLocationChange).toHaveBeenCalledWith('US');

    const createWithoutBalanceCheckbox = screen.getByLabelText(
      'Create without an opening balance'
    );
    await user.click(createWithoutBalanceCheckbox);
    expect(screen.getByLabelText('Opening balance')).toBeDisabled();
  });

  it('submits a valid bank account form', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm({
      initialValues: validInitialValues,
    });

    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Operating Account',
        currencyCode: 'NGN',
        bankLocation: 'NG',
        bankName: 'Access Bank',
        accountNumber: '0123456789',
        accountName: 'Acme Ltd',
        createWithoutOpeningBalance: false,
        openingBalance: 5000,
        openingDate: '2026-07-01',
        exchangeRate: '',
        isSubAccount: false,
      })
    );
  });

  it('submits a foreign currency bank account with exchange rate', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm({
      initialValues: {
        ...validInitialValues,
        currencyCode: 'USD',
        exchangeRate: 1500,
      },
    });

    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          currencyCode: 'USD',
          exchangeRate: 1500,
        })
      )
    );
  });

  it('submits sub account checkbox state', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm({
      initialValues: validInitialValues,
    });

    await user.click(screen.getByLabelText('Create as a sub account'));
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          isSubAccount: true,
        })
      )
    );
  });

  it('normalizes opening balance when createWithoutOpeningBalance is true', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm({
      initialValues: {
        ...validInitialValues,
        createWithoutOpeningBalance: true,
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
        })
      )
    );
  });
});

describe('BankAccountFormContainer', () => {
  it('renders container with country-to-bank lookup and handles location change', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BankAccountFormContainer
          accountingCurrencyCode="NGN"
          bankLocations={bankLocations}
          currencies={currencies}
          onSubmit={vi.fn()}
        />
      </QueryClientProvider>
    );

    const locationInput = screen.getByPlaceholderText('Select a country');
    await user.click(locationInput);
    const usOption = await screen.findByRole('option', {
      name: /United States/i,
    });
    await user.click(usOption);
    expect(locationInput).toHaveValue('United States');
  });
});
