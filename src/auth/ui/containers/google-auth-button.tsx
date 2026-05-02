import useGoogleOAuth from '@/auth/hooks/use-google-oauth';
import { Button } from '@/shared/ui/button';
import { GoogleIcon } from '@/shared/ui/icons/google';
import { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

export function GoogleAuthButton({ ...props }: ComponentProps<typeof Button>) {
  const { t } = useTranslation();
  const { mutate } = useGoogleOAuth();

  const continue_with_google_text = t('auth:continue_with_google_text');

  return (
    <Button variant="outline" type="button" {...props} onClick={() => mutate()}>
      <GoogleIcon />
      {continue_with_google_text}
    </Button>
  );
}
