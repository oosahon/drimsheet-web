import { Skeleton } from '@/shared/components/skeleton';
import { useTranslation } from 'react-i18next';

function AccountingEntityCreationFormSkeleton() {
  const { t } = useTranslation('accounting');

  const profile_loading_status = t('profile_loading_status');

  return (
    <div className="flex min-w-xs max-w-full flex-col gap-7" aria-busy="true">
      <output className="sr-only">{profile_loading_status}</output>
      <Skeleton className="h-5 w-32" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="mt-4 flex justify-end">
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

export { AccountingEntityCreationFormSkeleton };
