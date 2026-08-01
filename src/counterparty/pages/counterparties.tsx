import { AppBody, AppHeader } from '@/shared/components/app';
import { useTranslation } from 'react-i18next';

export function CounterpartiesPage() {
  const { t } = useTranslation('shared');

  return (
    <>
      <AppHeader breadcrumbs={[{ label: t('counterparties') }]} />

      <AppBody>
        <div>{t('counterparties')}</div>
      </AppBody>
    </>
  );
}
