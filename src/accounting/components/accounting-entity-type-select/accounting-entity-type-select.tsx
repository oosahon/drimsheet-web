import { Field, FieldError } from '@/shared/components/field';
import { Label } from '@/shared/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/select';
import {
  EAccountingEntityType,
  type UAccountingEntityType,
} from '@/shared/lib/api/Api';
import { useTranslation } from 'react-i18next';
export interface AccountingEntityTypeSelectProps {
  value: UAccountingEntityType | '';
  onChange: (value: UAccountingEntityType) => void;
  error?: Array<{ message?: string } | undefined>;
}

export function AccountingEntityTypeSelect({
  value,
  onChange,
  error,
}: Readonly<AccountingEntityTypeSelectProps>) {
  const { t } = useTranslation('accounting');

  const errorId = 'accounting-entity-type-error';
  const hasError = Boolean(error?.some((item) => item?.message));

  const account_for_label = t('account_for_label');
  const select_entity_placeholder = t('select_entity_placeholder');
  const individual_entity_type = t('individual_entity_type');
  const sole_proprietorship_entity_type = t('sole_proprietorship_entity_type');
  const company_entity_type = t('company_entity_type');

  return (
    <Field>
      <Label htmlFor="accounting-entity-type">{account_for_label}</Label>
      <Select
        value={value}
        onValueChange={(selectedValue) =>
          onChange(selectedValue as UAccountingEntityType)
        }
      >
        <SelectTrigger
          id="accounting-entity-type"
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
        >
          <SelectValue placeholder={select_entity_placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={EAccountingEntityType.Individual}>
            {individual_entity_type}
          </SelectItem>
          <SelectItem value={EAccountingEntityType.SoleTrader}>
            {sole_proprietorship_entity_type}
          </SelectItem>
          <SelectItem value={EAccountingEntityType.PrivateCompany}>
            {company_entity_type}
          </SelectItem>
        </SelectContent>
      </Select>
      <FieldError id={errorId} errors={error} />
    </Field>
  );
}
