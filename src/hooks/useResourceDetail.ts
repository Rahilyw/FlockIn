import { useQuery } from "@tanstack/react-query";
import { getResource } from "@/lib/firestore";
import { queryKeys } from "./queryKeys";

export function useResourceDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.resources.detail(id),
    queryFn: () => getResource(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
