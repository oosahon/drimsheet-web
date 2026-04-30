import * as yup from 'yup';

export const pettyCashAccountFormValidation = yup.object({
  name: yup
    .string()
    .required('Account name is required')
    .min(3, 'Account name must be at least 3 characters')
    .max(100, 'Account name must not exceed 100 characters'),
  currencyCode: yup.string().required('Currency is required'),
  openingBalance: yup
    .number()
    .required('Opening balance is required')
    .min(0, 'Opening balance cannot be negative'),
});
