import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export function useRequestPasswordResetFormValidation() {
  const { t } = useTranslation('auth');

  const valid_email_text = t('valid_email_text');
  const email_required_text = t('email_required_text');

  return useMemo(
    () =>
      yup.object({
        email: yup
          .string()
          .email(valid_email_text)
          .required(email_required_text),
      }),
    [valid_email_text, email_required_text]
  );
}
