import type { IMoneyDto } from '@/shared/lib/api/Api';

function serializeAmount(amount: number | string): number {
  return typeof amount === 'number'
    ? amount
    : Number(amount.replaceAll(',', '').trim());
}

function toMoneyDto(
  amount: number | string,
  currencyCode: string,
  isMinorUnit = false
): IMoneyDto {
  return {
    amount: serializeAmount(amount),
    currencyCode,
    isMinorUnit,
  };
}

export const moneyMapper = Object.freeze({
  serializeAmount,
  toMoneyDto,
});
