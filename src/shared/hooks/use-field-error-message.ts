import { getIn, type FormikErrors, type FormikTouched } from 'formik';

interface Props<T> {
  errors: FormikErrors<T>;
  touched: FormikTouched<T>;
}

export function useFieldErrorMessage<T>({ errors, touched }: Props<T>) {
  return (field: string) => {
    const isTouched = Boolean(getIn(touched, field));
    const error = getIn(errors, field) as unknown;

    return isTouched && typeof error === 'string' ? [{ message: error }] : [];
  };
}
