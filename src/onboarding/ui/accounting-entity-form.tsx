import { AccountingEntitySelect } from '@/onboarding/ui/accounting-entity-select';
import { AppUsageModeRadioGroup } from '@/onboarding/ui/app-usage-mode-radio-group';
import { FiscalYearStartSelect } from '@/onboarding/ui/fiscal-year-start-select';
import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import { AlertTitle, WarningAlert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { CountryComboBox } from '@/shared/ui/country-combobox';
import { CurrencySelect } from '@/shared/ui/currency-select';
import { FieldGroup } from '@/shared/ui/field';
import { useFormik } from 'formik';
import { AlertCircleIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import * as yup from 'yup';

export interface IAccountingEntityFormValues {
  name: string;
  entityType: string;
  countryCode: string;
  functionalCurrency: string;
  reportingCurrency: string;
  fiscalYearStart: { month: number; day: number };
  appUsageMode: 'power_user' | 'non_power_user';
}

export interface AccountingEntityOnboardingFormProps {
  onSubmit: (values: IAccountingEntityFormValues) => Promise<void> | void;
  loading?: boolean;
}

const validationSchema = yup.object({
  entityType: yup.string().required('Entity type is required'),
  countryCode: yup.string().required('Country is required'),
  functionalCurrency: yup.string().required('Functional currency is required'),
  reportingCurrency: yup.string().required('Reporting currency is required'),
  fiscalYearStart: yup
    .object({
      month: yup.number().required(),
      day: yup.number().required(),
    })
    .required('Fiscal year start is required'),
});

interface StepProps {
  formik: import('formik').FormikProps<IAccountingEntityFormValues>;
  getErrorMessage: (
    name: keyof IAccountingEntityFormValues
  ) => Array<{ message?: string } | undefined> | undefined;
}

function Step1({
  formik,
  getErrorMessage,
  onNext,
}: StepProps & { onNext: () => void }) {
  const isComplete =
    !!formik.values.entityType &&
    !!formik.values.countryCode &&
    !formik.errors.entityType &&
    !formik.errors.countryCode;

  const showTaxWarning = formik.values.countryCode != 'NG';

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <AccountingEntitySelect
          value={formik.values.entityType}
          // NB: only individual is supported for now
          onChange={() => {}}
          error={getErrorMessage('entityType')}
        />
        <CountryComboBox
          label="Where do you reside?"
          value={formik.values.countryCode}
          onChange={(val) => formik.setFieldValue('countryCode', val)}
          error={getErrorMessage('countryCode')}
        />
        {showTaxWarning && (
          <WarningAlert>
            <AlertCircleIcon />
            <AlertTitle>
              Tax computations are only supported for Nigerian residents.
            </AlertTitle>
          </WarningAlert>
        )}
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

  const { functionalCurrency, reportingCurrency, fiscalYearStart } =
    formik.values;

  const showFiscalYearWarning = useMemo(() => {
    return fiscalYearStart.month !== 1 || fiscalYearStart.day !== 1;
  }, [fiscalYearStart]);

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <CurrencySelect
          label="What currency do you primarily transact in?"
          value={functionalCurrency}
          onChange={(val) => formik.setFieldValue('functionalCurrency', val)}
          error={getErrorMessage('functionalCurrency')}
        />

        <CurrencySelect
          label="What currency should we use for your reports?"
          value={reportingCurrency}
          onChange={(val) => formik.setFieldValue('reportingCurrency', val)}
          error={getErrorMessage('reportingCurrency')}
        />

        <FiscalYearStartSelect
          value={fiscalYearStart}
          onChange={(val) => formik.setFieldValue('fiscalYearStart', val)}
          error={getFiscalYearStartErrorStr()}
        />

        {showFiscalYearWarning && (
          <WarningAlert>
            <AlertCircleIcon />
            <AlertTitle>
              Unless approved by the tax authorities, your fiscal year must
              start on January 1st.
            </AlertTitle>
          </WarningAlert>
        )}
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
        <AppUsageModeRadioGroup
          value={formik.values.appUsageMode}
          onChange={(val) => formik.setFieldValue('appUsageMode', val)}
          error={getErrorMessage('appUsageMode')}
        />
      </FieldGroup>
      <div className="flex justify-between mt-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onBack}
        >
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
  const [direction, setDirection] = useState<'right' | 'left'>('right');

  const handleNext = (nextStep: number) => {
    setDirection('right');
    setStep(nextStep);
  };

  const handleBack = (prevStep: number) => {
    setDirection('left');
    setStep(prevStep);
  };

  const formik = useFormik<IAccountingEntityFormValues>({
    initialValues: {
      // This was removed to simplify the form. It will be injected by the caller
      name: '',
      entityType: 'individual',
      countryCode: 'NG',
      functionalCurrency: 'NGN',
      reportingCurrency: 'NGN',
      fiscalYearStart: {
        month: 1,
        day: 1,
      },
      appUsageMode: 'non_power_user',
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

    if (typeof errs === 'string') {
      return errs;
    }

    const fieldErrs = errs as { month?: string; day?: string };
    const fieldTouch = touch as { month?: boolean; day?: boolean } | undefined;

    if (fieldTouch?.month && typeof fieldErrs.month === 'string') {
      return fieldErrs.month;
    }
    if (fieldTouch?.day && typeof fieldErrs.day === 'string') {
      return fieldErrs.day;
    }

    return undefined;
  };

  return (
    <div className="min-w-xs max-w-full">
      <form id="accounting-entity-form" onSubmit={formik.handleSubmit}>
        <div
          key={step}
          className={
            direction === 'right'
              ? 'animate-slide-step-right'
              : 'animate-slide-step-left'
          }
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
    </div>
  );
}

export { AccountingEntityOnboardingForm };
