import type { IAddressValues } from '@/counterparty/components/counterparty-address-fields';
import type { IJurisdictionDto, UCounterpartyType } from '@/shared/lib/api/Api';

export interface IEmployerFormValues {
  name: string;
  type: UCounterpartyType;
  displayName?: string;
  address: IAddressValues & {
    line1: string;
    city: string;
    countryCode: string;
  };
}

export interface EmployerFormProps {
  onSubmit: (values: IEmployerFormValues) => void;
  initialValues?: Partial<IEmployerFormValues>;
  jurisdictions?: IJurisdictionDto[];
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}
