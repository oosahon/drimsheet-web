import useRequestPasswordReset from '@/auth/hooks/api/use-request-password-reset';
import {
  RequestPasswordResetForm,
  type IRequestPasswordResetFormValues,
} from '@/auth/ui/components/request-password-reset-form';
import useApiErrorHandler from '@/shared/hooks/use-api-error-handler';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function RequestPasswordResetFormContainer() {
  const handleApiError = useApiErrorHandler();
  const { t } = useTranslation(['auth']);
  const password_reset_link_sent_text = t('password_reset_link_sent_text');

  const {
    mutateAsync: requestPasswordReset,
    isPending,
    isSuccess,
  } = useRequestPasswordReset();

  const handleRequestReset = async (
    values: IRequestPasswordResetFormValues
  ) => {
    try {
      await requestPasswordReset(values.email);
      toast.success(password_reset_link_sent_text);
    } catch (error) {
      handleApiError(error, {
        showToast: true,
      });
    }
  };

  return (
    <RequestPasswordResetForm
      onSubmit={handleRequestReset}
      loading={isPending}
      isSuccess={isSuccess}
    />
  );
}
