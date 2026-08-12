import type { IInflowFormValues } from '@/journal-entries/components/inflow-form';
import type {
  IExchangeRateDto,
  IJournalCounterpartyReq,
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

function toReceiptEntryReq(
  values: IInflowFormValues,
  functionalCurrencyCode: string,
  occurredAt: string
): IReceiptEntryReq {
  const currencyCode = values.amount.currencyCode;
  const description = values.description.trim() || null;
  let exchangeRate: IExchangeRateDto | null = null;

  if (currencyCode !== functionalCurrencyCode) {
    exchangeRate = currencyMapper.toUserEnteredExchangeRate({
      baseCurrencyCode: currencyCode,
      targetCurrencyCode: functionalCurrencyCode,
      rate: Number(values.exchangeRate),
      asOf: occurredAt,
    });
  }

  return {
    sourceLine: {
      accountId: values.categoryAccountId,
      counterparty: toJournalCounterpartyReq(values.payer),
      amount: moneyMapper.toMoneyDto(
        values.amount.amount,
        currencyCode,
        values.amount.isMinorUnit
      ),
      exchangeRate,
      description,
      sequenceOrder: 1,
    },
    destinationLines: [
      {
        accountId: values.destinationAccountId,
        counterparty: toJournalCounterpartyReq(values.payer),
        amount: moneyMapper.toMoneyDto(
          values.amount.amount,
          currencyCode,
          values.amount.isMinorUnit
        ),
        exchangeRate,
        description,
        sequenceOrder: 2,
      },
    ],
    effectiveDate: occurredAt,
    postedAt: occurredAt,
    memo: description,
  };
}

export const journalEntryMapper = Object.freeze({
  toReceiptEntryReq,
});
