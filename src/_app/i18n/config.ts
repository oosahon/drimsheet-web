import i18nInstance from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import ledgerAccountsEn from '@/account/i18n/locales/en/ledger-accounts.json';
import accountingEn from '@/accounting/i18n/locales/en/accounting.json';
import authEn from '@/auth/i18n/locales/en/auth.json';
import bookkeepingEn from '@/bookkeeping/i18n/locales/en/bookkeeping.json';
import counterpartyEn from '@/counterparty/i18n/locales/en/counterparty.json';
import apiErrorsEn from '@/shared/i18n/locales/en/api-errors.json';
import sharedEn from '@/shared/i18n/locales/en/shared.json';

const resources = {
  en: {
    auth: authEn,
    shared: sharedEn,
    bookkeeping: bookkeepingEn,
    counterparty: counterpartyEn,
    'ledger-accounts': ledgerAccountsEn,
    accounting: accountingEn,
    'api-errors': apiErrorsEn,
  },
} as const;

i18nInstance
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

export const i18n = i18nInstance;
