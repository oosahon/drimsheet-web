import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/shared/ui/field";
import { formatFiscalDate } from "@/shared/utils/date";
import { Label } from "@/shared/ui/label";
import { useFormik } from "formik";
import * as yup from "yup";
import useFieldErrorMessage from "@/shared/hooks/use-field-error-message";
import { CountryComboBox } from "@/shared/ui/country-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { CurrencySelect } from "@/shared/ui/currency-select";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Calendar } from "@/shared/ui/calendar";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Button } from "@/shared/ui/button";
import { ArrowLeft, ArrowRight, Calendar1 } from "lucide-react";

export interface IAccountingEntityFormValues {
  entityType: string;
  countryCode: string;
  functionalCurrency: string;
  reportingCurrency: string;
  fiscalYearStart: { month: number; day: number };
}

export interface AccountingEntityOnboardingFormProps {
  onSubmit: (values: IAccountingEntityFormValues) => void;
  loading?: boolean;
}

const validationSchema = yup.object({
  entityType: yup.string().required("Entity type is required"),
  countryCode: yup.string().required("Country is required"),
  functionalCurrency: yup.string().required("Functional currency is required"),
  reportingCurrency: yup.string().required("Reporting currency is required"),
  fiscalYearStart: yup.object({
    month: yup.number().required(),
    day: yup.number().required()
  }).required("Fiscal year start is required"),
});

interface EntitySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: Array<{ message?: string } | undefined>;
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
      <Label htmlFor="individual-entity" className="text-muted-foreground">
        Accounting mode
      </Label>
      <RadioGroup value={value} onValueChange={onChange} className="max-w-sm">
        <FieldLabel htmlFor="individual-entity" className="cursor-pointer">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle className="text-md font-medium text-bold">
                Automated (Recommended)
              </FieldTitle>
              <FieldDescription className="text-xs w-full text-muted-foreground">
                PurpleLedger handles the core accounting.
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="individual" id="individual-entity" />
          </Field>
        </FieldLabel>

        <FieldLabel htmlFor="individual-entity" className="cursor-pointer">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle className="text-md font-medium text-bold">
                Manual
              </FieldTitle>
              <FieldDescription className="text-xs w-full text-muted-foreground">
                You handle journal entries and adjustments.
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

function EntitySelect({ value, onChange, error }: EntitySelectProps) {
  return (
    <Field>
      <Label htmlFor="individual-entity">Who is this account for?</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an entity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="individual">An Individual</SelectItem>
          <SelectItem value="business">
            A Sole Proprietorship (coming soon)
          </SelectItem>
          <SelectItem value="business">A Company (coming soon)</SelectItem>
        </SelectContent>
      </Select>
      <FieldError errors={error} />
    </Field>
  );
}


interface IFiscalYearStartSelectProps {
  value: { month: number; day: number };
  onChange: (value: { month: number; day: number }) => void;
  error?: string;
}

function FiscalYearStartSelect({ value, onChange, error }: IFiscalYearStartSelectProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  const displayValue = value ? formatFiscalDate(value.month, value.day) : "Select a financial start date";
  const selectedDate = value ? new Date(2024, value.month - 1, value.day) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange({ month: date.getMonth() + 1, day: date.getDate() });
      setShowCalendar(false);
    }
  };

  return (
    <Field>
      <Label>When does your financial year start?</Label>
      <Popover open={showCalendar} onOpenChange={setShowCalendar}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={"w-full justify-start text-left font-normal " + (!value ? "text-muted-foreground" : "")}>
            <Calendar1 className="mr-2 h-4 w-4" />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar 
            mode="single" 
            selected={selectedDate}
            onSelect={handleSelect}
            defaultMonth={selectedDate}
            formatters={{
              formatMonthCaption: (date) => date.toLocaleString(undefined, { month: "long" })
            }}
          />
        </PopoverContent>
      </Popover>
      <FieldError errors={error ? [{ message: error }] : undefined} />
    </Field>
  );
}


interface StepProps {
  formik: import("formik").FormikProps<IAccountingEntityFormValues>;
  getErrorMessage: (name: string) => Array<{ message?: string } | undefined> | undefined;
}

