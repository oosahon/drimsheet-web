import { Field, FieldError } from "@/shared/ui/field";
import { Label } from "@/shared/ui/label";
import countries from "@/shared/config/countries.json" with { type: "json" };
import { GlobeIcon } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/shared/ui/combobox";
import { InputGroupAddon } from "@/shared/ui/input-group";
import { useState } from "react";

export interface CountryComboBoxProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: Array<{ message?: string } | undefined>;
}

export function CountryComboBox({
  label,
  value,
  onChange,
  error,
}: CountryComboBoxProps) {
  const [options, setOptions] = useState(countries);

  const selectedCountry = countries.find((country) => country.code === value);

  return (
    <Field>
      <Label htmlFor="country-select">{label}</Label>
      <Combobox
        items={options}
        autoHighlight
        value={selectedCountry ?? null}
        onValueChange={(val: any) => onChange(val ? val.code : "")}
        itemToStringLabel={(item: any) => item?.name || ""}
        onInputValueChange={(val) => {
          setOptions(
            countries.filter((country) =>
              country.name.toLowerCase().includes(val.toLowerCase()),
            ),
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
              <ComboboxItem key={item.code} value={item}>
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
