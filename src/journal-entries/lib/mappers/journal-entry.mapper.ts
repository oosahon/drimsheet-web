import type {
  ICashTransactionCurrencyContext,
  ICashTransactionFormValues,
} from '@/journal-entries/components/cash-transaction-form';
import {
  EExchangeRateType,
  type IExchangeRateDto,
  type IExchangeRateQueryParam,
  type IJournalCounterpartyReq,
  type IPaymentEntryLineReq,
  type IPaymentEntryReq,
  type IReceiptEntryLineReq,
  type IReceiptEntryReq,
} from '@/shared/lib/api/Api';
import { currencyMapper } from '@/shared/lib/mappers/currency.mapper';
import { moneyMapper } from '@/shared/lib/mappers/money.mapper';

interface IJournalEntryLineMappingInput {
  accountId: string;
  amount: ICashTransactionFormValues['amount'];
  counterparty: ICashTransactionFormValues['counterparty'];
  exchangeRate: IExchangeRateDto | null;
  description: string | null;
  sequenceOrder: number;
}

function toExchangeRateQuery(
  currencyContext: ICashTransactionCurrencyContext | undefined,
  functionalCurrencyCode: string
): IExchangeRateQueryParam | undefined {
  if (
    !currencyContext?.currencyCode ||
    !currencyContext.date ||
    !functionalCurrencyCode ||
    currencyContext.currencyCode === functionalCurrencyCode
  ) {
    return undefined;
  }

  return {
    currencyPair: `${currencyContext.currencyCode}/${functionalCurrencyCode}`,
    type: EExchangeRateType.Official,
    asOf: currencyContext.date,
    limit: 1,
  };
}

function toJournalCounterpartyReq(
  value: ICashTransactionFormValues['counterparty']
): IJournalCounterpartyReq {
  const counterparty: IJournalCounterpartyReq = {
    name: value.name,
  };

  if (value.id !== undefined) counterparty.id = value.id;
  if (value.type !== undefined) counterparty.type = value.type;

  return counterparty;
}

function toJournalEntryLineReq({
  accountId,
  amount,
  counterparty,
  exchangeRate,
  description,
  sequenceOrder,
}: IJournalEntryLineMappingInput): IPaymentEntryLineReq & IReceiptEntryLineReq {
  return {
    accountId,
    counterparty: toJournalCounterpartyReq(counterparty),
    amount: moneyMapper.toMoneyDto(
      amount.amount,
      amount.currencyCode,
      amount.isMinorUnit
    ),
    exchangeRate,
    description,
    sequenceOrder,
  };
}

function toPaymentEntryReq(
  values: ICashTransactionFormValues,
  functionalCurrencyCode: string,
  occurredAt: string,
  attachmentReferences: string[] = []
): IPaymentEntryReq {
  const currencyCode = values.amount.currencyCode;
  const description = values.description.trim() || null;
  let exchangeRate: IExchangeRateDto | null = null;

  if (currencyCode !== functionalCurrencyCode) {
    exchangeRate = currencyMapper.toUserEnteredExchangeRate({
      baseCurrencyCode: currencyCode,
      targetCurrencyCode: functionalCurrencyCode,
      rate: Number(values.exchangeRate),
      asOf: values.date,
    });
  }

  const destinationLines = values.isItemized
    ? values.items.map((item, index) =>
        toJournalEntryLineReq({
          accountId: item.accountId,
          amount: item.amount,
          counterparty: values.counterparty,
          exchangeRate,
          description: item.description.trim() || null,
          sequenceOrder: index + 2,
        })
      )
    : [
        toJournalEntryLineReq({
          accountId: values.categoryId,
          amount: values.amount,
          counterparty: values.counterparty,
          exchangeRate,
          description,
          sequenceOrder: 2,
        }),
      ];

  return {
    attachmentReferences: attachmentReferences.map((reference) => reference),
    sourceLine: toJournalEntryLineReq({
      accountId: values.accountId,
      amount: values.amount,
      counterparty: values.counterparty,
      exchangeRate,
      description,
      sequenceOrder: 1,
    }),
    destinationLines,
    effectiveDate: values.date,
    postedAt: occurredAt,
    memo: description,
  };
}

function toReceiptEntryReq(
  values: ICashTransactionFormValues,
  functionalCurrencyCode: string,
  occurredAt: string,
  attachmentReferences: string[] = []
): IReceiptEntryReq {
  const currencyCode = values.amount.currencyCode;
  const description = values.description.trim() || null;
  let exchangeRate: IExchangeRateDto | null = null;

  if (currencyCode !== functionalCurrencyCode) {
    exchangeRate = currencyMapper.toUserEnteredExchangeRate({
      baseCurrencyCode: currencyCode,
      targetCurrencyCode: functionalCurrencyCode,
      rate: Number(values.exchangeRate),
      asOf: values.date,
    });
  }

  const sourceLines = values.isItemized
    ? values.items.map((item, index) =>
        toJournalEntryLineReq({
          accountId: item.accountId,
          amount: item.amount,
          counterparty: values.counterparty,
          exchangeRate,
          description: item.description.trim() || null,
          sequenceOrder: index + 1,
        })
      )
    : [
        toJournalEntryLineReq({
          accountId: values.categoryId,
          amount: values.amount,
          counterparty: values.counterparty,
          exchangeRate,
          description,
          sequenceOrder: 1,
        }),
      ];

  return {
    attachmentReferences: attachmentReferences.map((reference) => reference),
    sourceLines,
    destinationLine: toJournalEntryLineReq({
      accountId: values.accountId,
      amount: values.amount,
      counterparty: values.counterparty,
      exchangeRate,
      description,
      sequenceOrder: sourceLines.length + 1,
    }),
    effectiveDate: values.date,
    postedAt: occurredAt,
    memo: description,
  };
}

export const journalEntryMapper = Object.freeze({
  toExchangeRateQuery,
  toPaymentEntryReq,
  toReceiptEntryReq,
});
