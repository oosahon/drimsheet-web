import * as yup from 'yup';

export const currencyExchangeRateInputValidation = yup
  .number()
  .transform((value, originalValue) => {
    if (typeof originalValue === 'string' && originalValue.trim() === '') {
      return undefined;
    }

    return value;
  })
  .typeError('Exchange rate must be a number')
  .required('Exchange rate is required')
  .moreThan(0, 'Exchange rate must be greater than zero');
