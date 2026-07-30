import type { IJurisdictionDto } from '@/shared/lib/api/Api';

function toJurisdictionDto(location: {
  code: string;
  name: string;
}): IJurisdictionDto {
  return {
    code: location.code,
    name: location.name,
    currencyCode: '',
    maxFiscalMonths: 12,
    accountingStandards: {
      individual: [],
      sole_trader: [],
      private_company: [],
    },
  };
}

export const bankLocationMapper = Object.freeze({
  toJurisdictionDto,
});
