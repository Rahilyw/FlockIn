import { useQuery } from "@tanstack/react-query";
import { getResources } from "@/lib/firestore";
import { queryKeys } from "./queryKeys";

export function useResources(limit = 20) {
  return useQuery({
    queryKey: queryKeys.resources.list(limit),
    queryFn: () => getResources(limit),
    staleTime: 1000 * 60 * 5,
  });
}
