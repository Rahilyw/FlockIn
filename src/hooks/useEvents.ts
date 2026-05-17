import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/lib/firestore";
import { queryKeys } from "./queryKeys";
import type { EventCategory } from "@/types/firebaseTypes";

interface UseEventsOptions {
  category?: EventCategory;
  limit?: number;
}

export function useEvents(options: UseEventsOptions = {}) {
  return useQuery({
    queryKey: queryKeys.events.list(options.category, options.limit),
    queryFn: () => getEvents({ category: options.category, limitCount: options.limit }),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}
