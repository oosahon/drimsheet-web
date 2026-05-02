import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export default function useLoginFormValidation() {
  const { t } = useTranslation();

  const valid_email_text = t('auth:valid_email_text');
  const email_required_text = t('auth:email_required_text');
  const password_required_text = t('auth:password_required_text');

  return useMemo(
    () =>
      yup.object({
        email: yup
          .string()
          .email(valid_email_text)
          .required(email_required_text),
        password: yup.string().required(password_required_text),
      }),
    [valid_email_text, email_required_text, password_required_text]
  );
}
