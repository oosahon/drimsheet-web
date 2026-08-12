import { purpleLedgerApi } from '@/shared/lib/api';
import { type IReceiptEntryReq } from '@/shared/lib/api/Api';

const journalEntryService = {
  async createReceipt(payload: IReceiptEntryReq) {
    const res = await purpleLedgerApi.journalEntries.createReceipt(payload);
    return res.data;
  },
};

export default journalEntryService;
