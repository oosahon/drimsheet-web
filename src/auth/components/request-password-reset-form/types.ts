import type { ComponentProps } from 'react';

export interface IRequestPasswordResetFormValues {
  email: string;
}

export interface RequestPasswordResetFormProps extends Omit<
  ComponentProps<'form'>,
  'onSubmit'
> {
  onSubmit: (values: IRequestPasswordResetFormValues) => void | Promise<void>;
  loading: boolean;
}
