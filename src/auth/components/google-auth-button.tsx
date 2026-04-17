import useGoogleOAuth from '@/auth/hooks/use-google-oauth';
import { GoogleIcon } from '@/shared/icons/google';
import { Button } from '@/shared/ui/button';
import { type ComponentProps } from 'react';

export function GoogleAuthButton({ ...props }: ComponentProps<typeof Button>) {
  const { mutate } = useGoogleOAuth();

  return (
    <Button variant="outline" type="button" {...props} onClick={() => mutate()}>
      <GoogleIcon />
      Continue with Google
    </Button>
  );
}
