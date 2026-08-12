import type { FormikErrors, FormikTouched } from 'formik';
import { describe, expect, it } from 'vitest';
import { getInflowFormErrorMessage } from './get-inflow-form-error-message.helper';

interface ITestFormValues {
  payer: {
    name: string;
  };
}

describe('getInflowFormErrorMessage', () => {
  it('projects a touched nested Formik error into the field error shape', () => {
    const touched: FormikTouched<ITestFormValues> = {
      payer: { name: true },
    };
    const errors: FormikErrors<ITestFormValues> = {
      payer: { name: 'Payer is required' },
    };

    expect(getInflowFormErrorMessage('payer.name', touched, errors)).toEqual([
      { message: 'Payer is required' },
    ]);
  });

  it('returns no message when the field is untouched or has no string error', () => {
    expect(
      getInflowFormErrorMessage<ITestFormValues>(
        'payer.name',
        { payer: { name: false } },
        { payer: { name: 'Payer is required' } }
      )
    ).toEqual([]);
    expect(
      getInflowFormErrorMessage<ITestFormValues>(
        'payer.name',
        { payer: { name: true } },
        {}
      )
    ).toEqual([]);
  });
});
