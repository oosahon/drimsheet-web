import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/shared/ui/field";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";

export interface AppUsageModeRadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  error?: Array<{ message?: string } | undefined>;
}

export function AppUsageModeRadioGroup({
  value,
  onChange,
  error,
}: AppUsageModeRadioGroupProps) {
  return (
    <Field>
      <Label className="text-muted-foreground">Accounting mode</Label>
      <RadioGroup value={value} onValueChange={onChange} className="max-w-sm">
        <FieldLabel htmlFor="non_power_user" className="cursor-pointer">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle className="text-md font-medium text-bold">
                Automated (Recommended)
              </FieldTitle>
              <FieldDescription className="text-xs w-full text-muted-foreground">
                PurpleLedger handles the core accounting.
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="non_power_user" id="non_power_user" />
          </Field>
        </FieldLabel>

        <FieldLabel htmlFor="power_user" className="cursor-pointer">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle className="text-md font-medium text-bold">
                Manual
              </FieldTitle>
              <FieldDescription className="text-xs w-full text-muted-foreground">
                You handle journal entries and adjustments.
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="power_user" id="power_user" />
          </Field>
        </FieldLabel>
      </RadioGroup>
      <FieldError errors={error} />
    </Field>
  );
}
