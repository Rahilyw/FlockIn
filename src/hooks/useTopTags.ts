import { useQuery } from "@tanstack/react-query";
import { getTopTags } from "@/lib/firestore";

export function useTopTags(limitCount = 8) {
  return useQuery({
    queryKey: ["tags", "top", limitCount],
    queryFn: () => getTopTags(limitCount),
    staleTime: 5 * 60 * 1000, // 5 minutes — tags don't change that often
  });
}
