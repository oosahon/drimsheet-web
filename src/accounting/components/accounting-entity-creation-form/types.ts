export interface IAccountingEntityFormValues {
  name: string;
  entityType: string;
  countryCode: string;
  functionalCurrency: string;
  reportingCurrency: string;
  fiscalYearStart: Date | null;
  fiscalYearEnd: Date | null;
  appUsageMode: 'power_user' | 'non_power_user';
  accountingStandardCode: string;
}
