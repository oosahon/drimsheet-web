import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/shared/ui/field";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
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
import { useFormik } from "formik";
import * as yup from "yup";
import useFieldErrorMessage from "@/shared/hooks/use-field-error-message";
import { useState } from "react";

export interface IAccountingEntityFormValues {
  entityType: string;
  countryCode: string;
}

export interface IAccountingEntityFormProps {
  onSubmit: (values: IAccountingEntityFormValues) => void;
  loading?: boolean;
}

const validationSchema = yup.object({
  entityType: yup.string().required("Entity type is required"),
  countryCode: yup.string().required("Country is required"),
});

interface ICountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: Array<{ message?: string } | undefined>;
}

function CountrySelect({ value, onChange, error }: ICountrySelectProps) {
  const [options, setOptions] = useState(countries);

  const selectedCountry = countries.find((country) => country.code === value);

  return (
    <Field>
      <Label htmlFor="country-select">Where do you reside?</Label>
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

interface IEntityTypeRadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  error?: Array<{ message?: string } | undefined>;
}

function EntityTypeRadioGroup({
  value,
  onChange,
  error,
}: IEntityTypeRadioGroupProps) {
  return (
    <Field>
      <Label htmlFor="individual-entity">Who is this account for?</Label>
      <RadioGroup value={value} onValueChange={onChange} className="max-w-sm">
        <FieldLabel htmlFor="individual-entity" className="cursor-pointer">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle className="text-md font-medium text-bold">
                Individual
              </FieldTitle>
              <FieldDescription className="text-xs text-muted-foreground">
                Track cashflow and compute taxes.
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="individual" id="individual-entity" />
          </Field>
        </FieldLabel>
      </RadioGroup>
      <FieldError errors={error} />
    </Field>
  );
}

export function AccountingEntityOnboardingForm({
  onSubmit,
}: IAccountingEntityFormProps) {
  const formik = useFormik<IAccountingEntityFormValues>({
    initialValues: {
      entityType: "individual",
      countryCode: "NG",
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const getErrorMessage = useFieldErrorMessage({
    errors: formik.errors,
    touched: formik.touched,
  });

  return (
    <form id="accounting-entity-form" onSubmit={formik.handleSubmit}>
      <FieldGroup>
        <EntityTypeRadioGroup
          value={formik.values.entityType}
          onChange={(val) => formik.setFieldValue("entityType", val)}
          error={getErrorMessage("entityType")}
        />
        <CountrySelect
          value={formik.values.countryCode}
          onChange={(val) => formik.setFieldValue("countryCode", val)}
          error={getErrorMessage("countryCode")}
        />
      </FieldGroup>
    </form>
  );
}
