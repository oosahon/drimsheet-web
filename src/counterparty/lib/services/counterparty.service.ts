import { drimsheetApi } from '@/shared/lib/api';
import type {
  IContractorCreateReq,
  ICounterpartyCreateReq,
  IEmployerCreateReq,
  IGetCounterpartiesQuery,
  IVendorCreateReq,
} from '@/shared/lib/api/Api';

export const counterpartyService = {
  async getCounterparties(query: IGetCounterpartiesQuery) {
    const response = await drimsheetApi.counterparties.getCounterparties(query);
    return response.data;
  },

  async createCounterparty(data: ICounterpartyCreateReq) {
    const response = await drimsheetApi.counterparties.createCounterparty(data);
    return response.data;
  },

  async createVendor(data: IVendorCreateReq) {
    const response = await drimsheetApi.counterparties.createVendor(data);
    return response.data;
  },

  async createContractor(data: IContractorCreateReq) {
    const response = await drimsheetApi.counterparties.createContractor(data);
    return response.data;
  },

  async createEmployer(data: IEmployerCreateReq) {
    const response = await drimsheetApi.counterparties.createEmployer(data);
    return response.data;
  },
};
