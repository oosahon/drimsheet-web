import { drimsheetApi } from '@/shared/lib/api';
import { type IReceiptEntryReq } from '@/shared/lib/api/Api';

const journalEntryService = {
  async createReceipt(payload: IReceiptEntryReq) {
    const res = await drimsheetApi.journalEntries.createReceipt(payload);
    return res.data;
  },
};

export default journalEntryService;
