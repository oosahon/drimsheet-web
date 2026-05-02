import accountingEn from '@/shared/i18n/locales/en/accounting.json';
import apiErrorsEn from '@/shared/i18n/locales/en/api-errors.json';
import authEn from '@/shared/i18n/locales/en/auth.json';
import ledgerAccountsEn from '@/shared/i18n/locales/en/ledger-accounts.json';
import sharedEn from '@/shared/i18n/locales/en/shared.json';
import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'shared';
    resources: {
      auth: typeof authEn;
      shared: typeof sharedEn;
      'ledger-accounts': typeof ledgerAccountsEn;
      accounting: typeof accountingEn;
      'api-errors': typeof apiErrorsEn;
    };
  }
}
