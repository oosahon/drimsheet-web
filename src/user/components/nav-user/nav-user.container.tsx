import { useSidebar } from '@/shared/hooks/use-sidebar';
import useProfile from '@/user/hooks/use-profile';
import type { ReactNode } from 'react';
import { NavUser } from './nav-user';

interface NavUserContainerProps {
  logoutDialog?: (trigger: ReactNode) => ReactNode;
}

export function NavUserContainer({ logoutDialog }: NavUserContainerProps) {
  const { data: user, isLoading } = useProfile();
  const { isMobile } = useSidebar();

  return (
    <NavUser
      user={user}
      isLoading={isLoading}
      isMobile={isMobile}
      logoutDialog={logoutDialog}
    />
  );
}
