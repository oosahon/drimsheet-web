import { Field, FieldError } from '@/shared/ui/field';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

export interface AccountingEntityTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: Array<{ message?: string } | undefined>;
}

export function AccountingEntityTypeSelect({
  value,
  onChange,
  error,
}: AccountingEntityTypeSelectProps) {
  return (
    <Field>
      <Label htmlFor="individual-entity">Who is this account for?</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an entity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="individual">An Individual</SelectItem>
          <SelectItem value="sole_proprietorship">
            A Sole Proprietorship (coming soon)
          </SelectItem>
          <SelectItem value="company">A Company (coming soon)</SelectItem>
        </SelectContent>
      </Select>
      <FieldError errors={error} />
    </Field>
  );
}
