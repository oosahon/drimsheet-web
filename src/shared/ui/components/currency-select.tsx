import countries from '@/shared/config/countries.json' with { type: 'json' };
import uiCurrencies from '@/shared/config/currencies.json' with { type: 'json' };
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/shared/ui/components/combobox';
import { Field, FieldError } from '@/shared/ui/components/field';
import { InputGroupAddon } from '@/shared/ui/components/input-group';
import { Label } from '@/shared/ui/components/label';
import { type ICurrencyDto } from '@/shared/utils/api/Api';
import { useEffect, useMemo, useState } from 'react';
import { CurrencyLogo } from './currency-logo';

export interface CurrencySelectProps {
  label: string;
  value: string;
  currencies: ICurrencyDto[];
  onChange: (value: string) => void;
  error?: Array<{ message?: string } | undefined>;
  displayCode?: boolean;
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
  currencies,
  onChange,
  error,
  displayCode = false,
}: CurrencySelectProps) {
  const mappedCurrencies = useMemo(() => {
    return currencies.map((c) => {
      const uiCurrency = uiCurrencies.find((uc) => uc.code === c.code);
      return {
        ...c,
        logo: uiCurrency?.logo || '',
      };
    });
  }, [currencies]);

  const [options, setOptions] = useState(mappedCurrencies);

  useEffect(() => {
    setOptions(mappedCurrencies);
  }, [mappedCurrencies]);

  const mapItemToStringLabel = (item: ICurrency | null) => {
    if (!item) return '';
    return displayCode ? item.code : item.name;
  };

  const handleOnInputValueChange = (val: string) => {
    const lowerVal = val.toLowerCase();

    const matchingCountries = countries.filter((c) =>
      c.name.toLowerCase().includes(lowerVal)
    );
    const matchingCurrencyCodes = new Set(
      matchingCountries.map((c) => c.currencyCode)
    );

    setOptions(
      mappedCurrencies.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerVal) ||
          c.code.toLowerCase().includes(lowerVal) ||
          c.symbol.toLowerCase().includes(lowerVal) ||
          matchingCurrencyCodes.has(c.code)
      )
    );
  };

  const selectedCurrency = mappedCurrencies.find((c) => c.code === value);

  return (
    <Field>
      <Label htmlFor="currency-select" className="text-muted-foreground">
        {label}
      </Label>
      <Combobox
        items={options}
        autoHighlight
        value={selectedCurrency ?? null}
        onValueChange={(val: ICurrency | null) => onChange(val ? val.code : '')}
        itemToStringLabel={mapItemToStringLabel}
        onInputValueChange={handleOnInputValueChange}
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
