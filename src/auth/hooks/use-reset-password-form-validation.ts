import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export default function useResetPasswordFormValidation() {
  const { t } = useTranslation();

  const password_min_length_text = t('auth:password_min_length_text');
  const password_number_text = t('auth:password_number_text');
  const password_special_character_text = t(
    'auth:password_special_character_text'
  );
  const password_required_text = t('auth:password_required_text');
  const passwords_match_text = t('auth:passwords_match_text');
  const confirm_password_required_text = t(
    'auth:confirm_password_required_text'
  );

  return useMemo(
    () =>
      yup.object({
        password: yup
          .string()
          .min(8, password_min_length_text)
          .matches(/(?=.*[0-9])/, password_number_text)
          .matches(/(?=.*[^A-Za-z0-9])/, password_special_character_text)
          .required(password_required_text),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password')], passwords_match_text)
          .required(confirm_password_required_text),
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
