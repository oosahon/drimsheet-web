import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import ledgerAccountsEn from '@/account/i18n/locales/en/ledger-accounts.json';
import accountingEn from '@/accounting/i18n/locales/en/accounting.json';
import authEn from '@/auth/i18n/locales/en/auth.json';
import bookkeepingEn from '@/bookkeeping/i18n/locales/en/bookkeeping.json';
import apiErrorsEn from '@/shared/i18n/locales/en/api-errors.json';
import sharedEn from '@/shared/i18n/locales/en/shared.json';

const resources = {
  en: {
    auth: authEn,
    shared: sharedEn,
    bookkeeping: bookkeepingEn,
    'ledger-accounts': ledgerAccountsEn,
    accounting: accountingEn,
    'api-errors': apiErrorsEn,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'shared',
    interpolation: {
      escapeValue: false, // React already safe from xss
    },
  });

export default i18n;
