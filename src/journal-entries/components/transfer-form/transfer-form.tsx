import { AccountCombobox } from '@/account/components/account-combobox';
import { Button } from '@/shared/components/button';
import { Checkbox } from '@/shared/components/checkbox';
import { Field, FieldGroup } from '@/shared/components/field';
import { Label } from '@/shared/components/label';
import { MoneyWithCurrencyInput } from '@/shared/components/money-with-currency-input';
import { Textarea } from '@/shared/components/textarea';
import { useTranslation } from 'react-i18next';
import type { TransferFormProps } from './types';

export function TransferForm({
  accounts,
  values,
  onChange,
  onCreate,
}: Readonly<TransferFormProps>) {
  const { t } = useTranslation('journal-entries');
  const source_account_label = t('source_account_label');
  const destination_account_label = t('destination_account_label');
  const amount_sent_label = t('amount_sent_label');
  const amount_received_label = t('amount_received_label');
  const description_label = t('description_label');
  const description_placeholder = t('description_placeholder');
  const create_another_transaction_label = t(
    'create_another_transaction_label'
  );
  const create_transaction_label = t('create_transaction_label');
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCreate();
      }}
      className="w-full max-w-xl"
    >
      <FieldGroup className="gap-5">
        <AccountCombobox
          id="transfer-source-account"
          label={source_account_label}
          value={values.sourceAccountId}
          accounts={accounts}
          onChange={(sourceAccountId) =>
            onChange({ ...values, sourceAccountId })
          }
        />
        <AccountCombobox
          id="transfer-destination-account"
          label={destination_account_label}
          value={values.destinationAccountId}
          accounts={accounts}
          onChange={(destinationAccountId) =>
            onChange({ ...values, destinationAccountId })
          }
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <Label htmlFor="transfer-amount-sent">{amount_sent_label}</Label>
            <MoneyWithCurrencyInput
              id="transfer-amount-sent"
              value={values.amountSent}
              onChange={(amountSent) => onChange({ ...values, amountSent })}
            />
          </Field>
          <Field>
            <Label htmlFor="transfer-amount-received">
              {amount_received_label}
            </Label>
            <MoneyWithCurrencyInput
              id="transfer-amount-received"
              value={values.amountReceived}
              onChange={(amountReceived) =>
                onChange({ ...values, amountReceived })
              }
            />
          </Field>
        </div>
        <Field>
          <Label htmlFor="transfer-description">{description_label}</Label>
          <Textarea
            id="transfer-description"
            placeholder={description_placeholder}
            value={values.description}
            onChange={(event) =>
              onChange({ ...values, description: event.target.value })
            }
          />
        </Field>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="transfer-create-another"
              checked={values.createAnother}
              onCheckedChange={(checked) =>
                onChange({ ...values, createAnother: checked === true })
              }
            />
            <Label htmlFor="transfer-create-another">
              {create_another_transaction_label}
            </Label>
          </div>
          <Button type="submit">{create_transaction_label}</Button>
        </div>
      </FieldGroup>
    </form>
  );
}
