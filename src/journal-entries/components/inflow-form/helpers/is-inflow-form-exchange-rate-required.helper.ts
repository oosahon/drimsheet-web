export function isInflowFormExchangeRateRequired(
  sourceCurrencyCode: string | null | undefined,
  functionalCurrencyCode: string | null | undefined
) {
  return Boolean(
    sourceCurrencyCode &&
    functionalCurrencyCode &&
    sourceCurrencyCode !== functionalCurrencyCode
  );
}
