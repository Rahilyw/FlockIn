import { useQuery } from "@tanstack/react-query";
import { getFeaturedEvents } from "@/lib/mock-api";
import { queryKeys } from "@/hooks/queries/queryKeys";

export function useFeaturedEvents() {
  return useQuery({
    queryKey: queryKeys.featured.events,
    queryFn: getFeaturedEvents,
  });
}
