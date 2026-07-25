import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export function useResetPasswordFormValidation() {
  const { t } = useTranslation('auth');

  const password_min_length_text = t('password_min_length_text');
  const password_number_text = t('password_number_text');
  const password_special_character_text = t('password_special_character_text');
  const password_required_text = t('password_required_text');
  const passwords_match_text = t('passwords_match_text');
  const confirm_password_required_text = t('confirm_password_required_text');

  return useMemo(
    () =>
      yup.object({
        password: yup
          .string()
          .required(password_required_text)
          .min(8, password_min_length_text)
          .matches(/(?=.*[0-9])/, password_number_text)
          .matches(/(?=.*[^A-Za-z0-9])/, password_special_character_text),
        confirmPassword: yup
          .string()
          .required(confirm_password_required_text)
          .oneOf([yup.ref('password')], passwords_match_text),
      }),
    [
      password_min_length_text,
      password_number_text,
      password_special_character_text,
      password_required_text,
      passwords_match_text,
      confirm_password_required_text,
    ]
  );
}
