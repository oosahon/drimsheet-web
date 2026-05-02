import { useTranslation } from 'react-i18next';
export function Test() {
  const { t } = useTranslation('ledger-accounts');
  t('account_name_max_length_text');
}
