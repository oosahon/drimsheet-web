import { drimsheetApi } from '@/shared/lib/api';
import type { IPaymentEntryReq, IReceiptEntryReq } from '@/shared/lib/api/Api';

const journalEntryService = {
  async createPayment(payload: IPaymentEntryReq) {
    const res = await drimsheetApi.journalEntries.createPayment(payload);
    return res.data;
  },

  async createReceipt(payload: IReceiptEntryReq) {
    const res = await drimsheetApi.journalEntries.createReceipt(payload);
    return res.data;
  },
};

export default journalEntryService;
