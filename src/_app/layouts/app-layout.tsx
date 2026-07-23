import { AppSidebar } from '@/_app/components/app-sidebar';
import { LogoutConfirmationDialog } from '@/auth/dialogs/logout-confirmation';
import { OnboardingManager } from '@/onboarding/components/onboarding-manager';
import { SidebarInset, SidebarProvider } from '@/shared/components/sidebar';
import { NavUserContainer } from '@/user/components/nav-user';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar
          footer={
            <NavUserContainer
              logoutDialog={(trigger: ReactNode) => (
                <LogoutConfirmationDialog>{trigger}</LogoutConfirmationDialog>
              )}
            />
          }
        />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mb-8 min-w-full">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <OnboardingManager />
    </>
  );
}
