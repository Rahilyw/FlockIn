import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/lib/firestore";
import { queryKeys } from "./queryKeys";
import type { EventCategory } from "@/types/firebaseTypes";

interface UseEventsOptions {
  category?: EventCategory;
  limit?: number;
  approvedOnly?: boolean;
  activeOnly?: boolean;
}

export function useEvents(options: UseEventsOptions = {}) {
  return useQuery({
    queryKey: queryKeys.events.list(
      options.category,
      options.limit,
      options.approvedOnly,
      options.activeOnly,
    ),
    queryFn: () => getEvents({
      category: options.category,
      limitCount: options.limit,
      approvedOnly: options.approvedOnly,
      activeOnly: options.activeOnly,
    }),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}
