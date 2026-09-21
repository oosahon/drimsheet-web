import { drimsheetApi } from '@/shared/lib/api';
import type {
  IGetJournalEntriesQuery,
  IPaymentEntryReq,
  IReceiptEntryReq,
  ITransferEntryReq,
} from '@/shared/lib/api/Api';

const journalEntryService = {
  async getJournalEntries(query: IGetJournalEntriesQuery) {
    const res = await drimsheetApi.journalEntries.getJournalEntries(query);
    return res.data;
  },

  async createPayment(payload: IPaymentEntryReq) {
    const res = await drimsheetApi.journalEntries.createPayment(payload);
    return res.data;
  },

  async createReceipt(payload: IReceiptEntryReq) {
    const res = await drimsheetApi.journalEntries.createReceipt(payload);
    return res.data;
  },

  async createTransfer(payload: ITransferEntryReq) {
    const res = await drimsheetApi.journalEntries.createTransfer(payload);
    return res.data;
  },
};

export default journalEntryService;
