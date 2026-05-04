import countries from '@/shared/config/countries.json' with { type: 'json' };
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/shared/ui/combobox';
import { Field, FieldError } from '@/shared/ui/components/field';
import { Label } from '@/shared/ui/components/label';
import { InputGroupAddon } from '@/shared/ui/input-group';
import { type IJurisdictionDto } from '@/shared/utils/api/Api';
import { GlobeIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export interface CountryComboBoxProps {
  label: string;
  value: string;
  jurisdictions: IJurisdictionDto[];
  onChange: (value: string) => void;
  error?: Array<{ message?: string } | undefined>;
}

interface ICountry {
  code: string;
  name: string;
  flag: string;
}

export function CountryComboBox({
  label,
  value,
  jurisdictions,
  onChange,
  error,
}: CountryComboBoxProps) {
  const mappedCountries = useMemo(() => {
    return jurisdictions.map((c) => {
      const uiCountry = countries.find((uc) => uc.code === c.code);
      return {
        ...c,
        flag: uiCountry?.flag || '🏳️',
      };
    });
  }, [jurisdictions]);

  const [options, setOptions] = useState(mappedCountries);

  useEffect(() => {
    setOptions(mappedCountries);
  }, [mappedCountries]);

  const selectedCountry = mappedCountries.find(
    (country) => country.code === value
  );

  return (
    <Field>
      <Label htmlFor="country-select">{label}</Label>
      <Combobox
        items={options}
        autoHighlight
        value={selectedCountry ?? null}
        onValueChange={(val: ICountry | null) => onChange(val ? val.code : '')}
        itemToStringLabel={(item: ICountry | null) => item?.name || ''}
        onInputValueChange={(val) => {
          setOptions(
            mappedCountries.filter((country) =>
              country.name.toLowerCase().includes(val.toLowerCase())
            )
          );
        }}
      >
        <ComboboxInput id="country-select" placeholder="Select a country">
          <InputGroupAddon>
            {selectedCountry ? (
              <span className="text-xl leading-none">
                {selectedCountry.flag}
              </span>
            ) : (
              <GlobeIcon />
            )}
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxContent alignOffset={-28} className="w-60">
          <ComboboxEmpty>No countries found.</ComboboxEmpty>
          <ComboboxList>
            {options.map((item) => (
              <ComboboxItem key={item.code} value={item} className="z-400">
                <span className="mr-2 text-base leading-none">{item.flag}</span>
                {item.name}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldError errors={error} />
    </Field>
  );
}