function Step1({ formik, getErrorMessage, onNext }: StepProps & { onNext: () => void }) {
  const isComplete =
    !!formik.values.entityType &&
    !!formik.values.countryCode &&
    !formik.errors.entityType &&
    !formik.errors.countryCode;

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <EntitySelect
          value={formik.values.entityType}
          onChange={(val) => formik.setFieldValue("entityType", val)}
          error={getErrorMessage("entityType")}
        />
        <CountryComboBox
          label="Where do you reside?"
          value={formik.values.countryCode}
          onChange={(val) => formik.setFieldValue("countryCode", val)}
          error={getErrorMessage("countryCode")}
        />
      </FieldGroup>
      <div className="flex justify-end mt-4">
        <Button type="button" onClick={onNext} disabled={!isComplete}>
          Next
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

function Step2({
  formik,
  getErrorMessage,
  getFiscalYearStartErrorStr,
  onNext,
  onBack,
}: StepProps & {
  getFiscalYearStartErrorStr: () => string | undefined;
  onNext: () => void;
  onBack: () => void;
}) {
  const isComplete =
    !!formik.values.functionalCurrency &&
    !!formik.values.reportingCurrency &&
    !!formik.values.fiscalYearStart &&
    !formik.errors.functionalCurrency &&
    !formik.errors.reportingCurrency &&
    !getFiscalYearStartErrorStr();

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <CurrencySelect
          label="What currency do you primarily transact in?"
          value={formik.values.functionalCurrency}
          onChange={(val) => formik.setFieldValue("functionalCurrency", val)}
          error={getErrorMessage("functionalCurrency")}
        />

        <CurrencySelect
          label="What currency should we use for your reports?"
          value={formik.values.reportingCurrency}
          onChange={(val) => formik.setFieldValue("reportingCurrency", val)}
          error={getErrorMessage("reportingCurrency")}
        />

        <FiscalYearStartSelect
          value={formik.values.fiscalYearStart}
          onChange={(val) => formik.setFieldValue("fiscalYearStart", val)}
          error={getFiscalYearStartErrorStr()}
        />
      </FieldGroup>
      <div className="flex justify-between mt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft />
          Back
        </Button>
        <Button type="button" onClick={onNext} disabled={!isComplete}>
          Next
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

function Step3({
  formik,
  getErrorMessage,
  onBack,
  isSubmitting,
}: StepProps & { onBack: () => void; isSubmitting?: boolean }) {
  const isComplete = formik.isValid;
  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <EntityTypeRadioGroup
          value={formik.values.entityType}
          onChange={(val) => formik.setFieldValue("entityType", val)}
          error={getErrorMessage("entityType")}
        />
      </FieldGroup>
      <div className="flex justify-between mt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft />
          Back
        </Button>
        <Button type="submit" loading={!isComplete || isSubmitting}>
          Complete setup
        </Button>
      </div>
    </div>
  );
}

function AccountingEntityOnboardingForm({
  onSubmit,
  loading,
}: AccountingEntityOnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"right" | "left">("right");

  const handleNext = (nextStep: number) => {
    setDirection("right");
    setStep(nextStep);
  };

  const handleBack = (prevStep: number) => {
    setDirection("left");
    setStep(prevStep);
  };

  const formik = useFormik<IAccountingEntityFormValues>({
    initialValues: {
      entityType: "individual",
      countryCode: "NG",
      functionalCurrency: "NGN",
      reportingCurrency: "NGN",
      fiscalYearStart: {
        month: 1,
        day: 1
      }
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

  const getFiscalYearStartErrorStr = () => {
    const errs = formik.errors.fiscalYearStart;
    const touch = formik.touched.fiscalYearStart;
    if (!errs) return undefined;

    if (typeof errs === "string") {
      return errs;
    }

    const fieldErrs = errs as { month?: string; day?: string };
    const fieldTouch = touch as { month?: boolean; day?: boolean } | undefined;

    if (fieldTouch?.month && typeof fieldErrs.month === "string") {
      return fieldErrs.month;
    }
    if (fieldTouch?.day && typeof fieldErrs.day === "string") {
      return fieldErrs.day;
    }

    return undefined;
  };

  return (
    <form id="accounting-entity-form" onSubmit={formik.handleSubmit}>
      <div 
        key={step} 
        className={direction === "right" ? "animate-slide-step-right" : "animate-slide-step-left"}
      >
        {step === 1 && (
          <Step1
            formik={formik}
            getErrorMessage={getErrorMessage}
            onNext={() => handleNext(2)}
          />
        )}
        {step === 2 && (
          <Step2
            formik={formik}
            getErrorMessage={getErrorMessage}
            getFiscalYearStartErrorStr={getFiscalYearStartErrorStr}
            onNext={() => handleNext(3)}
            onBack={() => handleBack(1)}
          />
        )}
        {step === 3 && (
          <Step3
            formik={formik}
            getErrorMessage={getErrorMessage}
            onBack={() => handleBack(2)}
            isSubmitting={loading}
          />
        )}
      </div>
    </form>
  );
}

export { AccountingEntityOnboardingForm };
