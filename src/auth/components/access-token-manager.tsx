import authService from '@/auth/services/auth.service';
import FullPageLoader from '@/shared/ui/full-page-loader';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';

export default function AccessTokenManager({ children }: PropsWithChildren) {
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
