import { useQuery } from "@tanstack/react-query";
import { getEvent } from "@/lib/firestore";
import { queryKeys } from "./queryKeys";

export function useEventDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => getEvent(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
