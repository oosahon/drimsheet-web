import type { IJurisdictionDto } from '@/shared/lib/api/Api';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import type { IAccountingEntityFormValues } from './types';

const DEFAULT_MAX_FISCAL_MONTHS = 23;

interface IAccountingEntityCreationValidationMessages {
  fiscalYearMinDuration: string;
  getFiscalYearMaxDuration: (
    maxFiscalMonths: number,
    country: string
  ) => string;
}

function createAccountingEntityCreationFormValidation(
  jurisdictions: IJurisdictionDto[],
  messages: IAccountingEntityCreationValidationMessages
) {
  return yup.object({
    entityType: yup.string().required('Entity type is required'),
    countryCode: yup.string().required('Country is required'),
    functionalCurrency: yup
      .string()
      .required('Functional currency is required'),
    reportingCurrency: yup.string().required('Reporting currency is required'),
    fiscalYearStart: yup
      .date()
      .nullable()
      .required('Fiscal year start is required')
      .test(
        'is-recent',
        'Start date must not be less than two years from the current date',
        function (value) {
          if (!value) return true;
          return !dayjs(value).isBefore(dayjs().subtract(2, 'years'), 'day');
        }
      ),
    fiscalYearEnd: yup
      .date()
      .nullable()
      .required('Fiscal year end is required')
      .test(
        'is-valid-min-duration',
        messages.fiscalYearMinDuration,
        function (value) {
          const { fiscalYearStart } = this
            .parent as IAccountingEntityFormValues;
          if (!fiscalYearStart || !value) return true;

          const minimumEndDate = dayjs(fiscalYearStart)
            .add(1, 'month')
            .subtract(1, 'day');

          return !dayjs(value).isBefore(minimumEndDate, 'day');
        }
      )
      .test('is-valid-max-duration', function (value) {
        const { countryCode, fiscalYearStart } = this
          .parent as IAccountingEntityFormValues;
        if (!fiscalYearStart || !value) return true;

        const jurisdiction = jurisdictions.find(
          ({ code }) => code === countryCode
        );
        const maxFiscalMonths =
          jurisdiction?.maxFiscalMonths ?? DEFAULT_MAX_FISCAL_MONTHS;
        const country = jurisdiction?.name ?? countryCode;
        const maximumEndDate = dayjs(fiscalYearStart)
          .add(maxFiscalMonths, 'month')
          .subtract(1, 'day');

        if (!dayjs(value).isAfter(maximumEndDate, 'day')) return true;

        return this.createError({
          message: messages.getFiscalYearMaxDuration(maxFiscalMonths, country),
        });
      }),
  });
}

function useAccountingEntityCreationFormValidation(
  jurisdictions: IJurisdictionDto[]
) {
  const { t } = useTranslation('accounting');

  const fiscal_year_min_duration_error = t('fiscal_year_min_duration_error');

  return useMemo(
    () =>
      createAccountingEntityCreationFormValidation(jurisdictions, {
        fiscalYearMinDuration: fiscal_year_min_duration_error,
        getFiscalYearMaxDuration: (maxFiscalMonths, country) =>
          t('fiscal_year_max_duration_error', { country, maxFiscalMonths }),
      }),
    [fiscal_year_min_duration_error, jurisdictions, t]
  );
}

export {
  createAccountingEntityCreationFormValidation,
  useAccountingEntityCreationFormValidation,
};
