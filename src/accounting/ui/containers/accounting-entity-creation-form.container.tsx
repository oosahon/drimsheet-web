import useJurisdictions from '@/accounting/hooks/use-jurisdictions';
import {
  AccountingEntityCreationForm,
  type IAccountingEntityFormValues,
} from '@/accounting/ui/accounting-entity-creation-form';
import useOnboardIndividualAccountingEntity from '@/onboarding/hooks/use-onboard-individual-accounting-entity';
import useCurrencies from '@/shared/hooks/use-currencies';
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

interface AccountingEntityCreationFormContainerProps {
  open: boolean;
  done: () => void;
}

export default function AccountingEntityCreationFormContainer({
  open,
  done,
}: AccountingEntityCreationFormContainerProps) {
  const { mutateAsync: onboardIndividual, isPending } =
    useOnboardIndividualAccountingEntity();
  const { data: user } = useProfile();
  const { data: currenciesData = [] } = useCurrencies();
  const { data: countriesData = [] } = useJurisdictions();

  const handleSubmit = async (values: IAccountingEntityFormValues) => {
    try {
      const userName = `${user?.firstName} ${user?.lastName}`;
      await onboardIndividual({ ...values, name: userName });
      toast.success('Welcome to the purple side!');
      done();
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
        <AccountingEntityCreationForm
          loading={isPending}
          onSubmit={handleSubmit}
          currenciesData={currenciesData}
          countriesData={countriesData}
        />
      </DialogContent>
    </Dialog>
  );
}
