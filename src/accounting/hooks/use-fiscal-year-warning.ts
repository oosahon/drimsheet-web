import { FISCAL_YEAR_STARTS } from '@/accounting/lib/configs/fiscal-year-start.config';
import { type UJurisdictionCode } from '@/shared/lib/api/Api';
import { JS_MONTH_INDEX_OFFSET } from '@/shared/lib/utils/date';
import { useMemo } from 'react';

export function useFiscalYearWarning(
  countryCode: string,
  fiscalYearStart?: Date | null
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

    const actualMonth = fiscalYearStart.getMonth() + JS_MONTH_INDEX_OFFSET;
    const actualDay = fiscalYearStart.getDate();

    const isExpectedMonth = actualMonth === expectedStart.month;
    const isExpectedDay = actualDay === expectedStart.day;

    return !(isExpectedMonth && isExpectedDay);
  }, [fiscalYearStart, expectedStart]);

  return { expectedStart, showFiscalYearWarning };
}
