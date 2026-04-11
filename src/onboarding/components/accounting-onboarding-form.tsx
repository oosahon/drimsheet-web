import useOnboardIndividualAccountingEntity from '@/onboarding/hooks/use-onboard-individual-accounting-entity';
import {
  AccountingEntityOnboardingForm,
  type IAccountingEntityFormValues,
} from '@/onboarding/ui/accounting-entity-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { handleApiError } from '@/shared/utils/api/errors';
import useProfile from '@/user/hooks/use-profile';
import { toast } from 'sonner';

interface AccountingOnboardingFormContainerProps {
  open: boolean;
}

export default function AccountingOnboardingFormContainer({
  open,
}: AccountingOnboardingFormContainerProps) {
  const { mutateAsync: onboardIndividual, isPending } =
    useOnboardIndividualAccountingEntity();
  const { data: user } = useProfile();

  const handleSubmit = async (values: IAccountingEntityFormValues) => {
    try {
      const userName = `${user?.firstName} ${user?.lastName}`;
      await onboardIndividual({ ...values, name: userName });
      toast.success('Welcome to the purple side!');
    } catch (error) {
      handleApiError(error, { showToast: true });
    }
  };

  return (
    <Dialog open={open} modal>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Account Setup</DialogTitle>
          <DialogDescription className="text-sm">
            Choose the type of account you want to create.
          </DialogDescription>
        </DialogHeader>
        <AccountingEntityOnboardingForm
          loading={isPending}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
