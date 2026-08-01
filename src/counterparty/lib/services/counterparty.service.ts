import { purpleLedgerApi } from '@/shared/lib/api';
import type {
  IContractorCreateReq,
  ICounterpartyCreateReq,
  IEmployerCreateReq,
  IVendorCreateReq,
} from '@/shared/lib/api/Api';

export const counterpartyService = {
  async createCounterparty(data: ICounterpartyCreateReq) {
    const response =
      await purpleLedgerApi.counterparties.createCounterparty(data);
    return response.data;
  },

  async createVendor(data: IVendorCreateReq) {
    const response = await purpleLedgerApi.counterparties.createVendor(data);
    return response.data;
  },

  async createContractor(data: IContractorCreateReq) {
    const response =
      await purpleLedgerApi.counterparties.createContractor(data);
    return response.data;
  },

  async createEmployer(data: IEmployerCreateReq) {
    const response = await purpleLedgerApi.counterparties.createEmployer(data);
    return response.data;
  },
};
