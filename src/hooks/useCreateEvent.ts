import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent, incrementTagCounts } from "@/lib/firestore";
import { queryKeys } from "@/hooks/queryKeys";
import type { Event } from "@/types/firebaseTypes";

type CreateEventInput = Omit<Event, "id" | "rsvpCount" | "rsvpBy" | "status" | "reported" | "savedBy" | "savedCount" | "createdAt" | "updatedAt">;

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEventInput) => {
      const id = await createEvent(data);
      // Fire-and-forget tag count increment — don't block event creation
      if (data.tags.length > 0) {
        incrementTagCounts(data.tags).catch(() => {/* silent — non-critical */});
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}
