import useRequestPasswordReset from '@/auth/hooks/use-request-password-reset';
import {
  RequestPasswordResetForm,
  type IRequestPasswordResetFormValues,
} from '@/auth/ui/request-password-reset-form';
import { handleApiError } from '@/shared/utils/api/errors';
import { Link } from 'react-router-dom';
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

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4 text-center max-w-sm">
        <p className="text-sm text-muted-foreground">
          If an account exists for that email, we have sent a password reset
          link.
        </p>
        <Link
          to="/auth/login"
          className="text-sm font-medium text-purple-400 hover:text-purple-200"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <RequestPasswordResetForm
      onSubmit={handleRequestReset}
      loading={isPending}
    />
  );
}
