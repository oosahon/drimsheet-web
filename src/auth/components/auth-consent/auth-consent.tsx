import { FieldDescription } from '@/shared/components/field';
import { useTranslation } from 'react-i18next';

interface IAuthConsentProps {
  actionText?: string;
}

export function AuthConsent({
  actionText = 'creating an account',
}: IAuthConsentProps) {
  const { t } = useTranslation(['auth']);

  const consent_text = t('auth:by_action_you_agree_to_our_text', {
    action: actionText,
  });

  const terms_of_service_text = t('terms_of_service_text');
  const and_text = t('and_text');
  const privacy_policy_text = t('privacy_policy_text');

  return (
    <FieldDescription className="px-6 text-center text-xs">
      {consent_text}{' '}
      <a href="/terms-of-service" className="text-xs hover:text-purple-500">
        {terms_of_service_text}
      </a>{' '}
      {and_text}{' '}
      <a href="/privacy-policy" className="text-xs hover:text-purple-500">
        {privacy_policy_text}
      </a>
      .
    </FieldDescription>
  );
}
