import countries from '@/shared/config/countries.json' with { type: 'json' };
import currencies from '@/shared/config/currencies.json' with { type: 'json' };
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/shared/ui/combobox';
import { Field, FieldError } from '@/shared/ui/field';
import { InputGroupAddon } from '@/shared/ui/input-group';
import { Label } from '@/shared/ui/label';
import { CoinsIcon } from 'lucide-react';
import { useState } from 'react';

export interface CurrencySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: Array<{ message?: string } | undefined>;
  displayCode?: boolean;
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

interface ICurrency {
  code: string;
  name: string;
  symbol: string;
  logo: string;
  minorUnit: number;
}

export function CurrencySelect({
  label,
  value,
  onChange,
  error,
  displayCode = false,
}: CurrencySelectProps) {
  const [options, setOptions] = useState(currencies);

  const selectedCurrency = currencies.find((c) => c.code === value);

  return (
    <Field>
      <Label htmlFor="currency-select" className="text-muted-foreground">
        {label}
      </Label>
      <Combobox
        filter={null}
        items={options}
        autoHighlight
        value={selectedCurrency ?? null}
        onValueChange={(val: ICurrency | null) => onChange(val ? val.code : '')}
        itemToStringLabel={(item: ICurrency | null) => {
          if (!item) return '';
          return displayCode ? item.code : item.name;
        }}
        onInputValueChange={(val) => {
          const lowerVal = val.toLowerCase();

          const matchingCountries = countries.filter((c) =>
            c.name.toLowerCase().includes(lowerVal)
          );
          const matchingCurrencyCodes = new Set(
            matchingCountries.map((c) => c.currencyCode)
          );

          setOptions(
            currencies.filter(
              (c) =>
                c.name.toLowerCase().includes(lowerVal) ||
                c.code.toLowerCase().includes(lowerVal) ||
                c.symbol.toLowerCase().includes(lowerVal) ||
                matchingCurrencyCodes.has(c.code)
            )
          );
        }}
      >
        <ComboboxInput id="currency-select" placeholder="Select a currency">
          <InputGroupAddon>
            <CurrencyLogo url={selectedCurrency?.logo} />
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxContent alignOffset={-28} className="w-full">
          <ComboboxEmpty>No currencies found.</ComboboxEmpty>
          <ComboboxList>
            {options.map((item) => (
              <ComboboxItem key={item.code} value={item} className="z-400">
                <div className="flex items-center gap-2">
                  <CurrencyLogo url={item.logo} />
                  <span>{item.name}</span>
                  <span className="text-muted-foreground ml-auto">
                    {item.code} ({item.symbol})
                  </span>
                </div>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldError errors={error} />
    </Field>
  );
}
