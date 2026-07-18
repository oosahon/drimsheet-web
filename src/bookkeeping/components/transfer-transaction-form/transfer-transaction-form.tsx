import { AccountCombobox } from '@/account/components/account-combobox';
import { Button } from '@/shared/components/button';
import { DateInput } from '@/shared/components/date-input';
import { Field, FieldError, FieldGroup } from '@/shared/components/field';
import { Label } from '@/shared/components/label';
import { MoneyWithCurrencyInput } from '@/shared/components/money-with-currency-input';
import { Textarea } from '@/shared/components/textarea';
import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import type { ILedgerAccountDto, IMoneyDto } from '@/shared/lib/api/Api';
import { cn } from '@/shared/lib/cn';
import dateUtils from '@/shared/lib/date';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import useTransferTransactionFormValidation from './validation';

export interface ITransferTransactionFormValues {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: IMoneyDto;
  amountReceived: IMoneyDto;
  date: string;
  pending: boolean;
  description: string;
}

export interface ITransferTransactionFormProps {
  accounts: ILedgerAccountDto[];
  onSubmit: (values: ITransferTransactionFormValues) => void;
  loading: boolean;
  sourceAccountId?: string;
}

const createMoneyValue = (
  amount = 0,
  currencyCode = '',
  isMinorUnit = false
): IMoneyDto => ({
  amount,
  currencyCode,
  isMinorUnit,
});

const updateMoneyCurrency = (value: IMoneyDto, currencyCode?: string) => ({
  ...value,
  currencyCode: currencyCode ?? value.currencyCode,
});

const updateMoneyAmount = (value: IMoneyDto, amount: number) => ({
  ...value,
  amount,
});

const createInitialValues = (
  sourceAccountId = ''
): ITransferTransactionFormValues => ({
  sourceAccountId,
  destinationAccountId: '',
  amount: createMoneyValue(),
  amountReceived: createMoneyValue(),
  date: dateUtils.formatDateForApi(new Date()),
  pending: false,
  description: '',
});

