import type {
  ICashTransactionCurrencyContext,
  ICashTransactionFormValues,
} from '@/journal-entries/components/cash-transaction-form';
import type {
  ICashTransferCurrencyContext,
  ICashTransferFormValues,
} from '@/journal-entries/components/cash-transfer-form';
import {
  EExchangeRateType,
  type IExchangeRateDto,
  type IExchangeRateQueryParam,
  type IJournalCounterpartyReq,
  type IJournalLineReq,
  type IPaymentEntryLineReq,
  type IPaymentEntryReq,
  type IReceiptEntryLineReq,
  type IReceiptEntryReq,
  type ITransferEntryLineReq,
  type ITransferEntryReq,
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

function toTransferExchangeRateQuery(
  currencyContext: ICashTransferCurrencyContext | undefined
): IExchangeRateQueryParam | undefined {
  if (
    !currencyContext?.sourceCurrencyCode ||
    !currencyContext.destinationCurrencyCode ||
    !currencyContext.date ||
    currencyContext.sourceCurrencyCode ===
      currencyContext.destinationCurrencyCode
  ) {
    return undefined;
  }

  return {
    currencyPair: `${currencyContext.sourceCurrencyCode}/${currencyContext.destinationCurrencyCode}`,
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

function toTransferEntryLineReq(
  accountId: string,
  amount: ICashTransferFormValues['amountSent'],
  exchangeRate: IExchangeRateDto | null,
  description: string | null,
  sequenceOrder: number
): ITransferEntryLineReq {
  return {
    accountId,
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

function toTransferChargeLineReq(
  item: ICashTransferFormValues['items'][number],
  exchangeRate: IExchangeRateDto | null,
  sequenceOrder: number
): IJournalLineReq {
  return {
    accountId: item.accountId,
    counterparty: null,
    amount: moneyMapper.toMoneyDto(
      item.amount.amount,
      item.amount.currencyCode,
      item.amount.isMinorUnit
    ),
    exchangeRate,
    description: item.description.trim() || null,
    sequenceOrder,
  };
}

function toTransferEntryReq(
  values: ICashTransferFormValues,
  functionalCurrencyCode: string,
  occurredAt: string,
  attachmentReferences: string[] = []
): ITransferEntryReq {
  const sourceCurrencyCode = values.amountSent.currencyCode;
  const destinationCurrencyCode = values.amountReceived.currencyCode;
  const description = values.description.trim() || null;
  let sourceExchangeRate: IExchangeRateDto | null = null;
  let destinationExchangeRate: IExchangeRateDto | null = null;

  if (
    sourceCurrencyCode !== destinationCurrencyCode &&
    destinationCurrencyCode === functionalCurrencyCode
  ) {
    sourceExchangeRate = currencyMapper.toUserEnteredExchangeRate({
      baseCurrencyCode: sourceCurrencyCode,
      targetCurrencyCode: functionalCurrencyCode,
      rate: Number(values.exchangeRate),
      asOf: values.date,
    });
  }

  if (
    sourceCurrencyCode !== destinationCurrencyCode &&
    sourceCurrencyCode === functionalCurrencyCode
  ) {
    destinationExchangeRate = currencyMapper.toUserEnteredExchangeRate({
      baseCurrencyCode: destinationCurrencyCode,
      targetCurrencyCode: functionalCurrencyCode,
      rate: 1 / Number(values.exchangeRate),
      asOf: values.date,
    });
  }

  const chargeLines = values.isItemized
    ? values.items.map((item, index) =>
        toTransferChargeLineReq(item, destinationExchangeRate, index + 3)
      )
    : [];

  return {
    attachmentReferences: attachmentReferences.map((reference) => reference),
    sourceLine: toTransferEntryLineReq(
      values.sourceAccountId,
      values.amountSent,
      sourceExchangeRate,
      description,
      1
    ),
    destinationLine: toTransferEntryLineReq(
      values.destinationAccountId,
      values.amountReceived,
      destinationExchangeRate,
      description,
      2
    ),
    chargeLines,
    effectiveDate: values.date,
    postedAt: occurredAt,
    memo: description,
  };
}

export const journalEntryMapper = Object.freeze({
  toExchangeRateQuery,
  toPaymentEntryReq,
  toReceiptEntryReq,
  toTransferExchangeRateQuery,
  toTransferEntryReq,
});
