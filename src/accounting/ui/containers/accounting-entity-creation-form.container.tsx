import useCreateAccountingEntity from '@/accounting/hooks/use-create-accounting-entity';
import useJurisdictions from '@/accounting/hooks/use-jurisdictions';
import {
  AccountingEntityCreationForm,
  type IAccountingEntityFormValues,
} from '@/accounting/ui/accounting-entity-creation-form';
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
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface AccountingEntityCreationFormContainerProps {
  open: boolean;
  done: () => void;
}

export default function AccountingEntityCreationFormContainer({
  open,
  done,
}: AccountingEntityCreationFormContainerProps) {
  const { t } = useTranslation();
  const welcome_to_the_purple_side_text = t(
    'accounting:welcome_to_the_purple_side_text'
  );

  const { mutateAsync: createAccountingEntity, isPending } =
    useCreateAccountingEntity();
  const { data: user } = useProfile();
  const { data: currencies = [] } = useCurrencies();
  const { data: jurisdictions = [] } = useJurisdictions();

  const handleSubmit = async (values: IAccountingEntityFormValues) => {
    try {
      const userName = `${user?.firstName} ${user?.lastName}`;
      await createAccountingEntity({ ...values, name: userName });
      toast.success(welcome_to_the_purple_side_text);
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
          currencies={currencies}
          jurisdictions={jurisdictions}
        />
      </DialogContent>
    </Dialog>
  );
}
