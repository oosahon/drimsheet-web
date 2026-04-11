import currencies from '@/shared/config/currencies.json' with { type: 'json' };
import { Field, FieldError } from '@/shared/ui/field';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { CoinsIcon } from 'lucide-react';

export interface CurrencySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: Array<{ message?: string } | undefined>;
}

function CurrencyLogo({ url }: { url?: string }) {
  if (!url) {
    return <CoinsIcon />;
  }
  return (
    <div
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: '200%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: '200px',
        width: '24px',
        height: '24px',
      }}
    />
  );
}

export function CurrencySelect({
  label,
  value,
  onChange,
  error,
}: CurrencySelectProps) {
  return (
    <Field>
      <Label htmlFor="currency-select" className="text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="currency-select">
          <SelectValue placeholder="Select a currency" />
        </SelectTrigger>
        <SelectContent className="w-60">
          {currencies.map((item) => (
            <SelectItem key={item.code} value={item.code}>
              <div className="flex items-center gap-2">
                <CurrencyLogo url={item.logo} />
                <span>{item.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={error} />
    </Field>
  );
}
