import type { IItemizedFieldValue } from '@/journal-entries/components/itemized-fields';
import type {
  IExchangeRate,
  IJournalCounterpartyReq,
  ILedgerAccountDto,
} from '@/shared/lib/api/Api';
import { dateUtils } from '@/shared/lib/utils/date';
import type { IInflowFormInitialValues, IInflowFormValues } from './types';

/**
 * Creates complete Formik values from optional inflow defaults, preferring the
 * selected destination account's currency when one can be resolved.
 */
function createInitialValues(
  initialValues: IInflowFormInitialValues | undefined,
  destinationAccounts: ILedgerAccountDto[],
  functionalCurrencyCode: string
): IInflowFormValues {
  const selectedAccountCurrency = destinationAccounts.find(
    (account) => account.id === initialValues?.destinationAccountId
  )?.balance.currencyCode;

  return {
    destinationAccountId: initialValues?.destinationAccountId ?? '',
    sourceAccountId: initialValues?.sourceAccountId ?? '',
    amount: {
      amount: initialValues?.amount?.amount ?? Number.NaN,
      currencyCode:
        selectedAccountCurrency ??
        initialValues?.amount?.currencyCode ??
        functionalCurrencyCode,
      isMinorUnit: initialValues?.amount?.isMinorUnit ?? false,
    },
    date: initialValues?.date ?? dateUtils.formatDateForApi(new Date()),
    exchangeRate: initialValues?.exchangeRate ?? '',
    isItemized: initialValues?.isItemized ?? false,
    items: (initialValues?.items ?? []).map((item) => ({
      id: item.id,
      amount: {
        amount: item.amount.amount,
        currencyCode: selectedAccountCurrency ?? item.amount.currencyCode,
        isMinorUnit: item.amount.isMinorUnit,
      },
      accountId: item.accountId,
      description: item.description,
    })),
    payer: {
      id: initialValues?.payer?.id,
      name: initialValues?.payer?.name ?? '',
      type: initialValues?.payer?.type,
    },
    description: initialValues?.description ?? '',
    receipt: initialValues?.receipt ?? null,
  };
}

/**
 * Applies a destination-account change to the form values, propagating its
 * currency to the transaction and itemized rows and clearing an unneeded rate.
 */
function updateAccount(
  values: IInflowFormValues,
  destinationAccountId: string,
  currencyCode: string,
  functionalCurrencyCode: string
): IInflowFormValues {
  return {
    destinationAccountId,
    sourceAccountId: values.sourceAccountId,
    amount: {
      amount: values.amount.amount,
      currencyCode,
      isMinorUnit: values.amount.isMinorUnit,
    },
    date: values.date,
    exchangeRate: isExchangeRateRequired(currencyCode, functionalCurrencyCode)
      ? values.exchangeRate
      : '',
    isItemized: values.isItemized,
    items: values.items.map((item) => ({
      id: item.id,
      amount: {
        amount: item.amount.amount,
        currencyCode,
        isMinorUnit: item.amount.isMinorUnit,
      },
      accountId: item.accountId,
      description: item.description,
    })),
    payer: values.payer,
    description: values.description,
    receipt: values.receipt,
  };
}

/**
 * Creates a blank itemized transaction row, optionally seeded with the current
 * single-entry amount and category.
 */
function createItem(
  id: string,
  currencyCode: string,
  amount = Number.NaN,
  accountId = ''
): IItemizedFieldValue {
  return {
    id,
    amount: {
      amount,
      currencyCode,
      isMinorUnit: false,
    },
    accountId,
    description: '',
  };
}

/**
 * Totals finite item amounts and rounds the result to avoid common
 * floating-point artifacts while incomplete amounts contribute zero.
 */
function getItemTotal(items: IItemizedFieldValue[]) {
  const total = items.reduce((sum, item) => {
    if (!Number.isFinite(item.amount.amount)) return sum;

    return sum + item.amount.amount;
  }, 0);

  return Math.round((total + Number.EPSILON) * 1_000_000) / 1_000_000;
}

/**
 * Determines whether a transaction requires conversion into the functional
 * currency, returning false when either currency is unavailable.
 */
function isExchangeRateRequired(
  sourceCurrencyCode: string | null | undefined,
  functionalCurrencyCode: string | null | undefined
) {
  return Boolean(
    sourceCurrencyCode &&
    functionalCurrencyCode &&
    sourceCurrencyCode !== functionalCurrencyCode
  );
}

/**
 * Checks whether an official rate matches the selected currency pair and the
 * transaction date.
 */
function matchesOfficialRate(
  officialRate: IExchangeRate | undefined,
  baseCurrencyCode: string,
  targetCurrencyCode: string,
  date: string
) {
  return Boolean(
    officialRate?.baseCurrencyCode === baseCurrencyCode &&
    officialRate.targetCurrencyCode === targetCurrencyCode &&
    officialRate.asOf.slice(0, 10) === date
  );
}

/**
 * Produces submission-ready form values by trimming text, deriving itemized
 * totals, and resolving the applicable manual or official exchange rate.
 */
function normalizeValues(
  values: IInflowFormValues,
  exchangeRateRequired: boolean,
  officialRate?: number
): IInflowFormValues {
  const payer: IJournalCounterpartyReq = {
    name: values.payer.name.trim(),
  };

  if (values.payer.id !== undefined) payer.id = values.payer.id;
  if (values.payer.type !== undefined) payer.type = values.payer.type;

  const amount = values.isItemized
    ? getItemTotal(values.items)
    : values.amount.amount;
  let exchangeRate = '';

  if (exchangeRateRequired) {
    exchangeRate = values.exchangeRate.trim();
    if (!exchangeRate && officialRate !== undefined) {
      exchangeRate = String(officialRate);
    }
  }

  return {
    destinationAccountId: values.destinationAccountId,
    sourceAccountId: values.sourceAccountId,
    amount: {
      amount,
      currencyCode: values.amount.currencyCode,
      isMinorUnit: values.amount.isMinorUnit,
    },
    date: values.date,
    exchangeRate,
    isItemized: values.isItemized,
    items: values.items.map((item) => ({
      id: item.id,
      amount: {
        amount: item.amount.amount,
        currencyCode: item.amount.currencyCode,
        isMinorUnit: item.amount.isMinorUnit,
      },
      accountId: item.accountId,
      description: item.description.trim(),
    })),
    payer,
    description: values.description.trim(),
    receipt: values.receipt,
  };
}

/**
 * Resolves the selected destination account's balance currency, returning an
 * empty string when the account is not found.
 */
function getDestinationCurrencyCode(
  destinationAccounts: ILedgerAccountDto[],
  destinationAccountId: string
) {
  return (
    destinationAccounts.find((account) => account.id === destinationAccountId)
      ?.balance.currencyCode ?? ''
  );
}

const inflowFormHelpers = Object.freeze({
  createInitialValues,
  createItem,
  getItemTotal,
  isExchangeRateRequired,
  matchesOfficialRate,
  normalizeValues,
  updateAccount,
  getDestinationCurrencyCode,
});

export default inflowFormHelpers;
