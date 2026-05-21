import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEvent } from "@/lib/firestore";
import { queryKeys } from "@/hooks/queryKeys";

interface UseDeleteEventOptions {
  eventId: string;
  userId: string;
}

export function useDeleteEvent({ eventId, userId }: UseDeleteEventOptions) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteEvent(eventId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      queryClient.removeQueries({ queryKey: queryKeys.events.detail(eventId) });
    },
  });
}
