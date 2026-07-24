import { moneyMapper } from '@/shared/lib/mappers/money.mapper';
import { describe, expect, it } from 'vitest';

describe('moneyMapper', () => {
  it('serializes a numeric amount', () => {
    expect(moneyMapper.serializeAmount(1500.5)).toBe(1500.5);
  });

  it('serializes a formatted string amount', () => {
    expect(moneyMapper.serializeAmount('1,500.50')).toBe(1500.5);
  });

  it('maps an amount to a major-unit money DTO by default', () => {
    expect(moneyMapper.toMoneyDto('1500.50', 'USD')).toEqual({
      amount: 1500.5,
      currencyCode: 'USD',
      isMinorUnit: false,
    });
  });

  it('maps an amount to a minor-unit money DTO when requested', () => {
    expect(moneyMapper.toMoneyDto(150050, 'USD', true)).toEqual({
      amount: 150050,
      currencyCode: 'USD',
      isMinorUnit: true,
    });
  });
});
