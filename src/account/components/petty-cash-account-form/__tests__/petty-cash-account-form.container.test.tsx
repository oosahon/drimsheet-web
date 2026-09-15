import { PettyCashAccountFormContainer } from '@/account/components/petty-cash-account-form';
import { useExchangeRates } from '@/shared/hooks/use-exchange-rates';
import { EExchangeRateType, type IExchangeRate } from '@/shared/lib/api/Api';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/use-exchange-rates', () => ({
  useExchangeRates: vi.fn(),
}));

describe('PettyCashAccountFormContainer', () => {
  it('suppresses the query until foreign-currency context is complete', () => {
    vi.mocked(useExchangeRates).mockReturnValue({
      data: undefined,
    } as ReturnType<typeof useExchangeRates>);

    render(
      <PettyCashAccountFormContainer
        accountingCurrencyCode="NGN"
        currencies={[]}
        initialValues={{ currencyCode: 'USD' }}
        onSubmit={vi.fn()}
      />
    );

    expect(useExchangeRates).toHaveBeenCalledWith(undefined);
    expect(
      screen.queryByText('No system official rate')
    ).not.toBeInTheDocument();
  });

  it('queries and supplies an official rate for initial foreign-currency context', () => {
    vi.mocked(useExchangeRates).mockReturnValue({
      data: [{ rate: 1500 } as IExchangeRate],
    } as ReturnType<typeof useExchangeRates>);

    render(
      <PettyCashAccountFormContainer
        accountingCurrencyCode="NGN"
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
