import * as useGetBankByCountryModule from '@/account/hooks/use-get-bank-by-country';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BankAccountFormContainer } from './bank-account-form.container';

vi.mock('@/account/hooks/use-get-bank-by-country', () => ({
  useGetBankByCountry: vi.fn(),
}));

describe('BankAccountFormContainer', () => {
  it('triggers bank query with initial jurisdiction', () => {
    const useGetBankByCountrySpy = vi.spyOn(
      useGetBankByCountryModule,
      'useGetBankByCountry'
    );
    useGetBankByCountrySpy.mockReturnValue({
      data: [{ bankCode: 'GTB', bankName: 'Guaranty Trust Bank' }],
      isPending: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<
      typeof useGetBankByCountryModule.useGetBankByCountry
    >);

    render(
      <BankAccountFormContainer
        accountingCurrencyCode="NGN"
        bankLocations={[
          { code: 'NG', name: 'Nigeria' },
          { code: 'US', name: 'United States' },
        ]}
        currencies={[{ code: 'NGN', name: 'Naira', symbol: '₦' }]}
        initialBankLocation="NG"
        initialValues={{ currencyCode: 'NGN', bankLocation: 'NG' }}
        onSubmit={vi.fn()}
      />
    );

    expect(useGetBankByCountrySpy).toHaveBeenCalledWith('NG');
  });

  it('updates bank query location while retaining entered account name in form state', async () => {
    const user = userEvent.setup();
    const useGetBankByCountrySpy = vi.spyOn(
      useGetBankByCountryModule,
      'useGetBankByCountry'
    );
    useGetBankByCountrySpy.mockReturnValue({
      data: [],
      isPending: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<
      typeof useGetBankByCountryModule.useGetBankByCountry
    >);

    render(
      <BankAccountFormContainer
        accountingCurrencyCode="NGN"
        bankLocations={[
          { code: 'NG', name: 'Nigeria' },
          { code: 'US', name: 'United States' },
        ]}
        currencies={[{ code: 'NGN', name: 'Naira', symbol: '₦', minorUnit: 2 }]}
        initialBankLocation="NG"
        initialValues={{ currencyCode: 'NGN', bankLocation: 'NG' }}
        onSubmit={vi.fn()}
      />
    );

    const nameInput = screen.getByLabelText('Account name');
    await user.type(nameInput, 'My Operating Account');

    const locationInput = screen.getByPlaceholderText('Select a country');
    await user.click(locationInput);
    const usOption = await screen.findByRole('option', {
      name: /United States/i,
    });
    await user.click(usOption);

    expect(useGetBankByCountrySpy).toHaveBeenLastCalledWith('US');
    expect(nameInput).toHaveValue('My Operating Account');
  });
});
