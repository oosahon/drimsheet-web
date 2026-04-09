import { Badge } from "@/shared/ui/badge";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/shared/ui/field";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";

export function AccountingEntityRadioGroup() {
  return (
    <RadioGroup defaultValue="plus" className="max-w-sm">
      <FieldLabel htmlFor="plus-plan" className="cursor-pointer">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle className="text-md font-medium text-bold">
              Individual
            </FieldTitle>
            <FieldDescription className="text-xs text-muted-foreground">
              For individuals who want to track their cashflow and taxes.
            </FieldDescription>
          </FieldContent>
          <RadioGroupItem value="plus" id="plus-plan" />
        </Field>
      </FieldLabel>

      <FieldLabel htmlFor="pro-plan" className="cursor-pointer opacity-50">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Sole Proprietorship</FieldTitle>
            <FieldDescription>
              <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                Coming soon
              </Badge>
            </FieldDescription>
          </FieldContent>
          <RadioGroupItem value="pro" id="pro-plan" />
        </Field>
      </FieldLabel>

      <FieldLabel
        htmlFor="enterprise-plan"
        className="cursor-pointer opacity-50"
      >
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Corporation</FieldTitle>
            <FieldDescription>
              <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                Coming soon
              </Badge>
            </FieldDescription>
          </FieldContent>
          <RadioGroupItem value="enterprise" id="enterprise-plan" />
        </Field>
      </FieldLabel>
    </RadioGroup>
  );
}