function PendingSwitch({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label="Pending"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-colors',
        checked ? 'bg-primary' : 'bg-muted-foreground/35'
      )}
    >
      <span
        className={cn(
          'size-5 rounded-full bg-background shadow-sm transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}

export function TransferTransactionForm({
  accounts,
  onSubmit,
  loading,
  sourceAccountId,
}: ITransferTransactionFormProps) {
  const { t } = useTranslation(['bookkeeping', 'shared']);

  const validationSchema = useTransferTransactionFormValidation();

  const formik = useFormik<ITransferTransactionFormValues>({
    initialValues: createInitialValues(sourceAccountId),
    enableReinitialize: true,
    validationSchema,
    onSubmit,
  });

  const getErrorMessage = useFieldErrorMessage({
    errors: formik.errors,
    touched: formik.touched,
  });

  const handleSourceAccountChange = (value: string) => {
    const sourceCurrencyCode =
      accounts.find((account) => account.id === value)?.balance.currencyCode ??
      accounts.find(
        (account) => account.id === formik.values.destinationAccountId
      )?.balance.currencyCode;

    void formik.setValues({
      ...formik.values,
      sourceAccountId: value,
      amount: updateMoneyCurrency(formik.values.amount, sourceCurrencyCode),
    });
    void formik.setFieldTouched('sourceAccountId', true, false);
  };

  const handleDestinationAccountChange = (value: string) => {
    const destinationCurrencyCode = accounts.find(
      (account) => account.id === value
    )?.balance.currencyCode;
    const shouldUseDestinationCurrencyForAmount =
      !formik.values.sourceAccountId;

    void formik.setValues({
      ...formik.values,
      destinationAccountId: value,
      amount: shouldUseDestinationCurrencyForAmount
        ? updateMoneyCurrency(formik.values.amount, destinationCurrencyCode)
        : formik.values.amount,
      amountReceived: updateMoneyCurrency(
        formik.values.amountReceived,
        destinationCurrencyCode
      ),
    });
    void formik.setFieldTouched('destinationAccountId', true, false);
  };

  const handleAmountChange =
    (fieldName: 'amount' | 'amountReceived') => (value: IMoneyDto) => {
      const pairedFieldName =
        fieldName === 'amount' ? 'amountReceived' : 'amount';
      const nextValues: ITransferTransactionFormValues = {
        ...formik.values,
        [fieldName]: value,
      };

      if (!formik.touched[pairedFieldName]) {
        nextValues[pairedFieldName] = updateMoneyAmount(
          formik.values[pairedFieldName],
          value.amount
        );
      }

      void formik.setValues(nextValues);
    };

  const selectedSourceAccount = accounts.find(
    (account) => account.id === formik.values.sourceAccountId
  );
  const selectedDestinationAccount = accounts.find(
    (account) => account.id === formik.values.destinationAccountId
  );
  const sourceAccountOptions = accounts.filter(
    (account) => account.id !== formik.values.destinationAccountId
  );
  const destinationAccountOptions = accounts.filter(
    (account) => account.id !== formik.values.sourceAccountId
  );
  const shouldShowSourceAccount = !sourceAccountId;
  const currencyCode =
    selectedSourceAccount?.balance.currencyCode ??
    selectedDestinationAccount?.balance.currencyCode;
  const amount = updateMoneyCurrency(formik.values.amount, currencyCode);
  const amountReceived = updateMoneyCurrency(
    formik.values.amountReceived,
    selectedDestinationAccount?.balance.currencyCode
  );

  const source_account_label = t('source_account_label');
  const destination_account_label = t('destination_account_label');
  const amount_sent_label = t('amount_sent_label');
  const amount_received_label = t('amount_received_label');
  // const add_bank_charges_text = t('add_bank_charges_text');
  const date_label = t('date_label');
  const pending_label = t('pending_label');
  const description_label = t('description_label');
  const save_transfer_transaction_text = t('shared:save');

  return (
    <div className="w-[min(calc(100vw-2rem),28rem)] max-w-full">
      <form onSubmit={formik.handleSubmit}>
        <FieldGroup className="gap-5">
          {shouldShowSourceAccount && (
            <AccountCombobox
              id="sourceAccountId"
              label={source_account_label}
              value={formik.values.sourceAccountId}
              accounts={sourceAccountOptions}
              onChange={handleSourceAccountChange}
              error={getErrorMessage('sourceAccountId')}
            />
          )}

          <AccountCombobox
            id="destinationAccountId"
            label={destination_account_label}
            value={formik.values.destinationAccountId}
            accounts={destinationAccountOptions}
            onChange={handleDestinationAccountChange}
            error={getErrorMessage('destinationAccountId')}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field data-invalid={Boolean(getErrorMessage('amount')?.length)}>
              <Label htmlFor="amount">{amount_sent_label}</Label>
              <MoneyWithCurrencyInput
                id="amount"
                name="amount"
                currencyDisabled
                currencyLabel={`${amount_sent_label} currency`}
                onChange={handleAmountChange('amount')}
                onBlur={formik.handleBlur}
                value={amount}
                aria-invalid={Boolean(getErrorMessage('amount')?.length)}
              />
              <FieldError errors={getErrorMessage('amount')} />
            </Field>

            <Field
              data-invalid={Boolean(getErrorMessage('amountReceived')?.length)}
            >
              <Label htmlFor="amountReceived">{amount_received_label}</Label>
              <MoneyWithCurrencyInput
                id="amountReceived"
                name="amountReceived"
                currencyDisabled
                currencyLabel={`${amount_received_label} currency`}
                onChange={handleAmountChange('amountReceived')}
                onBlur={formik.handleBlur}
                value={amountReceived}
                aria-invalid={Boolean(
                  getErrorMessage('amountReceived')?.length
                )}
              />
              <FieldError errors={getErrorMessage('amountReceived')} />
            </Field>
          </div>

          {/* <div className="-mt-3">
            <Button type="button" variant="outline" size="sm">
              {add_bank_charges_text}
            </Button>
          </div> */}

          <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
            <Field data-invalid={Boolean(getErrorMessage('date')?.length)}>
              <Label htmlFor="date">{date_label}</Label>
              <DateInput
                id="date"
                name="date"
                value={formik.values.date}
                onValueChange={(value) => formik.setFieldValue('date', value)}
                onBlur={formik.handleBlur}
                disabledDates={{ after: new Date() }}
                aria-invalid={Boolean(getErrorMessage('date')?.length)}
              />
              <FieldError errors={getErrorMessage('date')} />
            </Field>

            <Field orientation="horizontal" className="w-auto gap-2 sm:mb-1">
              <PendingSwitch
                id="pending"
                checked={formik.values.pending}
                onChange={(checked) => formik.setFieldValue('pending', checked)}
              />
              <Label htmlFor="pending" className="text-foreground">
                {pending_label}
              </Label>
            </Field>
          </div>

          <Field>
            <Label htmlFor="description">{description_label}</Label>
            <Textarea
              id="description"
              name="description"
              rows={2}
              className="min-h-10 resize-none"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FieldError errors={getErrorMessage('description')} />
          </Field>

          <Field className="mt-7">
            <Button type="submit" loading={loading} className="w-full">
              {save_transfer_transaction_text}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
