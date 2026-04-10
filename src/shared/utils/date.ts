import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

export const formatOptions = Object.freeze({
  monthAndDayOnly: 'MMMM Do'
});

export function formatFiscalDate(month: number, day: number) {
  // Use a fixed leap year (2024) to support February 29th
  return dayjs().year(2024).month(month - 1).date(day).format(formatOptions.monthAndDayOnly);
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
});

export default dateUtils;
