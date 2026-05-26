import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "@/lib/firestore";
import { queryKeys } from "@/hooks/queryKeys";
import type { Event } from "@/types/firebaseTypes";

type CreateEventInput = Omit<Event, "id" | "rsvpCount" | "rsvpBy" | "status" | "reported" | "savedBy" | "savedCount" | "createdAt" | "updatedAt">;

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventInput) => createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}
