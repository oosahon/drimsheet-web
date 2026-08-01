import type { UCounterpartyType } from '@/shared/lib/api/Api';

export interface ICounterpartyFormValues {
  name: string;
  type: UCounterpartyType;
}

export interface CounterpartyFormProps {
  onSubmit: (values: ICounterpartyFormValues) => void;
  initialValues?: Partial<ICounterpartyFormValues>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}
