import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import accountingEn from '@/shared/i18n/locales/en/accounting.json';
import apiErrorsEn from '@/shared/i18n/locales/en/api-errors.json';
import authEn from '@/shared/i18n/locales/en/auth.json';
import ledgerAccountsEn from '@/shared/i18n/locales/en/ledger-accounts.json';
import sharedEn from '@/shared/i18n/locales/en/shared.json';

const resources = {
  en: {
    auth: authEn,
    shared: sharedEn,
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
