import { AppSidebar } from '@/_app/components/app-sidebar';
import { LogoutConfirmationDialog } from '@/auth/dialogs/logout-confirmation';
import { OnboardingManagerContainer } from '@/onboarding/components/onboarding-manager';
import { SidebarInset, SidebarProvider } from '@/shared/components/sidebar';
import { NavUserContainer } from '@/user/components/nav-user';
import type { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const logoutRender = (trigger: ReactNode) => (
  <LogoutConfirmationDialog>{trigger}</LogoutConfirmationDialog>
);

export function AppLayout() {
  const { pathname } = useLocation();

  return (
    <>
      <SidebarProvider>
        <AppSidebar
          currentPath={pathname}
          footer={<NavUserContainer logoutDialog={logoutRender} />}
        />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mb-8 min-w-full">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <OnboardingManagerContainer />
    </>
  );
}
