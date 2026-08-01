import { Field, FieldError } from '@/shared/components/field';
import { Label } from '@/shared/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/select';
import { useTranslation } from 'react-i18next';

export interface CounterpartyTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: Array<{ message?: string } | undefined>;
  disabled?: boolean;
}

export function CounterpartyTypeSelect({
  value,
  onChange,
  error,
  disabled = false,
}: Readonly<CounterpartyTypeSelectProps>) {
  const { t } = useTranslation(['counterparty']);

  const errorId = 'counterparty-type-error';
  const hasError = Boolean(error?.some((item) => item?.message));

  const type_label = t('counterparty:type_label');
  const select_placeholder = t('counterparty:select_placeholder', {
    defaultValue: 'Select type',
  });
  const individual_label = t('counterparty:individual_label');
  const organization_label = t('counterparty:organization_label');

  return (
    <Field>
      <Label htmlFor="counterparty-type">{type_label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id="counterparty-type"
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className="w-full"
        >
          <SelectValue placeholder={select_placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="individual">{individual_label}</SelectItem>
          <SelectItem value="organization">{organization_label}</SelectItem>
        </SelectContent>
      </Select>
      <FieldError id={errorId} errors={error} />
    </Field>
  );
}
