import accountingEntityService from '@/accounting-entity/services/accounting-entity.service';
import { useQuery } from '@tanstack/react-query';

export default function useAccountingEntities() {
  return useQuery({
    queryKey: ['accountingEntityService.getAll'],
    queryFn: () => accountingEntityService.getAll(),
    throwOnError: true,
  });
}
