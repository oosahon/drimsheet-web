import useSignupWithEmail from '@/auth/hooks/use-signup-with-email';
import { SignupForm, type ISignupFormValues } from '@/auth/ui/signup-form';
import useApiErrorHandler from '@/shared/hooks/use-api-error-handler';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export function SignupFormContainer() {
  const handleApiError = useApiErrorHandler();
  const { t } = useTranslation(['auth']);
  const account_created_success_text = t('account_created_success_text');

  const [, setSearchParams] = useSearchParams();

  const { mutateAsync: signup, isPending } = useSignupWithEmail();

  const handleSignup = async (values: ISignupFormValues) => {
    try {
      await signup(values);
      toast.success(account_created_success_text);
      setSearchParams({ success: 'true' });
    } catch (error) {
      handleApiError(error, { showToast: true });
    }
  };

  return <SignupForm onSubmit={handleSignup} loading={isPending} />;
}
