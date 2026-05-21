import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEvent } from "@/lib/firestore";
import { queryKeys } from "@/hooks/queryKeys";
import type { Event } from "@/types/firebaseTypes";

type UpdateEventInput = Partial<Omit<Event, "id" | "organizerId" | "attendeeCount" | "attendeeIds" | "createdAt" | "updatedAt">>;

interface UseUpdateEventOptions {
  eventId: string;
  userId: string;
}

export function useUpdateEvent({ eventId, userId }: UseUpdateEventOptions) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateEventInput) => updateEvent(eventId, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
    },
  });
}
