import onboardingService from '@/onboarding/services/onboarding.service';
import type { IAccountingEntityFormValues } from '@/onboarding/ui/accounting-entity-form';
import { useMutation } from '@tanstack/react-query';

export default function useOnboardIndividualAccountingEntity() {
  return useMutation({
    mutationFn: (data: IAccountingEntityFormValues) =>
      onboardingService.onboardIndividual(data),
  });
}
