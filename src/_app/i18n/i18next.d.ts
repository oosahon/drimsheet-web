import ledgerAccountsEn from '@/account/i18n/locales/en/ledger-accounts.json';
import accountingEn from '@/accounting/i18n/locales/en/accounting.json';
import authEn from '@/auth/i18n/locales/en/auth.json';
import bookkeepingEn from '@/bookkeeping/i18n/locales/en/bookkeeping.json';
import counterpartyEn from '@/counterparty/i18n/locales/en/counterparty.json';
import journalEntriesEn from '@/journal-entries/i18n/locales/en/journal-entries.json';
import apiErrorsEn from '@/shared/i18n/locales/en/api-errors.json';
import sharedEn from '@/shared/i18n/locales/en/shared.json';
import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'shared';
    resources: {
      auth: typeof authEn;
      shared: typeof sharedEn;
      bookkeeping: typeof bookkeepingEn;
      counterparty: typeof counterpartyEn;
      'journal-entries': typeof journalEntriesEn;
      'ledger-accounts': typeof ledgerAccountsEn;
      accounting: typeof accountingEn;
      'api-errors': typeof apiErrorsEn;
    };
  }
}
