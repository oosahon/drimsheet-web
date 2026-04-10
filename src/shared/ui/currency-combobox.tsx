import { Field, FieldError } from "@/shared/ui/field";
import { Label } from "@/shared/ui/label";
import currencies from "@/shared/config/currencies.json" with { type: "json" };
import { CoinsIcon } from "lucide-react";
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

export interface CurrencyComboBoxProps {
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
        backgroundSize: "200%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "200px",
        width: "24px",
        height: "24px",
      }}
    />
  );
}

export function CurrencyComboBox({
  label,
  value,
  onChange,
  error,
}: CurrencyComboBoxProps) {
  const [options, setOptions] = useState(currencies);

  const selectedCurrency = currencies.find(
    (currency) => currency.code === value,
  );

  return (
    <Field>
      <Label htmlFor="currency-select">{label}</Label>
      <Combobox
        items={options}
        autoHighlight
        value={selectedCurrency ?? null}
        onValueChange={(val: any) => onChange(val ? val.code : "")}
        itemToStringLabel={(item: any) => item?.name || ""}
        onInputValueChange={(val) => {
          setOptions(
            currencies.filter(
              (currency) =>
                currency.name.toLowerCase().includes(val.toLowerCase()) ||
                currency.code.toLowerCase().includes(val.toLowerCase()),
            ),
          );
        }}
      >
        <ComboboxInput id="currency-select" placeholder="Select a currency">
          <InputGroupAddon>
            <CurrencyLogo url={selectedCurrency?.logo} />
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxContent alignOffset={-28} className="w-60">
          <ComboboxEmpty>No currencies found.</ComboboxEmpty>
          <ComboboxList>
            {options.map((item) => (
              <ComboboxItem key={item.code} value={item}>
                <CurrencyLogo url={item.logo} />
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
