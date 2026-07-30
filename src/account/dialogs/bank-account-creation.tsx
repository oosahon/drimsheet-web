import {
  BankAccountFormContainer,
  type IBankAccountFormValues,
} from '@/account/components/bank-account-form';
import { useCreateBankAccount } from '@/account/hooks/use-create-bank-account';
import { useAccountingEntity } from '@/accounting/hooks/use-accounting-entity';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/dialog';
import { DocumentUpload } from '@/shared/components/document-upload';
import { EFileType } from '@/shared/components/document-upload/types';
import { Separator } from '@/shared/components/separator';
import countries from '@/shared/configs/countries.json' with { type: 'json' };
import { useApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import { useCurrencies } from '@/shared/hooks/use-currencies';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface BankAccountCreationDialogProps {
  open: boolean;
  onClose: () => void;
}

export function BankAccountCreationDialog({
  open,
  onClose,
}: Readonly<BankAccountCreationDialogProps>) {
  const { t } = useTranslation(['ledger-accounts', 'shared']);
  const handleApiError = useApiErrorHandler();

  const [statementFiles, setStatementFiles] = useState<File[]>([]);

  const { data: currencies = [], isPending: isCurrenciesPending } =
    useCurrencies();
  const { data: accountingEntity, isPending: isAccountingEntityPending } =
    useAccountingEntity();

  const accountingCurrencyCode = accountingEntity?.functionalCurrencyCode ?? '';
  const initialJurisdiction = accountingEntity?.jurisdictionCode ?? '';

  const { mutateAsync: createBankAccount, isPending: isCreating } =
    useCreateBankAccount(accountingCurrencyCode);

  const bankLocations = useMemo(
    () =>
      countries.map((c) => ({
        code: c.code,
        name: c.name,
      })),
    []
  );

  const formDisabled =
    isCurrenciesPending || isAccountingEntityPending || !accountingCurrencyCode;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setStatementFiles([]);
      onClose();
    }
  };

  const handleSubmit = async (values: IBankAccountFormValues) => {
    try {
      await createBankAccount(values);
      toast.success(t('ledger-accounts:bank_account_created_success_text'));
      setStatementFiles([]);
      onClose();
    } catch (error) {
      handleApiError(error, { showToast: true });
    }
  };

  const create_bank_account_title = t('ledger-accounts:create_bank_account');
  const upload_bank_statement_title = t(
    'ledger-accounts:upload_bank_statement_title'
  );
  const upload_bank_statement_description = t(
    'ledger-accounts:upload_bank_statement_description'
  );
  const upload_bank_statement_action = t(
    'ledger-accounts:upload_bank_statement_action'
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{create_bank_account_title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr] md:items-start">
          <div className="order-2 min-w-0 md:order-1">
            <BankAccountFormContainer
              accountingCurrencyCode={accountingCurrencyCode}
              bankLocations={bankLocations}
              currencies={currencies}
              disabled={formDisabled}
              initialBankLocation={initialJurisdiction}
              initialValues={{
                currencyCode: accountingCurrencyCode,
                bankLocation: initialJurisdiction,
              }}
              loading={isCreating}
              onSubmit={handleSubmit}
            />
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-full md:order-2 md:block"
          />

          <div className="order-1 min-w-0 md:order-3">
            <DocumentUpload
              accept={[EFileType.Pdf]}
              actionText={upload_bank_statement_action}
              allowMultiple={false}
              description={upload_bank_statement_description}
              onUpload={setStatementFiles}
              title={upload_bank_statement_title}
              value={statementFiles}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
