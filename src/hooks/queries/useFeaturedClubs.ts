import { useQuery } from "@tanstack/react-query";
import { getFeaturedClubs } from "@/lib/mock-api";
import { queryKeys } from "@/hooks/queries/queryKeys";

export function useFeaturedClubs() {
  return useQuery({
    queryKey: queryKeys.featured.clubs,
    queryFn: getFeaturedClubs,
  });
}
