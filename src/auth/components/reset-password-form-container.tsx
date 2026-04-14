import useResetPassword from '@/auth/hooks/use-reset-password';
import authService from '@/auth/services/auth.service';
import {
  ResetPasswordForm,
  type IResetPasswordFormValues,
} from '@/auth/ui/reset-password-form';
import { handleApiError } from '@/shared/utils/api/errors';
import type { FormikHelpers } from 'formik';
import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export function ResetPasswordFormContainer() {
  const {
    mutateAsync: resetPassword,
    isPending,
    isSuccess,
  } = useResetPassword();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const email = useMemo(() => authService.decodeToken(token)?.email, [token]);

  const handleResetPassword = async (
    values: IResetPasswordFormValues,
    helpers: FormikHelpers<IResetPasswordFormValues>
  ) => {
    try {
      await resetPassword({
        ...values,
        token,
      });
      toast.success('Password has been reset successfully.');
      navigate('/dashboard');
    } catch (error) {
      handleApiError(error, {
        showToast: true,
        setValidationError: (errors) => {
          errors.forEach((err) => {
            helpers.setFieldError(err.field, err.message);
          });
        },
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4 text-center max-w-sm">
        <p className="text-sm text-muted-foreground">
          Your password has been successfully reset. You can now log in with
          your new password.
        </p>
        <Link
          to="/auth/login"
          className="text-sm font-medium text-purple-400 hover:text-purple-200"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <ResetPasswordForm
      email={email}
      onSubmit={handleResetPassword}
      loading={isPending}
    />
  );
}
