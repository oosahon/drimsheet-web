import {
  AccountCreationForm,
  type IAccountCreationFormValues,
} from '@/account/components/account-creation-form';
import { useCreatePettyCashAccount } from '@/account/hooks/use-create-petty-cash-account';
import { useAccountingEntity } from '@/accounting/hooks/use-accounting-entity';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/dialog';
import { useApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import { useCurrencies } from '@/shared/hooks/use-currencies';
import { ELedgerAccountBehavior } from '@/shared/lib/api/Api';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface AccountCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountCreationDialog({
  open,
  onOpenChange,
}: Readonly<AccountCreationDialogProps>) {
  const { t } = useTranslation(['ledger-accounts', 'shared']);
  const handleApiError = useApiErrorHandler();
  const { data: currencies = [], isPending: isCurrenciesPending } =
    useCurrencies();
  const { data: accountingEntity, isPending: isAccountingEntityPending } =
    useAccountingEntity();

  const accountingCurrencyCode = accountingEntity?.functionalCurrencyCode ?? '';
  const { mutateAsync: createPettyCashAccount, isPending: isCreating } =
    useCreatePettyCashAccount(accountingCurrencyCode);

  const formDisabled =
    isCurrenciesPending || isAccountingEntityPending || !accountingCurrencyCode;

  const handleSubmit = async (values: IAccountCreationFormValues) => {
    try {
      await createPettyCashAccount(values);
      toast.success(
        t('ledger-accounts:petty_cash_account_created_success_text')
      );
      onOpenChange(false);
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>', { values, error });
      handleApiError(error, { showToast: true });
    }
  };

  const create_petty_cash_account_title = t(
    'ledger-accounts:create_petty_cash_account'
  );
  const petty_cash_label = t('shared:petty_cash');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{create_petty_cash_account_title}</DialogTitle>
        </DialogHeader>

        <AccountCreationForm
          accountingCurrencyCode={accountingCurrencyCode}
          accountTypes={[
            {
              value: ELedgerAccountBehavior.PettyCash,
              label: petty_cash_label,
            },
          ]}
          currencies={currencies}
          disabled={formDisabled}
          initialValues={{
            accountType: ELedgerAccountBehavior.PettyCash,
            currencyCode: accountingCurrencyCode,
          }}
          loading={isCreating}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
