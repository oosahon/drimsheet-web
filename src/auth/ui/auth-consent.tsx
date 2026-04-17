import { FieldDescription } from '@/shared/ui/field';

interface IAuthConsentProps {
  actionText?: string;
}

export function AuthConsent({
  actionText = 'creating an account',
}: IAuthConsentProps) {
  const consentText = `By ${actionText}, you agree to our`;
  return (
    <FieldDescription className="px-6 text-center text-xs">
      {consentText}{' '}
      <a href="/terms-of-service" className="text-xs hover:text-purple-500">
        Terms of Service
      </a>{' '}
      and{' '}
      <a href="/privacy-policy" className="text-xs hover:text-purple-500">
        Privacy Policy
      </a>
      .
    </FieldDescription>
  );
}
