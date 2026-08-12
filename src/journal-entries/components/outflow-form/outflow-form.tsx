import { AccountCombobox } from '@/account/components/account-combobox';
import { Button } from '@/shared/components/button';
import { Checkbox } from '@/shared/components/checkbox';
import { CurrencyExchangeRateInput } from '@/shared/components/currency-exchange-rate-input';
import { Field, FieldGroup } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { Label } from '@/shared/components/label';
import { MoneyWithCurrencyInput } from '@/shared/components/money-with-currency-input';
import { Textarea } from '@/shared/components/textarea';
import { useTranslation } from 'react-i18next';
import type { OutflowFormProps } from './types';

export function OutflowForm({
  accounts,
  functionalCurrencyCode,
  values,
  onChange,
  onCreate,
}: Readonly<OutflowFormProps>) {
  const { t } = useTranslation('journal-entries');
  const source_account_label = t('source_account_label');
  const category_label = t('category_label');
  const amount_label = t('amount_label');
  const exchange_rate_label = t('exchange_rate_label');
  const counterparty_name_label = t('counterparty_name_label');
  const description_label = t('description_label');
  const description_placeholder = t('description_placeholder');
  const create_another_transaction_label = t(
    'create_another_transaction_label'
  );
  const create_transaction_label = t('create_transaction_label');
  const sourceCurrency = accounts.find(
    (account) => account.id === values.sourceAccountId
  )?.balance.currencyCode;
  const targetCurrency = values.amount.currencyCode || 'NGN';
  const showExchangeRate =
    Boolean(sourceCurrency) &&
    Boolean(functionalCurrencyCode) &&
    sourceCurrency !== functionalCurrencyCode;
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
          id="outflow-source-account"
          label={source_account_label}
          value={values.sourceAccountId}
          accounts={accounts}
          onChange={(sourceAccountId) =>
            onChange({ ...values, sourceAccountId })
          }
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <Label htmlFor="outflow-amount">{amount_label}</Label>
            <MoneyWithCurrencyInput
              id="outflow-amount"
              value={values.amount}
              onChange={(amount) => onChange({ ...values, amount })}
            />
          </Field>
          {showExchangeRate && (
            <Field>
              <Label htmlFor="outflow-exchange-rate">
                {exchange_rate_label}
              </Label>
              <CurrencyExchangeRateInput
                aria-label={exchange_rate_label}
                baseCurrency={sourceCurrency ?? ''}
                id="outflow-exchange-rate"
                targetCurrency={targetCurrency}
                value={values.exchangeRate}
                onChange={(event) =>
                  onChange({ ...values, exchangeRate: event.target.value })
                }
              />
            </Field>
          )}
        </div>
        <AccountCombobox
          id="outflow-category"
          label={category_label}
          value={values.categoryAccountId}
          accounts={accounts}
          onChange={(categoryAccountId) =>
            onChange({ ...values, categoryAccountId })
          }
        />
        <Field>
          <Label htmlFor="outflow-counterparty">
            {counterparty_name_label}
          </Label>
          <Input
            id="outflow-counterparty"
            value={values.counterpartyName}
            onChange={(event) =>
              onChange({ ...values, counterpartyName: event.target.value })
            }
          />
        </Field>
        <Field>
          <Label htmlFor="outflow-description">{description_label}</Label>
          <Textarea
            id="outflow-description"
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
              id="outflow-create-another"
              checked={values.createAnother}
              onCheckedChange={(checked) =>
                onChange({ ...values, createAnother: checked === true })
              }
            />
            <Label htmlFor="outflow-create-another">
              {create_another_transaction_label}
            </Label>
          </div>
          <Button type="submit">{create_transaction_label}</Button>
        </div>
      </FieldGroup>
    </form>
  );
}
