import { useQuery } from "@tanstack/react-query";
import { getClubsByIds } from "@/lib/firestore";

export function useClubsByIds(ids: string[]) {
  return useQuery({
    queryKey: ["clubs", "byIds", ids],
    queryFn: () => getClubsByIds(ids),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
