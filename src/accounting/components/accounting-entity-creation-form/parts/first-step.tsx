import type { AccountingEntityCreationFormStep1Props } from '@/accounting/components/accounting-entity-creation-form/types';
import { AccountingEntityTypeSelect } from '@/accounting/components/accounting-entity-type-select';
import { FISCAL_YEAR_STARTS } from '@/accounting/lib/fiscal-year-start.config';
import { AlertTitle, WarningAlert } from '@/shared/components/alert';
import { Button } from '@/shared/components/button';
import { CountryComboBox } from '@/shared/components/country-combobox';
import { FieldGroup } from '@/shared/components/field';
import {
  EAccountingEntityType,
  type UJurisdictionCode,
} from '@/shared/lib/api/Api';
import { dateUtils } from '@/shared/lib/date';
import { AlertCircleIcon, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function AccountingEntityCreationFormStep1({
  formik,
  getErrorMessage,
  jurisdictions,
  onNext,
}: Readonly<AccountingEntityCreationFormStep1Props>) {
  const { t } = useTranslation('accounting');
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

    const { startDate, endDate } = dateUtils.getFiscalYearDateRange(
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
    formik.values.countryCode && formik.values.countryCode !== 'NG';
  const showStandardsWarning = !accountingStandard.includes('IFRS');

  const residence_country_label = t('residence_country_label');
  const unsupported_standard_warning = t('unsupported_standard_warning', {
    standard: accountingStandard,
  });
  const nigerian_tax_only_warning = t('nigerian_tax_only_warning');
  const next_button_label = t('next_button_label');

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
          label={residence_country_label}
          value={formik.values.countryCode}
          jurisdictions={jurisdictions}
          onChange={handleCountryChange}
          error={getErrorMessage('countryCode')}
        />
        {showStandardsWarning && (
          <WarningAlert>
            <AlertCircleIcon />
            <AlertTitle className="text-xs">
              {unsupported_standard_warning}
            </AlertTitle>
          </WarningAlert>
        )}
        {showTaxWarning && (
          <WarningAlert>
            <AlertCircleIcon />
            <AlertTitle className="text-xs">
              {nigerian_tax_only_warning}
            </AlertTitle>
          </WarningAlert>
        )}
      </FieldGroup>
      <div className="flex justify-end mt-4">
        <Button type="button" onClick={onNext} disabled={!isComplete}>
          {next_button_label}
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

export { AccountingEntityCreationFormStep1 };
