import type { FormikErrors, FormikTouched } from "formik";

interface Props<T> {
  errors: FormikErrors<T>;
  touched: FormikTouched<T>;
}

export default function useFieldErrorMessage<T>({ errors, touched }: Props<T>) {
  return (field: keyof T) => {
    const message = touched[field] ? (errors[field] as string | undefined | null) : undefined;
    return message ? [{ message }] : [];
  };
}
