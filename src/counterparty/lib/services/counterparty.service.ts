import { drimsheetApi } from '@/shared/lib/api';
import type {
  ICounterpartyCreateReq,
  IGetCounterpartiesQuery,
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
};
