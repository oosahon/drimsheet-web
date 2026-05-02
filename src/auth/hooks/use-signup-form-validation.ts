import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export default function useSignupFormValidation() {
  const { t } = useTranslation('auth');

  const first_name_required_text = t('first_name_required_text');
  const last_name_required_text = t('last_name_required_text');
  const valid_email_text = t('valid_email_text');
  const email_required_text = t('email_required_text');
  const password_min_length_text = t('password_min_length_text');
  const password_number_text = t('password_number_text');
  const password_special_character_text = t('password_special_character_text');
  const password_required_text = t('password_required_text');

  return useMemo(
    () =>
      yup.object({
        firstName: yup.string().required(first_name_required_text),
        lastName: yup.string().required(last_name_required_text),
        email: yup
          .string()
          .email(valid_email_text)
          .required(email_required_text),
        password: yup
          .string()
          .min(8, password_min_length_text)
          .matches(/(?=.*[0-9])/, password_number_text)
          .matches(/(?=.*[^A-Za-z0-9])/, password_special_character_text)
          .required(password_required_text),
      }),
    [
      first_name_required_text,
      last_name_required_text,
      valid_email_text,
      email_required_text,
      password_min_length_text,
      password_number_text,
      password_special_character_text,
      password_required_text,
    ]
  );
}
