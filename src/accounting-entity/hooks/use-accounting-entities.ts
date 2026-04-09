import { useQuery } from "@tanstack/react-query";
import accountingEntityService from "../services/accounting-entity.service";

export default function useAccountingEntities() {
  return useQuery({
    queryKey: ["useAccountingEntities"],
    queryFn: () => accountingEntityService.getAll(),
  });
}
