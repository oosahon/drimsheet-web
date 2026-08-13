import { useAccountingEntities } from '@/accounting/hooks/use-accounting-entities';
import { useAccountingEntity } from '@/accounting/hooks/use-accounting-entity';
import { authService } from '@/auth/lib/services/auth.service';
import { FullPageLoader } from '@/shared/components/full-page-loader';
import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedAppLayout({ children }: Readonly<PropsWithChildren>) {
  const { t } = useTranslation('shared');
  const location = useLocation();
  const isLoggedIn = authService.isLoggedIn();
  const { data: accountingEntities, isLoading: isLoadingAccountingEntities } =
    useAccountingEntities({ disabled: !isLoggedIn });
  const hasAccountingEntities = Boolean(accountingEntities?.length);
  const { isLoading: isLoadingAccountingEntity } = useAccountingEntity({
    disabled: !isLoggedIn || !hasAccountingEntities,
  });

  if (!isLoggedIn) {
    return (
      <Navigate to="/auth/signin" replace state={{ from: location.pathname }} />
    );
  }

  if (
    isLoadingAccountingEntities ||
    (hasAccountingEntities && isLoadingAccountingEntity)
  ) {
    const loading_application_status = t('loading_application_status');

    return <FullPageLoader label={loading_application_status} />;
  }

  return <>{children}</>;
}
