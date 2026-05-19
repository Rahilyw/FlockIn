import { useQuery } from "@tanstack/react-query";
import { getEventsByIds } from "@/lib/firestore";

export function useEventsByIds(ids: string[]) {
  return useQuery({
    queryKey: ["events", "byIds", ids],
    queryFn: () => getEventsByIds(ids),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
