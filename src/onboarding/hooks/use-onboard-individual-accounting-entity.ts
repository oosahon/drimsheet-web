import { useMutation } from "@tanstack/react-query";
import onboardingService from "../services/onboarding.service";
import type { IAccountingEntityFormValues } from "../ui/accounting-entity-form";

export default function useOnboardIndividualAccountingEntity() {
  return useMutation({
    mutationFn: (data: IAccountingEntityFormValues) =>
      onboardingService.onboardIndividual(data),
  });
}
