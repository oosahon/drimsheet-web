import { BankAccountFormContainer } from '@/account/components/bank-account-form';
import * as useGetBankByCountryModule from '@/account/hooks/use-get-bank-by-country';
import { useExchangeRates } from '@/shared/hooks/use-exchange-rates';
import { EExchangeRateType, type IExchangeRate } from '@/shared/lib/api/Api';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/account/hooks/use-get-bank-by-country', () => ({
  useGetBankByCountry: vi.fn(),
}));
vi.mock('@/shared/hooks/use-exchange-rates', () => ({
  useExchangeRates: vi.fn(),
}));

describe('BankAccountFormContainer', () => {
  beforeEach(() => {
    vi.mocked(useExchangeRates).mockReturnValue({
      data: undefined,
    } as ReturnType<typeof useExchangeRates>);
  });

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
        currencies={[{ code: 'NGN', name: 'Naira', symbol: '₦', minorUnit: 2 }]}
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

    const nameInput = screen.getByLabelText('Account Display Name');
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

  it('queries and supplies an official rate for initial foreign-currency context', () => {
    vi.mocked(useGetBankByCountryModule.useGetBankByCountry).mockReturnValue({
      data: [],
      isPending: false,
    } as unknown as ReturnType<
      typeof useGetBankByCountryModule.useGetBankByCountry
    >);
    vi.mocked(useExchangeRates).mockReturnValue({
      data: [{ rate: 1500 } as IExchangeRate],
    } as ReturnType<typeof useExchangeRates>);

    render(
      <BankAccountFormContainer
        accountingCurrencyCode="NGN"
        bankLocations={[]}
        currencies={[]}
        initialValues={{
          currencyCode: 'USD',
          openingDate: '2026-07-01',
        }}
        onSubmit={vi.fn()}
      />
    );

    expect(useExchangeRates).toHaveBeenCalledWith({
      currencyPair: 'USD/NGN',
      type: EExchangeRateType.Official,
      asOf: '2026-07-01',
      limit: 1,
    });
    expect(screen.getByText(/Official rate:/)).toHaveTextContent(
      'Official rate: 1500'
    );
  });
});
