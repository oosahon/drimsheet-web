import { isValidFiscalYearDuration } from '@/shared/utils/date';
import dayjs from 'dayjs';
import * as yup from 'yup';

export const accountingEntityCreationFormValidation = yup.object({
  entityType: yup.string().required('Entity type is required'),
  countryCode: yup.string().required('Country is required'),
  functionalCurrency: yup.string().required('Functional currency is required'),
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
      'is-valid-duration',
      'The difference between the start and end dates MUST not be more than 23 months or less than one month.',
      function (value) {
        const { fiscalYearStart } = this.parent;
        if (!fiscalYearStart || !value) return true;
        return isValidFiscalYearDuration(
          fiscalYearStart as Date,
          value as Date
        );
      }
    ),
});
