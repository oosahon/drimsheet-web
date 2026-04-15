import useGoogleOAuth from '@/auth/hooks/use-google-oauth';
import { GoogleIcon } from '@/shared/icons/google';
import { Button } from '@/shared/ui/button';
import { type ComponentProps } from 'react';

export function GoogleAuthButton({
  children,
  ...props
}: ComponentProps<typeof Button>) {
  const { mutate } = useGoogleOAuth();

  return (
    <Button variant="outline" type="button" {...props} onClick={() => mutate()}>
      <GoogleIcon />
      {children}
    </Button>
  );
}
