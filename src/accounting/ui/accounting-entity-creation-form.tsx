import { FISCAL_YEAR_STARTS } from '@/accounting/config/fiscal-year-start.config';
import { useFiscalYearWarning } from '@/accounting/hooks/use-fiscal-year-warning';
import { AccountingEntityTypeSelect } from '@/accounting/ui/accounting-entity-type-select';
import { FiscalYearStartSelect } from '@/accounting/ui/fiscal-year-start-select';
import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import { AlertTitle, WarningAlert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { CountryComboBox } from '@/shared/ui/country-combobox';
import { CurrencySelect } from '@/shared/ui/currency-select';
import { FieldGroup } from '@/shared/ui/field';
import {
  type ICurrencyDto,
  type IJurisdictionDto,
  type UJurisdictionCode,
} from '@/shared/utils/api/Api';
import { formatFiscalDate } from '@/shared/utils/date';
import { AppUsageModeRadioGroup } from '@/user/ui/app-usage-mode-radio-group';
import { useFormik } from 'formik';
import { AlertCircleIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
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

export interface AccountingEntityCreationFormProps {
  onSubmit: (values: IAccountingEntityFormValues) => Promise<void> | void;
  loading?: boolean;
  currenciesData?: ICurrencyDto[];
  countriesData?: IJurisdictionDto[];
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
  countriesData,
  onNext,
}: StepProps & { countriesData: IJurisdictionDto[]; onNext: () => void }) {
  const isComplete =
    !!formik.values.entityType &&
    !!formik.values.countryCode &&
    !formik.errors.entityType &&
    !formik.errors.countryCode;

  const handleCountryChange = (val: string) => {
    const selectedCountry = countriesData.find((c) => c.code === val);
    const expectedStart = FISCAL_YEAR_STARTS[val as UJurisdictionCode] || {
      month: 1,
      day: 1,
    };

    const functionalCurrency =
      selectedCountry?.currencyCode || formik.values.functionalCurrency;
    const reportingCurrency =
      selectedCountry?.currencyCode || formik.values.reportingCurrency;

    formik.setValues({
      ...formik.values,
      countryCode: val,
      functionalCurrency,
      reportingCurrency,
      fiscalYearStart: expectedStart,
    });
  };

  const showTaxWarning = formik.values.countryCode != 'NG';

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <AccountingEntityTypeSelect
          value={formik.values.entityType}
          // NB: only individual is supported for now
          onChange={() => {}}
          error={getErrorMessage('entityType')}
        />
        <CountryComboBox
          label="Where do you reside?"
          value={formik.values.countryCode}
          countriesData={countriesData}
          onChange={handleCountryChange}
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
  currenciesData,
  onNext,
  onBack,
}: StepProps & {
  getFiscalYearStartErrorStr: () => string | undefined;
  currenciesData: ICurrencyDto[];
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

  const {
    functionalCurrency,
    reportingCurrency,
    fiscalYearStart,
    countryCode,
  } = formik.values;

  const { expectedStart, showFiscalYearWarning } = useFiscalYearWarning(
    countryCode,
    fiscalYearStart
  );

  const formattedExpectedStart = formatFiscalDate(
    expectedStart.month,
    expectedStart.day
  );

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <CurrencySelect
          label="What currency do you primarily transact in?"
          value={functionalCurrency}
          currenciesData={currenciesData}
          onChange={(val) => formik.setFieldValue('functionalCurrency', val)}
          error={getErrorMessage('functionalCurrency')}
        />

        <CurrencySelect
          label="What currency should we use for your reports?"
          value={reportingCurrency}
          currenciesData={currenciesData}
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
              start on {formattedExpectedStart}.
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

function AccountingEntityCreationForm({
  onSubmit,
  loading,
  currenciesData = [],
  countriesData = [],
}: AccountingEntityCreationFormProps) {
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
              countriesData={countriesData}
              onNext={() => handleNext(2)}
            />
          )}
          {step === 2 && (
            <Step2
              formik={formik}
              getErrorMessage={getErrorMessage}
              getFiscalYearStartErrorStr={getFiscalYearStartErrorStr}
              currenciesData={currenciesData}
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

export { AccountingEntityCreationForm };
