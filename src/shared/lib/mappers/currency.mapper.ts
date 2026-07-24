import { EExchangeRateType, type IExchangeRateDto } from '@/shared/lib/api/Api';

function toUserEnteredExchangeRate(
  input: Omit<IExchangeRateDto, 'type' | 'source'>
): IExchangeRateDto {
  return {
    baseCurrencyCode: input.baseCurrencyCode,
    targetCurrencyCode: input.targetCurrencyCode,
    rate: input.rate,
    type: EExchangeRateType.Market,
    asOf: input.asOf,
    source: 'manual',
  };
}

export const currencyMapper = Object.freeze({
  toUserEnteredExchangeRate,
});
