import uiCurrencies from '@/shared/config/currencies.json' with { type: 'json' };

export const getCurrencyLogo = (currencyCode: string) => {
  const currency = uiCurrencies.find((c) => c.code === currencyCode);
  return currency?.logo;
};
