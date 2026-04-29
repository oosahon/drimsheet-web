import { FISCAL_YEAR_STARTS } from '@/accounting/config/fiscal-year-start.config';
import { type UJurisdictionCode } from '@/shared/utils/api/Api';
import { useMemo } from 'react';

export function useFiscalYearWarning(
  countryCode: string,
  fiscalYearStart?: { month: number; day: number }
) {
  const expectedStart = useMemo(
    () =>
      FISCAL_YEAR_STARTS[countryCode as UJurisdictionCode] || {
        month: 1,
        day: 1,
      },
    [countryCode]
  );

  const showFiscalYearWarning = useMemo(() => {
    if (!fiscalYearStart) return false;
    return (
      fiscalYearStart.month !== expectedStart.month ||
      fiscalYearStart.day !== expectedStart.day
    );
  }, [fiscalYearStart, expectedStart]);

  return { expectedStart, showFiscalYearWarning };
}
