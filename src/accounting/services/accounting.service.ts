import type { IAccountingEntityFormValues } from '@/accounting/ui/components/accounting-entity-creation-form';
import localStorageService from '@/shared/services/local-storage.service';
import purpleLedgerApi from '@/shared/utils/api';
import {
  EAccountingEntityType,
  EPeriodUnit,
  type IAccountingEntityCreationDto,
} from '@/shared/utils/api/Api';
import dateUtils from '@/shared/utils/date';

const accountingService = {
  toCreateAccountingEntityPayload(
    data: IAccountingEntityFormValues
  ): IAccountingEntityCreationDto {
    if (!data.fiscalYearStart || !data.fiscalYearEnd) {
      throw new Error('Fiscal year start and end dates are required');
    }

    const startDateStr = dateUtils.formatDateForApi(data.fiscalYearStart);
    const endDateStr = dateUtils.formatDateForApi(data.fiscalYearEnd);
    const periodCount = dateUtils.getDurationInMonths(
      data.fiscalYearStart,
      data.fiscalYearEnd
    );

    return {
      name: data.name,
      entityType: EAccountingEntityType.Individual,
      jurisdictionCode: data.countryCode,
      accountingStandardCode: data.accountingStandardCode,
      functionalCurrencyCode: data.functionalCurrency,
      reportingCurrencyCode: data.reportingCurrency,
      fiscalYear: {
        startDate: startDateStr,
        endDate: endDateStr,
      },
      accountingPeriod: {
        unit: EPeriodUnit.Month,
        count: periodCount,
      },
      reportingPeriod: {
        unit: EPeriodUnit.Month,
        count: periodCount,
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
