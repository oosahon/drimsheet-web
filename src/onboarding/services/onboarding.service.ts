import {
  UAccountingEntityType,
  UAppUsageMode,
  type IAccountingEntityOnboardingReq,
} from "@/shared/utils/api/Api";
import type { IAccountingEntityFormValues } from "../ui/accounting-entity-form";
import purpleLedgerApi from "@/shared/utils/api";

const onboardingService = {
  toIndividualOnboardingReq(
    data: IAccountingEntityFormValues,
  ): IAccountingEntityOnboardingReq {
    return {
      name: data.name,
      entityType: data.entityType as UAccountingEntityType,
      operatingCountryCode: data.countryCode,
      functionalCurrencyCode: data.functionalCurrency,
      reportingCurrencyCode: data.reportingCurrency,
      fiscalYearStart: {
        month: data.fiscalYearStart.month,
        day: data.fiscalYearStart.day,
      },
      appUsageMode: data.appUsageMode as UAppUsageMode,
    };
  },

  async onboardIndividual(data: IAccountingEntityFormValues) {
    const res = await purpleLedgerApi.onboarding.onboardAccountingEntity(
      this.toIndividualOnboardingReq(data),
    );

    localStorage.setItem("accounting_entity_type", data.entityType);
    return res.data;
  },
};

export default onboardingService;
