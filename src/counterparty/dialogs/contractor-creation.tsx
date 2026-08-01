import { useJurisdictions } from '@/accounting/hooks/use-jurisdictions';
import {
  ContractorForm,
  type IContractorFormValues,
} from '@/counterparty/components';
import { useCreateContractor } from '@/counterparty/hooks/use-create-contractor';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/dialog';
import { useApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface ContractorCreationDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ContractorCreationDialog({
  open,
  onClose,
}: Readonly<ContractorCreationDialogProps>) {
  const { t } = useTranslation(['counterparty']);
  const handleApiError = useApiErrorHandler();

  const { data: jurisdictions = [], isPending: isJurisdictionsPending } =
    useJurisdictions();
  const { mutateAsync: createContractor, isPending: isCreating } =
    useCreateContractor();

  const formDisabled = isJurisdictionsPending;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const handleSubmit = async (values: IContractorFormValues) => {
    try {
      await createContractor(values);
      toast.success(t('counterparty:contractor_created_success_text'));
      onClose();
    } catch (error) {
      handleApiError(error, { showToast: true });
    }
  };

  const create_contractor_title = t('counterparty:create_contractor_title');
  const create_contractor_description = t(
    'counterparty:create_contractor_description'
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{create_contractor_title}</DialogTitle>
          <DialogDescription className="sr-only">
            {create_contractor_description}
          </DialogDescription>
        </DialogHeader>

        <ContractorForm
          onSubmit={handleSubmit}
          jurisdictions={jurisdictions}
          loading={isCreating}
          disabled={formDisabled || isCreating}
        />
      </DialogContent>
    </Dialog>
  );
}
