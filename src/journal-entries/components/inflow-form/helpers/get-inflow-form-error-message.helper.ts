import type { FormikErrors, FormikTouched } from 'formik';
import { getIn } from 'formik';

export function getInflowFormErrorMessage<TValues>(
  fieldName: string,
  touchedValues: FormikTouched<TValues>,
  errors: FormikErrors<TValues>
) {
  const touched = Boolean(getIn(touchedValues, fieldName));
  const error = getIn(errors, fieldName) as unknown;

  return touched && typeof error === 'string' ? [{ message: error }] : [];
}
