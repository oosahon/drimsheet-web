import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export default function usePettyCashAccountFormValidation() {
  const { t } = useTranslation();

  const account_name_required_text = t(
    'ledger-accounts:account_name_required_text'
  );
  const account_name_min_length_text = t(
    'ledger-accounts:account_name_min_length_text'
  );
  const account_name_max_length_text = t(
    'ledger-accounts:account_name_max_length_text'
  );
  const currency_required_text = t('ledger-accounts:currency_required_text');
  const opening_balance_required_text = t(
    'ledger-accounts:opening_balance_required_text'
  );
  const opening_balance_negative_text = t(
    'ledger-accounts:opening_balance_negative_text'
  );

  return useMemo(
    () =>
      yup.object({
        name: yup
          .string()
          .required(account_name_required_text)
          .min(3, account_name_min_length_text)
          .max(100, account_name_max_length_text),
        currencyCode: yup.string().required(currency_required_text),
        openingBalance: yup
          .number()
          .required(opening_balance_required_text)
          .min(0, opening_balance_negative_text),
      }),
    [
      account_name_required_text,
      account_name_min_length_text,
      account_name_max_length_text,
      currency_required_text,
      opening_balance_required_text,
      opening_balance_negative_text,
    ]
  );
}
