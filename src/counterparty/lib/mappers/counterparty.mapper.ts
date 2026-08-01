import type {
  IContractorFormValues,
  ICounterpartyFormValues,
  IEmployerFormValues,
  IVendorFormValues,
} from '@/counterparty/components';
import {
  ECounterpartyStatus,
  type IContractorCreateReq,
  type ICounterpartyCreateReq,
  type IEmployerCreateReq,
  type IVendorCreateReq,
} from '@/shared/lib/api/Api';

export const counterpartyMapper = {
  toCounterpartyCreateReq(
    values: ICounterpartyFormValues
  ): ICounterpartyCreateReq {
    return {
      name: values.name,
      type: values.type,
      status: ECounterpartyStatus.Active,
    };
  },

  toVendorCreateReq(values: IVendorFormValues): IVendorCreateReq {
    const address = values.address;
    const hasAddress =
      address &&
      (address.line1 ||
        address.line2 ||
        address.city ||
        address.region ||
        address.countryCode);

    return {
      name: values.name,
      type: values.type,
      status: ECounterpartyStatus.Active,
      address: hasAddress
        ? {
            line1: address.line1 ?? '',
            line2: address.line2 || undefined,
            city: address.city ?? '',
            region: address.region || undefined,
            countryCode: address.countryCode ?? '',
          }
        : undefined,
    };
  },

  toContractorCreateReq(values: IContractorFormValues): IContractorCreateReq {
    return {
      name: values.name,
      type: values.type,
      status: ECounterpartyStatus.Active,
      address: {
        line1: values.address.line1,
        line2: values.address.line2 || undefined,
        city: values.address.city,
        region: values.address.region || undefined,
        countryCode: values.address.countryCode,
      },
    };
  },

  toEmployerCreateReq(values: IEmployerFormValues): IEmployerCreateReq {
    return {
      name: values.name,
      type: values.type,
      status: ECounterpartyStatus.Active,
      displayName: values.displayName || null,
      address: {
        line1: values.address.line1,
        line2: values.address.line2 || undefined,
        city: values.address.city,
        region: values.address.region || undefined,
        countryCode: values.address.countryCode,
      },
    };
  },
};
