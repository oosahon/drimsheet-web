import { GoogleAuthButton } from '@/auth/components/google-auth-button';
import { useGoogleOAuth } from '@/auth/hooks/use-google-oauth';
import { Button } from '@/shared/components/button';
import { type ComponentProps } from 'react';

export function GoogleAuthButtonContainer({
  ...props
}: Readonly<ComponentProps<typeof Button>>) {
  const { mutate } = useGoogleOAuth();

  return <GoogleAuthButton {...props} onClick={() => mutate()} />;
}
