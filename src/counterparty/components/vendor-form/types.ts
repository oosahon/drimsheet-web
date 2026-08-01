import type { IAddressValues } from '@/counterparty/components/counterparty-address-fields';
import type { IJurisdictionDto, UCounterpartyType } from '@/shared/lib/api/Api';

export interface IVendorFormValues {
  name: string;
  type: UCounterpartyType;
  displayName: string;
  address: IAddressValues;
}

export interface VendorFormProps {
  onSubmit: (values: IVendorFormValues) => void;
  initialValues?: Partial<IVendorFormValues>;
  jurisdictions?: IJurisdictionDto[];
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}
