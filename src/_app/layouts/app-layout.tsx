import { AppSidebar } from '@/_app/components/app-sidebar';
import { LogoutConfirmationDialog } from '@/auth/dialogs/logout-confirmation';
import { OnboardingManagerContainer } from '@/onboarding/components/onboarding-manager';
import { AppHeaderActionsProvider } from '@/shared/components/app';
import { Button } from '@/shared/components/button';
import { SidebarInset, SidebarProvider } from '@/shared/components/sidebar';
import { AccountingEntityAvatarContainer } from '@/user/components/accounting-entity-avatar';
import { BellIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';

export function AppLayout() {
  const { pathname } = useLocation();
  const { t } = useTranslation('user');
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogoutClick = () => setShowLogoutConfirmation(true);

  const notifications_aria_label = t('notifications_aria_label');
  const headerActions = (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        aria-label={notifications_aria_label}
        title={notifications_aria_label}
        disabled
      >
        <BellIcon />
      </Button>
      <AccountingEntityAvatarContainer onLogoutClick={handleLogoutClick} />
    </>
  );

  return (
    <>
      <SidebarProvider>
        <AppSidebar currentPath={pathname} />
        <SidebarInset>
          <AppHeaderActionsProvider actions={headerActions}>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mb-8 min-w-full">
              <Outlet />
            </div>
          </AppHeaderActionsProvider>
        </SidebarInset>
      </SidebarProvider>
      <OnboardingManagerContainer />
      <LogoutConfirmationDialog
        open={showLogoutConfirmation}
        onOpenChange={setShowLogoutConfirmation}
      />
    </>
  );
}
