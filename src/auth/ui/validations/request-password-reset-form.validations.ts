import * as yup from 'yup';

export const requestPasswordResetFormValidation = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
});
