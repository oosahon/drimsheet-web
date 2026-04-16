import useRequestPasswordReset from '@/auth/hooks/use-request-password-reset';
import {
  RequestPasswordResetForm,
  type IRequestPasswordResetFormValues,
} from '@/auth/ui/request-password-reset-form';
import { handleApiError } from '@/shared/utils/api/errors';
import { toast } from 'sonner';

export function RequestPasswordResetFormContainer() {
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
      toast.success('Password reset link sent to your email.');
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
