import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toggleSavedEvent, toggleSavedClub } from "@/lib/firestore";

export function useBookmarks() {
  const { user, profile, refreshProfile } = useAuth();
  const queryClient = useQueryClient();

  const savedEvents = profile?.savedEvents ?? [];
  const savedClubs = profile?.savedClubs ?? [];

  const toggleEvent = async (eventId: string) => {
    if (!user) return;
    const isSaved = savedEvents.includes(eventId);
    await toggleSavedEvent(user.uid, eventId, !isSaved);
    await refreshProfile();
    await queryClient.invalidateQueries({ queryKey: ["tags"] });
  };

  const toggleClub = async (clubId: string) => {
    if (!user) return;
    const isSaved = savedClubs.includes(clubId);
    await toggleSavedClub(user.uid, clubId, !isSaved);
    await refreshProfile();
  };

  return { savedEvents, savedClubs, toggleEvent, toggleClub };
}
