import type { ICashTransactionFormValues } from '@/journal-entries/components/cash-transaction-form';
import type {
  IExchangeRateDto,
  IJournalCounterpartyReq,
  IReceiptEntryLineReq,
  IReceiptEntryReq,
} from '@/shared/lib/api/Api';
import { currencyMapper } from '@/shared/lib/mappers/currency.mapper';
import { moneyMapper } from '@/shared/lib/mappers/money.mapper';

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

function toReceiptLine(
  accountId: string,
  amount: ICashTransactionFormValues['amount'],
  counterparty: ICashTransactionFormValues['counterparty'],
  exchangeRate: IExchangeRateDto | null,
  description: string | null,
  sequenceOrder: number
): IReceiptEntryLineReq {
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
        toReceiptLine(
          item.accountId,
          item.amount,
          values.counterparty,
          exchangeRate,
          item.description.trim() || null,
          index + 1
        )
      )
    : [
        toReceiptLine(
          values.categoryId,
          values.amount,
          values.counterparty,
          exchangeRate,
          description,
          1
        ),
      ];

  return {
    attachmentReferences: attachmentReferences.map((reference) => reference),
    sourceLines,
    destinationLine: toReceiptLine(
      values.accountId,
      values.amount,
      values.counterparty,
      exchangeRate,
      description,
      sourceLines.length + 1
    ),
    effectiveDate: values.date,
    postedAt: occurredAt,
    memo: description,
  };
}

export const journalEntryMapper = Object.freeze({
  toReceiptEntryReq,
});
