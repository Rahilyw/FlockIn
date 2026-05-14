import { useQuery } from "@tanstack/react-query";
import { getFeaturedResources } from "@/lib/mock-api";
import { queryKeys } from "@/hooks/queries/queryKeys";

export function useFeaturedResources() {
  return useQuery({
    queryKey: queryKeys.featured.resources,
    queryFn: getFeaturedResources,
  });
}
