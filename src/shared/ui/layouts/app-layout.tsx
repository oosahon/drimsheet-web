import OnboardingManager from '@/onboarding/ui/containers/onboarding-manager.container';
import { AppSidebar } from '@/shared/ui/components/app';
import { SidebarInset, SidebarProvider } from '@/shared/ui/components/sidebar';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
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
