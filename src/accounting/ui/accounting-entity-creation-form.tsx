import { FISCAL_YEAR_STARTS } from '@/accounting/config/fiscal-year-start.config';
import { useFiscalYearWarning } from '@/accounting/hooks/use-fiscal-year-warning';
import { AccountingEntityTypeSelect } from '@/accounting/ui/accounting-entity-type-select';
import { FiscalDateSelect } from '@/accounting/ui/fiscal-date-select';
import { accountingEntityCreationFormValidation } from '@/accounting/ui/validations/accounting-entity.validations';
import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import { AlertTitle, WarningAlert } from '@/shared/ui/components/alert';
import { Button } from '@/shared/ui/components/button';
import { CountryComboBox } from '@/shared/ui/components/country-combobox';
import { CurrencySelect } from '@/shared/ui/components/currency-select';
import { FieldError, FieldGroup, FieldSet } from '@/shared/ui/components/field';
import {
  EAccountingEntityType,
  type ICurrencyDto,
  type IJurisdictionDto,
  type UJurisdictionCode,
} from '@/shared/utils/api/Api';
import {
  formatFiscalDate,
  getFiscalYearDateRange,
  shiftDateByDistance,
} from '@/shared/utils/date';
import { AppUsageModeRadioGroup } from '@/user/ui/app-usage-mode-radio-group';
import { useFormik } from 'formik';
import { AlertCircleIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export interface IAccountingEntityFormValues {
  name: string;
  entityType: string;
  countryCode: string;
  functionalCurrency: string;
  reportingCurrency: string;
  fiscalYearStart: Date | null;
  fiscalYearEnd: Date | null;
  appUsageMode: 'power_user' | 'non_power_user';
  accountingStandardCode: string;
}

export interface AccountingEntityCreationFormProps {
  onSubmit: (values: IAccountingEntityFormValues) => Promise<void> | void;
  loading?: boolean;
  currencies?: ICurrencyDto[];
  jurisdictions?: IJurisdictionDto[];
}

interface StepProps {
  formik: import('formik').FormikProps<IAccountingEntityFormValues>;
  getErrorMessage: (
    name: keyof IAccountingEntityFormValues
  ) => Array<{ message?: string } | undefined> | undefined;
}

function Step1({
  formik,
  getErrorMessage,
  jurisdictions,
  onNext,
}: StepProps & { jurisdictions: IJurisdictionDto[]; onNext: () => void }) {
  const [accountingStandard, setAccountingStandard] = useState('IFRS');

  const isComplete =
    !!formik.values.entityType &&
    !!formik.values.countryCode &&
    !formik.errors.entityType &&
    !formik.errors.countryCode;

  const handleCountryChange = (val: string) => {
    const selectedCountry = jurisdictions.find((c) => c.code === val);
    const expectedStart = FISCAL_YEAR_STARTS[val as UJurisdictionCode] || {
      month: 1,
      day: 1,
    };

    const functionalCurrency =
      selectedCountry?.currencyCode || formik.values.functionalCurrency;
    const reportingCurrency =
      selectedCountry?.currencyCode || formik.values.reportingCurrency;

    const { startDate, endDate } = getFiscalYearDateRange(
      expectedStart.month,
      expectedStart.day
    );

    const accountingStandardCode =
      selectedCountry?.accountingStandards[
        EAccountingEntityType.Individual
      ]?.[0] || 'IFRS';

    formik.setValues({
      ...formik.values,
      countryCode: val,
      functionalCurrency,
      reportingCurrency,
      fiscalYearStart: startDate,
      fiscalYearEnd: endDate,
      accountingStandardCode,
    });

    setAccountingStandard(
      selectedCountry?.accountingStandards[
        EAccountingEntityType.Individual
      ]?.join(', ') || 'IFRS'
    );
  };

  const showTaxWarning =
    formik.values.countryCode && formik.values.countryCode != 'NG';
  const showStandardsWarning = !accountingStandard.includes('IFRS');

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
          jurisdictions={jurisdictions}
          onChange={handleCountryChange}
          error={getErrorMessage('countryCode')}
        />
        {showStandardsWarning && (
          <WarningAlert>
            <AlertCircleIcon />
            <AlertTitle className="text-xs">
              {`Your selected country uses ${accountingStandard} standards, but we only support IFRS for now.`}
            </AlertTitle>
          </WarningAlert>
        )}
        {showTaxWarning && (
          <WarningAlert>
            <AlertCircleIcon />
            <AlertTitle className="text-xs">
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
  getFiscalYearEndErrorStr,
  currencies,
  onNext,
  onBack,
}: StepProps & {
  getFiscalYearStartErrorStr: () => string | undefined;
  getFiscalYearEndErrorStr: () => string | undefined;
  currencies: ICurrencyDto[];
  onNext: () => void;
  onBack: () => void;
}) {
  const isComplete =
    !!formik.values.functionalCurrency &&
    !!formik.values.reportingCurrency &&
    !!formik.values.fiscalYearStart &&
    !!formik.values.fiscalYearEnd &&
    !formik.errors.functionalCurrency &&
    !formik.errors.reportingCurrency &&
    !formik.errors.fiscalYearStart &&
    !formik.errors.fiscalYearEnd;

  const { reportingCurrency, fiscalYearStart, fiscalYearEnd, countryCode } =
    formik.values;

  const { expectedStart, showFiscalYearWarning } = useFiscalYearWarning(
    countryCode,
    fiscalYearStart
  );

  const formattedExpectedStart = formatFiscalDate(
    expectedStart.month,
    expectedStart.day
  );

  const fiscalYearError =
    getFiscalYearStartErrorStr() || getFiscalYearEndErrorStr();

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        {/* Hiding this because the jurisdiction will dictate the functional currency for now */}
        {/* <CurrencySelect
          label="What currency do you primarily transact in?"
          value={functionalCurrency}
          currencies={currencies}
          onChange={(val) => formik.setFieldValue('functionalCurrency', val)}
          error={getErrorMessage('functionalCurrency')}
        /> */}

        <CurrencySelect
          label="What currency should your reports use?"
          value={reportingCurrency}
          currencies={currencies}
          onChange={(val) => formik.setFieldValue('reportingCurrency', val)}
          error={getErrorMessage('reportingCurrency')}
        />

        <FieldSet>
          <div className="grid grid-cols-2 gap-6 mb-[-10px]">
            <FiscalDateSelect
              label="Start of financial year"
              value={fiscalYearStart}
              countryCode={countryCode}
              onChange={(val) => {
                const oldStart = formik.values.fiscalYearStart;
                const oldEnd = formik.values.fiscalYearEnd;
                formik.setFieldTouched('fiscalYearStart', true);
                formik.setFieldValue('fiscalYearStart', val);
                if (oldStart && oldEnd) {
                  const newEnd = shiftDateByDistance(val, oldStart, oldEnd);
                  formik.setFieldValue('fiscalYearEnd', newEnd);
                }
              }}
            />
            <FiscalDateSelect
              label="End of financial year"
              value={fiscalYearEnd}
              countryCode={countryCode}
              onChange={(val) => {
                formik.setFieldTouched('fiscalYearEnd', true);
                formik.setFieldValue('fiscalYearEnd', val);
              }}
            />
          </div>
          <FieldError
            errors={
              fiscalYearError ? [{ message: fiscalYearError }] : undefined
            }
          />
        </FieldSet>

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
  currencies = [],
  jurisdictions = [],
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
      fiscalYearStart: getFiscalYearDateRange(1, 1).startDate,
      fiscalYearEnd: getFiscalYearDateRange(1, 1).endDate,
      appUsageMode: 'non_power_user',
      accountingStandardCode: 'IFRS',
    },
    validationSchema: accountingEntityCreationFormValidation,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const getErrorMessage = useFieldErrorMessage({
    errors: formik.errors,
    touched: formik.touched,
  });

  const getFiscalYearStartErrorStr = () => {
    const err = formik.errors.fiscalYearStart;
    const touch = formik.touched.fiscalYearStart;
    if (touch && typeof err === 'string') return err;
    return undefined;
  };

  const getFiscalYearEndErrorStr = () => {
    const err = formik.errors.fiscalYearEnd;
    const touch = formik.touched.fiscalYearEnd;
    if (touch && typeof err === 'string') return err;
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
              jurisdictions={jurisdictions}
              onNext={() => handleNext(2)}
            />
          )}
          {step === 2 && (
            <Step2
              formik={formik}
              getErrorMessage={getErrorMessage}
              getFiscalYearStartErrorStr={getFiscalYearStartErrorStr}
              getFiscalYearEndErrorStr={getFiscalYearEndErrorStr}
              currencies={currencies}
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
