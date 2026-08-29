import type { IExchangeRate } from '@/shared/lib/api/Api';

function getValue(
  value: string | number | undefined,
  defaultValue: string | number | undefined,
  officialRate: IExchangeRate | undefined
) {
  if (value !== undefined && value !== '') return value;
  if (defaultValue !== undefined && defaultValue !== '') return defaultValue;

  return officialRate?.rate;
}

const currencyExchangeRateInputHelpers = Object.freeze({
  getValue,
});

export default currencyExchangeRateInputHelpers;
