import type { IAddressValues } from '@/counterparty/components/counterparty-address-fields';
import type { IJurisdictionDto, UCounterpartyType } from '@/shared/lib/api/Api';

export interface IContractorFormValues {
  name: string;
  type: UCounterpartyType;
  displayName?: string;
  address: IAddressValues & {
    line1: string;
    city: string;
    countryCode: string;
  };
}

export interface ContractorFormProps {
  onSubmit: (values: IContractorFormValues) => void;
  initialValues?: Partial<IContractorFormValues>;
  jurisdictions?: IJurisdictionDto[];
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}
