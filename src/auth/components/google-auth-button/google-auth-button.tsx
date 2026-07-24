import { Button } from '@/shared/components/button';
import { GoogleIcon } from '@/shared/components/icons/google';
import { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

export function GoogleAuthButton({
  onClick,
  ...props
}: Readonly<ComponentProps<typeof Button>>) {
  const { t } = useTranslation('auth');

  const continue_with_google_text = t('continue_with_google_text');

  return (
    <Button variant="outline" type="button" {...props} onClick={onClick}>
      <GoogleIcon />
      {continue_with_google_text}
    </Button>
  );
}
