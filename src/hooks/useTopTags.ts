import { useQuery } from "@tanstack/react-query";
import { getTopTags } from "@/lib/firestore";

export function useTopTags(limitCount = 8) {
  return useQuery({
    queryKey: ["tags", "top", limitCount],
    queryFn: () => getTopTags(limitCount),
    staleTime: 60 * 1000,
  });
}
