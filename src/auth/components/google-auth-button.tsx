import { GoogleIcon } from '@/shared/icons/google';
import { Button } from '@/shared/ui/button';
import { type ComponentProps } from 'react';

export function GoogleAuthButton({
  children,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button variant="outline" type="button" {...props}>
      <GoogleIcon />
      {children}
    </Button>
  );
}
