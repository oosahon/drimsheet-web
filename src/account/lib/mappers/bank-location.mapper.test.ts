import { describe, expect, it } from 'vitest';
import { bankLocationMapper } from './bank-location.mapper';

describe('bankLocationMapper', () => {
  describe('toJurisdictionDto', () => {
    it('maps minimal bank location parameters into a complete IJurisdictionDto', () => {
      const input = {
        code: 'US',
        name: 'United States',
      };

      const result = bankLocationMapper.toJurisdictionDto(input);

      expect(result).toEqual({
        code: 'US',
        name: 'United States',
        currencyCode: '',
        maxFiscalMonths: 12,
        accountingStandards: {
          individual: [],
          sole_trader: [],
          private_company: [],
        },
      });
    });

    it('does not leak extra properties from source object', () => {
      const input = {
        code: 'CA',
        name: 'Canada',
        extraField: 'should not leak',
      };

      const result = bankLocationMapper.toJurisdictionDto(input);

      expect(result).not.toHaveProperty('extraField');
    });
  });
});
