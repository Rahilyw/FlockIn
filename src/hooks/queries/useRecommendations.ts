import { useQuery } from "@tanstack/react-query";
import { getRecommendations } from "@/lib/mock-api";
import { queryKeys } from "@/hooks/queries/queryKeys";

export function useRecommendations() {
  return useQuery({
    queryKey: queryKeys.recommendations,
    queryFn: getRecommendations,
  });
}
