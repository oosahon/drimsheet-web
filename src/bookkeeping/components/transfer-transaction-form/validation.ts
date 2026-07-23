import type { IMoneyDto } from '@/shared/lib/api/Api';
import { dateUtils } from '@/shared/lib/date';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export function useTransferTransactionFormValidation() {
  const { t } = useTranslation<'bookkeeping'>('bookkeeping');

  const source_account_required_text = t('source_account_required_text');
  const destination_account_required_text = t(
    'destination_account_required_text'
  );
  const destination_account_different_text = t(
    'destination_account_different_text'
  );
  const amount_required_text = t('amount_required_text');
  const amount_positive_text = t('amount_positive_text');
  const transfer_amounts_must_match_text = t(
    'transfer_amounts_must_match_text'
  );
  const date_cannot_be_future_text = t('date_cannot_be_future_text');

  return useMemo(
    () =>
      yup.object({
        sourceAccountId: yup.string().required(source_account_required_text),
        destinationAccountId: yup
          .string()
          .required(destination_account_required_text)
          .test(
            'different-account',
            destination_account_different_text,
            function (value) {
              const { sourceAccountId } = this.parent;

              if (!value || !sourceAccountId) return true;

              return value !== sourceAccountId;
            }
          ),
        amount: yup
          .mixed<IMoneyDto>()
          .required(amount_required_text)
          .test('positive-amount', amount_positive_text, (value) => {
            return Number(value?.amount) > 0;
          }),
        amountReceived: yup
          .mixed<IMoneyDto>()
          .optional()
          .test(
            'matches-transfer-amount',
            transfer_amounts_must_match_text,
            function (value) {
              const { amount } = this.parent;
              const amountNumber = Number(amount?.amount);

              if (
                amount === undefined ||
                Number.isNaN(amountNumber) ||
                amountNumber <= 0
              ) {
                return true;
              }

              if (value === undefined) return false;

              return amountNumber === Number(value.amount);
            }
          ),
        date: yup
          .string()
          .optional()
          .test('not-in-future', date_cannot_be_future_text, (value) => {
            if (!value) return true;

            return dateUtils.isNotInTheFuture(value);
          }),
        pending: yup.boolean().optional(),
        description: yup.string().optional(),
      }),
    [
      source_account_required_text,
      destination_account_required_text,
      destination_account_different_text,
      amount_required_text,
      amount_positive_text,
      transfer_amounts_must_match_text,
      date_cannot_be_future_text,
    ]
  );
}
