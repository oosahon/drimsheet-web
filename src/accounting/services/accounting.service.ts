import type { IAccountingEntityFormValues } from '@/accounting/ui/accounting-entity-creation-form';
import localStorageService from '@/shared/services/local-storage.service';
import purpleLedgerApi from '@/shared/utils/api';
import {
  EAccountingEntityType,
  EPeriodUnit,
  type IAccountingEntityCreationDto,
} from '@/shared/utils/api/Api';

const accountingService = {
  toCreateAccountingEntityPayload(
    data: IAccountingEntityFormValues
  ): IAccountingEntityCreationDto {
    return {
      name: data.name,
      entityType: EAccountingEntityType.Individual,
      jurisdictionCode: data.countryCode,
      accountingStandardCode: 'IFRS', // TODO: show a warning for a country that does not support IFRS
      functionalCurrencyCode: data.functionalCurrency,
      reportingCurrencyCode: data.reportingCurrency,
      fiscalYear: {
        startDate: new Date().toISOString(), // TODO: use a date range in the form to get start and end dates.
        endDate: new Date().toISOString(), // TODO: use a date range in the form to get start and end dates.
      },
      accountingPeriod: {
        unit: EPeriodUnit.Month,
        count: 12, // TODO: get the difference in months between the start and end dates
      },
      reportingPeriod: {
        unit: EPeriodUnit.Month,
        count: 12, // TODO: get the difference in months between the start and end dates
      },
      appUsageMode: data.appUsageMode,
    };
  },

  async getAccountingEntities() {
    const res = await purpleLedgerApi.accounting.getUserAccountingEntities();
    localStorageService.setAccountingEntityId(res.data[0]?.id ?? '');
    return res.data;
  },

  async getJurisdiction() {
    const res = await purpleLedgerApi.accounting.getJurisdictions();
    return res.data;
  },

  async createAccountingEntity(payload: IAccountingEntityFormValues) {
    const parsedPayload = this.toCreateAccountingEntityPayload(payload);
    const { data: accountingEntity } =
      await purpleLedgerApi.accounting.createAccountingEntity(parsedPayload);
    localStorageService.setAccountingEntityId(accountingEntity.id);
    return accountingEntity;
  },
};

export default accountingService;
