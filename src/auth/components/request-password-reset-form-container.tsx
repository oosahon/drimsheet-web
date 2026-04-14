import useRequestPasswordReset from '@/auth/hooks/use-request-password-reset';
import {
  ResetPasswordRequestForm,
  type IResetPasswordRequestFormValues,
} from '@/auth/ui/reset-password-reset-form';
import { handleApiError } from '@/shared/utils/api/errors';
import { toast } from 'sonner';

export function ResetPasswordRequestFormContainer() {
  const {
    mutateAsync: requestPasswordReset,
    isPending,
    isSuccess,
  } = useRequestPasswordReset();

  const handleRequestReset = async (
    values: IResetPasswordRequestFormValues
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
    <ResetPasswordRequestForm
      onSubmit={handleRequestReset}
      loading={isPending}
      isSuccess={isSuccess}
    />
  );
}
