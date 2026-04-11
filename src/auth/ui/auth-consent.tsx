import { FieldDescription } from '@/shared/ui/field';

interface IAuthConsentProps {
  actionText?: string;
}

export function AuthConsent({
  actionText = 'clicking continue',
}: IAuthConsentProps) {
  return (
    <FieldDescription className="px-6 text-center text-xs">
      By {actionText}, you agree to our{' '}
      <a
        href="https://purpleledger.com/terms-of-service"
        className="text-xs hover:text-purple-500"
      >
        Terms of Service
      </a>{' '}
      and{' '}
      <a
        href="https://purpleledger.com/privacy-policy"
        className="text-xs hover:text-purple-500"
      >
        Privacy Policy
      </a>
      .
    </FieldDescription>
  );
}
