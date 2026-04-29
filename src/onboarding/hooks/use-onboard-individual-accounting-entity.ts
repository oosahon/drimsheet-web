import type { IAccountingEntityFormValues } from '@/accounting/ui/accounting-entity-creation-form';
import onboardingService from '@/onboarding/services/onboarding.service';
import { useMutation } from '@tanstack/react-query';

export default function useOnboardIndividualAccountingEntity() {
  return useMutation({
    mutationFn: (data: IAccountingEntityFormValues) =>
      onboardingService.onboardIndividual(data),
  });
}
