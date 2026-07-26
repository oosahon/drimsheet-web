import { Field, FieldError } from '@/shared/components/field';
import { Label } from '@/shared/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/select';

export interface AccountingEntityTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: Array<{ message?: string } | undefined>;
}

export function AccountingEntityTypeSelect({
  value,
  onChange,
  error,
}: Readonly<AccountingEntityTypeSelectProps>) {
  const errorId = 'accounting-entity-type-error';
  const hasError = Boolean(error?.some((item) => item?.message));

  return (
    <Field>
      <Label htmlFor="accounting-entity-type">Who is this account for?</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id="accounting-entity-type"
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
        >
          <SelectValue placeholder="Select an entity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="individual">An Individual</SelectItem>
          <SelectItem value="sole_proprietorship" disabled>
            A Sole Proprietorship (coming soon)
          </SelectItem>
          <SelectItem value="company" disabled>
            A Company (coming soon)
          </SelectItem>
        </SelectContent>
      </Select>
      <FieldError id={errorId} errors={error} />
    </Field>
  );
}
