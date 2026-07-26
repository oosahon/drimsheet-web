import i18next from 'i18next';
import * as yup from 'yup';

export const currencyExchangeRateInputValidation = yup
  .number()
  .transform((value, originalValue) => {
    if (typeof originalValue === 'string' && originalValue.trim() === '') {
      return undefined;
    }

    return value;
  })
  .typeError(i18next.t('exchange_rate_number_text', { ns: 'shared' }))
  .required(i18next.t('exchange_rate_required_text', { ns: 'shared' }))
  .moreThan(0, i18next.t('exchange_rate_positive_text', { ns: 'shared' }));
