import { AccountCombobox } from '@/account/components/account-combobox';
import { ItemizedFields } from '@/journal-entries/components/itemized-fields';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/alert-dialog';
import { Button } from '@/shared/components/button';
import { CurrencyExchangeRateInput } from '@/shared/components/currency-exchange-rate-input';
import { DateInput } from '@/shared/components/date-input';
import { Field, FieldError, FieldGroup } from '@/shared/components/field';
import { FileUpload } from '@/shared/components/file-upload';
import {
  FreeSoloCombobox,
  type UFreeSoloComboboxValue,
} from '@/shared/components/free-solo-combobox';
import { Input } from '@/shared/components/input';
import { Label } from '@/shared/components/label';
import { MoneyWithCurrencyInput } from '@/shared/components/money-with-currency-input';
import { useFieldErrorMessage } from '@/shared/hooks/use-field-error-message';
import type { IJournalCounterpartyReq } from '@/shared/lib/api/Api';
import { dateUtils } from '@/shared/lib/utils/date';
import { generateUUID } from '@/shared/lib/utils/uuid';
import { useFormik } from 'formik';
import { ArrowLeft, ListCollapse } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import inflowFormHelpers from './inflow-form.helper';
import type { IInflowFormValues, InflowFormProps } from './types';
import { useInflowFormValidation } from './validation';

const RECEIPT_ACCEPT = ['image/jpeg', 'image/png', 'application/pdf'];

