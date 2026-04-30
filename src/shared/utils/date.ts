import countries from '@/shared/config/countries.json';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

export const JS_MONTH_INDEX_OFFSET = 1;

export const formatOptions = Object.freeze({
  monthAndDayOnly: 'MMMM Do',
  monthAndYear: 'MMM YYYY',
  apiDate: 'YYYY-MM-DD',
});

export function formatFiscalDate(month: number, day: number) {
  // Use a fixed leap year (2024) to support February 29th
  return dayjs()
    .year(2024)
    .month(month - 1)
    .date(day)
    .format(formatOptions.monthAndDayOnly);
}

export function getFiscalYearDateRange(
  month: number,
  day: number
): { startDate: Date; endDate: Date } {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, month - 1, day);
  const endDate = dayjs(startDate).add(1, 'year').subtract(1, 'day').toDate();
  return { startDate, endDate };
}

export function formatFiscalDateWithYear(date: Date) {
  return dayjs(date).format(formatOptions.monthAndYear);
}

export function formatDateForApi(date: Date | string | number): string {
  return dayjs(date).format(formatOptions.apiDate);
}

export function formatDateWithJurisdiction(
  date: Date,
  countryCode?: string
): string {
  let locale = 'en-US';
  if (countryCode) {
    const country = countries.find((c) => c.code === countryCode);
    if (country && country.locale) {
      locale = country.locale;
    }
  }

  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
      .format(date)
      .replace(/,/g, '');
  } catch {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
      .format(date)
      .replace(/,/g, '');
  }
}

export function shiftDateByDistance(
  newStart: Date,
  oldStart: Date,
  oldEnd: Date
): Date {
  const oldStartD = dayjs(oldStart);
  const oldEndD = dayjs(oldEnd);
  const newStartD = dayjs(newStart);

  const monthsDiff = oldEndD.diff(oldStartD, 'month');
  const oldStartPlusMonths = oldStartD.add(monthsDiff, 'month');
  const daysDiff = oldEndD.diff(oldStartPlusMonths, 'day');

  return newStartD.add(monthsDiff, 'month').add(daysDiff, 'day').toDate();
}

export function isValidFiscalYearDuration(start: Date, end: Date): boolean {
  const startD = dayjs(start);
  const endD = dayjs(end);

  const oneMonthLater = startD.add(1, 'month').subtract(1, 'day');
  const twentyThreeMonthsLater = startD.add(23, 'month');

  return (
    !endD.isBefore(oneMonthLater, 'day') &&
    !endD.isAfter(twentyThreeMonthsLater, 'day')
  );
}

export function getDurationInMonths(start: Date, end: Date): number {
  return Math.round(dayjs(end).add(1, 'day').diff(dayjs(start), 'month', true));
}

function isValidDate(date: Date | string | number) {
  return dayjs(date).isValid();
}

function isNotInThePast(date: Date | string | number) {
  return dayjs(date).isAfter(dayjs());
}

function isNotInTheFuture(date: Date | string | number) {
  return dayjs(date).isBefore(dayjs());
}

const dateUtils = Object.freeze({
  isValidDate,
  isNotInThePast,
  isNotInTheFuture,
  formatFiscalDate,
  getFiscalYearDateRange,
  formatFiscalDateWithYear,
  formatDateForApi,
  formatDateWithJurisdiction,
  shiftDateByDistance,
  isValidFiscalYearDuration,
  getDurationInMonths,
});

export default dateUtils;
