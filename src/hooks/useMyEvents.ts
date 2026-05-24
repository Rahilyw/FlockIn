import { useQuery } from "@tanstack/react-query";
import { getEventsByCreator } from "@/lib/firestore";
import { queryKeys } from "./queryKeys";

export function useMyEvents(uid: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.events.byCreator(uid ?? ""),
    queryFn: () => getEventsByCreator(uid!),
    enabled: !!uid,
    staleTime: 1000 * 60 * 2, // 2 min — own events update more often
  });
}
