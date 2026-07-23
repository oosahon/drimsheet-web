import { authService } from '@/auth/lib/auth.service';
import { FullPageLoader } from '@/shared/components/full-page-loader';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';

export function AccessTokenManagerContainer({
  children,
}: Readonly<PropsWithChildren>) {
  const [isInitializing, setIsInitializing] = useState(true);

  const hasInitialized = useRef(false);

  useEffect(() => {
    const initialize = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      await authService.init();
      setIsInitializing(false);
    };

    initialize();
  }, []);

  if (isInitializing) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}
