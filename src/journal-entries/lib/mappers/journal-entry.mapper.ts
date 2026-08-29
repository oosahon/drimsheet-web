import type { IInflowFormValues } from '@/journal-entries/components/inflow-form';
import type {
  IExchangeRateDto,
  IJournalCounterpartyReq,
  IReceiptEntryLineReq,
  IReceiptEntryReq,
} from '@/shared/lib/api/Api';
import { currencyMapper } from '@/shared/lib/mappers/currency.mapper';
import { moneyMapper } from '@/shared/lib/mappers/money.mapper';

function toJournalCounterpartyReq(
  payer: IInflowFormValues['payer']
): IJournalCounterpartyReq {
  const counterparty: IJournalCounterpartyReq = {
    name: payer.name,
  };

  if (payer.id !== undefined) counterparty.id = payer.id;
  if (payer.type !== undefined) counterparty.type = payer.type;

  return counterparty;
}

function toReceiptLine(
  accountId: string,
  amount: IInflowFormValues['amount'],
  payer: IInflowFormValues['payer'],
  exchangeRate: IExchangeRateDto | null,
  description: string | null,
  sequenceOrder: number
): IReceiptEntryLineReq {
  return {
    accountId,
    counterparty: toJournalCounterpartyReq(payer),
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
  values: IInflowFormValues,
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
          values.payer,
          exchangeRate,
          item.description.trim() || null,
          index + 1
        )
      )
    : [
        toReceiptLine(
          values.sourceAccountId,
          values.amount,
          values.payer,
          exchangeRate,
          description,
          1
        ),
      ];

  return {
    attachmentReferences: attachmentReferences.map((reference) => reference),
    sourceLines,
    destinationLine: toReceiptLine(
      values.destinationAccountId,
      values.amount,
      values.payer,
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