export function InflowForm({
  destinationAccounts,
  disabled = false,
  functionalCurrencyCode,
  initialValues,
  loading = false,
  officialExchangeRate,
  onCurrencyContextChange,
  onSubmit,
  payerOptions = [],
  sourceAccounts,
}: Readonly<InflowFormProps>) {
  const { t } = useTranslation<'journal-entries'>('journal-entries');

  const [singleEntryConfirmationOpen, setSingleEntryConfirmationOpen] =
    useState(false);
  const [isItemizedRowEditing, setIsItemizedRowEditing] = useState(false);
  const [initialItemizedEditItemId, setInitialItemizedEditItemId] =
    useState<string>();

  const validationSchema = useInflowFormValidation(
    destinationAccounts,
    functionalCurrencyCode,
    officialExchangeRate
  );

  const resolvedInitialValues = useMemo(
    () =>
      inflowFormHelpers.createInitialValues(
        initialValues,
        destinationAccounts,
        functionalCurrencyCode
      ),
    [destinationAccounts, functionalCurrencyCode, initialValues]
  );

  const handleSubmit = (values: IInflowFormValues) => {
    const destinationCurrencyCode =
      inflowFormHelpers.getDestinationCurrencyCode(
        destinationAccounts,
        values.destinationAccountId
      );
    const officialRateMatches = inflowFormHelpers.matchesOfficialRate(
      officialExchangeRate,
      destinationCurrencyCode ?? '',
      functionalCurrencyCode,
      values.date
    );

    onSubmit(
      inflowFormHelpers.normalizeValues(
        values,
        inflowFormHelpers.isExchangeRateRequired(
          destinationCurrencyCode,
          functionalCurrencyCode
        ),
        officialRateMatches ? officialExchangeRate?.rate : undefined
      )
    );
  };

  const formik = useFormik<IInflowFormValues>({
    enableReinitialize: true,
    initialValues: resolvedInitialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const getErrorMessage = useFieldErrorMessage({
    errors: formik.errors,
    touched: formik.touched,
  });

  const selectedAccount = destinationAccounts.find(
    (account) => account.id === formik.values.destinationAccountId
  );
  const destinationCurrencyCode =
    selectedAccount?.balance.currencyCode ?? functionalCurrencyCode;
  const destinationAccountOpeningDate = selectedAccount?.openingBalanceDate;

  const itemizedTotal = inflowFormHelpers.getItemTotal(formik.values.items);

  /**
   * ================= Handlers ================
   */
  const handleAccountChange = (destinationAccountId: string) => {
    const currencyCode = inflowFormHelpers.getDestinationCurrencyCode(
      destinationAccounts,
      destinationAccountId
    );

    const itemizedFieldsWillRemount = currencyCode !== destinationCurrencyCode;

    if (itemizedFieldsWillRemount) {
      setIsItemizedRowEditing(!!initialItemizedEditItemId);
    }

    void formik.setValues(
      inflowFormHelpers.updateAccount(
        formik.values,
        destinationAccountId,
        currencyCode,
        functionalCurrencyCode
      )
    );
    void formik.setFieldTouched('destinationAccountId', true, false);

    onCurrencyContextChange({
      currencyCode,
      date: formik.values.date,
    });
  };

  const handleDateChange = (date: string) => {
    void formik.setFieldValue('date', date);
    onCurrencyContextChange({
      currencyCode: destinationCurrencyCode,
      date,
    });
  };

  const handleDateDisabled = (date: Date) => {
    if (!dateUtils.isNotInTheFuture(date)) return true;
    if (!destinationAccountOpeningDate) return false;

    return !dateUtils.isOnOrAfter(date, destinationAccountOpeningDate);
  };

  const handlePayerChange = (
    payer: UFreeSoloComboboxValue<IJournalCounterpartyReq>
  ) => {
    let nextPayer: IJournalCounterpartyReq;

    if (typeof payer === 'string') nextPayer = { name: payer };
    else if (payer === null) nextPayer = { name: '' };
    else nextPayer = payer;

    void formik.setFieldValue('payer', nextPayer);
  };

  const handleItemize = () => {
    const item = inflowFormHelpers.createItem(
      generateUUID(),
      formik.values.amount.currencyCode,
      formik.values.amount.amount,
      formik.values.sourceAccountId
    );

    setInitialItemizedEditItemId(item.id);
    setIsItemizedRowEditing(true);
    void formik.setFieldValue('items', [item]);
    void formik.setFieldTouched('items', false, false);
    void formik.setFieldTouched('amount.amount', false, false);
    void formik.setFieldValue('isItemized', true);
  };

  const handleItemsChange = (items: IInflowFormValues['items']) => {
    setInitialItemizedEditItemId(undefined);
    void formik.setFieldValue('items', items);
  };

  const handleItemizedEditModeChange = (isEditing: boolean) => {
    setIsItemizedRowEditing(isEditing);
    if (!isEditing) setInitialItemizedEditItemId(undefined);
  };

  const collapseToSingleEntry = () => {
    const firstItem = formik.values.items[0];
    if (firstItem) {
      void formik.setFieldValue('sourceAccountId', firstItem.accountId);
    }
    void formik.setFieldValue('amount', {
      amount: itemizedTotal,
      currencyCode: formik.values.amount.currencyCode,
      isMinorUnit: formik.values.amount.isMinorUnit,
    });
    void formik.setFieldValue('items', []);
    void formik.setFieldTouched('items', false, false);
    void formik.setFieldValue('isItemized', false);
    setInitialItemizedEditItemId(undefined);
    setIsItemizedRowEditing(false);
    setSingleEntryConfirmationOpen(false);
  };

  const handleBackToSingleEntry = () => {
    if (formik.values.items.length <= 1) collapseToSingleEntry();
    else setSingleEntryConfirmationOpen(true);
  };

  /**
   * ================= Derived values ================
   */

  const displayedAmount = formik.values.isItemized
    ? {
        amount: itemizedTotal,
        currencyCode: formik.values.amount.currencyCode,
        isMinorUnit: formik.values.amount.isMinorUnit,
      }
    : formik.values.amount;

  const officialRateMatches = inflowFormHelpers.matchesOfficialRate(
    officialExchangeRate,
    destinationCurrencyCode,
    functionalCurrencyCode,
    formik.values.date
  );

  const exchangeRateRequired = inflowFormHelpers.isExchangeRateRequired(
    destinationCurrencyCode,
    functionalCurrencyCode
  );
  const interactionDisabled = disabled || loading;

  /**
   * Errors
   */
  const accountError = getErrorMessage('destinationAccountId');
  const amountError = formik.values.isItemized
    ? []
    : getErrorMessage('amount.amount');
  const dateError = getErrorMessage('date');
  const categoryError = getErrorMessage('sourceAccountId');
  const exchangeRateError = getErrorMessage('exchangeRate');
  const payerError = getErrorMessage('payer.name');
  const receiptError = getErrorMessage('receipt');

  /**
   * ================= Translations ================
   */
  const account_label = t('inflow_account_label');
  const amount_label = t('amount_label');
  const date_label = t('inflow_date_label');
  const date_placeholder = t('inflow_date_placeholder');
  const category_label = t('category_label');
  const category_placeholder = t('category_placeholder');
  const create_text = t('inflow_create_text');
  const description_label = t('description_label');
  const description_placeholder = t('description_placeholder');
  const exchange_rate_label = t('exchange_rate_label');
  const itemize_transaction_text = t('inflow_itemize_transaction_text');
  const back_to_single_text = t('inflow_back_to_single_entry_text');
  const payer_empty_text = t('inflow_payer_empty_text');
  const payer_label = t('inflow_payer_label');
  const payer_placeholder = t('inflow_payer_placeholder');
  const receipt_label = t('inflow_receipt_label');
  const receipt_action_text = t('inflow_receipt_action_text');
  const receipt_replace_text = t('inflow_receipt_replace_text');
  const receipt_remove_text = t('inflow_receipt_remove_text');
  const receipt_guidance_text = t('inflow_receipt_guidance_text');
  const return_title = t('inflow_return_to_single_title');
  const return_description = t('inflow_return_to_single_description');
  const return_cancel_text = t('inflow_return_to_single_cancel_text');
  const return_confirm_text = t('inflow_return_to_single_confirm_text');

  return (
    <>
      <form
        aria-busy={loading}
        className="w-full max-w-xl"
        onSubmit={formik.handleSubmit}
      >
        <FieldGroup className="gap-5">
          <AccountCombobox
            id="inflow-destination-account"
            accounts={destinationAccounts}
            disabled={interactionDisabled}
            error={accountError}
            label={account_label}
            onChange={handleAccountChange}
            value={formik.values.destinationAccountId}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field data-invalid={Boolean(amountError.length)}>
              <Label htmlFor="inflow-amount">{amount_label}</Label>
              <MoneyWithCurrencyInput
                id="inflow-amount"
                aria-invalid={Boolean(amountError.length)}
                currencyDisabled
                showFlag
                currencyLabelFormat="code"
                disabled={interactionDisabled || formik.values.isItemized}
                name="amount.amount"
                onBlur={formik.handleBlur}
                onChange={(amount) =>
                  void formik.setFieldValue('amount', amount)
                }
                value={displayedAmount}
              />
              <FieldError errors={amountError} />
            </Field>

            <Field data-invalid={Boolean(dateError.length)}>
              <Label htmlFor="inflow-date">{date_label}</Label>
              <DateInput
                id="inflow-date"
                aria-invalid={Boolean(dateError.length)}
                disabled={interactionDisabled}
                disabledDates={handleDateDisabled}
                onBlur={() => void formik.setFieldTouched('date', true)}
                onValueChange={handleDateChange}
                placeholder={date_placeholder}
                value={formik.values.date}
              />
              <FieldError errors={dateError} />
            </Field>
          </div>

          {exchangeRateRequired && (
            <Field data-invalid={Boolean(exchangeRateError.length)}>
              <Label htmlFor="inflow-exchange-rate">
                {exchange_rate_label}
              </Label>
              <CurrencyExchangeRateInput
                id="inflow-exchange-rate"
                aria-invalid={Boolean(exchangeRateError.length)}
                aria-label={exchange_rate_label}
                baseCurrency={destinationCurrencyCode}
                disabled={interactionDisabled}
                displayOfficialRate
                layout="compact"
                name="exchangeRate"
                officialRate={
                  officialRateMatches ? officialExchangeRate : undefined
                }
                onBlur={formik.handleBlur}
                onChange={(event) =>
                  void formik.setFieldValue('exchangeRate', event.target.value)
                }
                targetCurrency={functionalCurrencyCode}
                value={formik.values.exchangeRate}
              />
              <FieldError errors={exchangeRateError} />
            </Field>
          )}

          {formik.values.isItemized ? (
            <div className="space-y-3">
              <Button
                className="h-auto px-0"
                disabled={interactionDisabled}
                onClick={handleBackToSingleEntry}
                type="button"
                variant="link"
              >
                <ArrowLeft />
                {back_to_single_text}
              </Button>
              <ItemizedFields
                key={destinationCurrencyCode}
                accounts={sourceAccounts}
                currencyCode={destinationCurrencyCode}
                defaultValue={formik.values.items}
                disabled={interactionDisabled}
                initialEditItemId={initialItemizedEditItemId}
                onChange={handleItemsChange}
                onEditModeChange={handleItemizedEditModeChange}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <AccountCombobox
                id="inflow-category"
                accounts={sourceAccounts}
                disabled={interactionDisabled}
                error={categoryError}
                label={category_label}
                onChange={(sourceAccountId) => {
                  void formik.setFieldValue('sourceAccountId', sourceAccountId);
                  void formik.setFieldTouched('sourceAccountId', true, false);
                }}
                placeholder={category_placeholder}
                value={formik.values.sourceAccountId}
              />
              <Button
                className="h-auto justify-start px-0"
                disabled={interactionDisabled}
                onClick={handleItemize}
                type="button"
                variant="link"
              >
                <ListCollapse />
                {itemize_transaction_text}
              </Button>
            </div>
          )}

          <FreeSoloCombobox<IJournalCounterpartyReq>
            id="inflow-payer"
            disabled={interactionDisabled}
            emptyMessage={payer_empty_text}
            error={payerError}
            getOptionLabel={(payer) => payer.name}
            isOptionEqualToValue={(payer, value) =>
              payer.id !== undefined && payer.id === value.id
            }
            label={payer_label}
            name="payer.name"
            onBlur={() => void formik.setFieldTouched('payer.name', true)}
            onValueChange={handlePayerChange}
            options={payerOptions}
            placeholder={payer_placeholder}
            required
            value={formik.values.payer}
          />

          <Field>
            <Label htmlFor="inflow-description">{description_label}</Label>
            <Input
              id="inflow-description"
              disabled={interactionDisabled}
              name="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder={description_placeholder}
              value={formik.values.description}
            />
          </Field>

          <FileUpload
            accept={RECEIPT_ACCEPT}
            actionText={receipt_action_text}
            description={receipt_guidance_text}
            disabled={interactionDisabled}
            errors={receiptError}
            id="inflow-receipt"
            label={receipt_label}
            onValueChange={(receipt) => {
              void formik.setFieldValue('receipt', receipt);
              void formik.setFieldTouched('receipt', true, false);
            }}
            removeText={receipt_remove_text}
            replaceText={receipt_replace_text}
            value={formik.values.receipt}
          />

          <div className="flex justify-end pt-2">
            <Button
              disabled={disabled || isItemizedRowEditing}
              loading={loading}
              type="submit"
            >
              {create_text}
            </Button>
          </div>
        </FieldGroup>
      </form>

      <AlertDialog
        open={singleEntryConfirmationOpen}
        onOpenChange={setSingleEntryConfirmationOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{return_title}</AlertDialogTitle>
            <AlertDialogDescription>
              {return_description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{return_cancel_text}</AlertDialogCancel>
            <AlertDialogAction onClick={collapseToSingleEntry}>
              {return_confirm_text}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
