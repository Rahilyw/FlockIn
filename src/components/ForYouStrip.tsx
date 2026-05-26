import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { joinEvent, leaveEvent } from "@/lib/firestore";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useEvents } from "@/hooks/useEvents";
import { useRecommendedEvents } from "@/hooks/useRecommendations";
import { queryKeys } from "@/hooks/queryKeys";
import type { Event } from "@/types/firebaseTypes";
import PosterCard from "./PosterCard";
import { EventDetailModal } from "./EventDetailModal";

const ForYouStrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, profile, refreshProfile } = useAuth();
  const { savedEvents, toggleEvent } = useBookmarks();

  const interests = profile?.interests ?? [];

  // Same query params as Noticeboard → React Query cache hit, no extra request
  const { data: events = [] } = useEvents({ limit: 22, approvedOnly: true, activeOnly: true });
  const { events: recommended, matchedInterests } = useRecommendedEvents(events, interests, 5);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [attendingId, setAttendingId] = useState<string | null>(null);

  if (!user || interests.length === 0 || recommended.length === 0) return null;

  const redirectToLogin = () => navigate("/login", { state: { from: location } });

  const handleToggleSave = async (event: Event) => {
    if (!user) { redirectToLogin(); return; }
    setSavingId(event.id);
    const wasSaved = savedEvents.includes(event.id);
    try {
      await toggleEvent(event.id);
      toast.success(wasSaved ? "Removed from saved events." : "Saved to My Space.");
    } catch {
      toast.error("Couldn't update your saved events. Try again.");
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleAttendance = async (event: Event) => {
    if (!user) { redirectToLogin(); return; }
    setAttendingId(event.id);
    const wasAttending = profile?.joinedEvents?.includes(event.id) ?? false;
    try {
      if (wasAttending) {
        await leaveEvent(event.id, user.uid);
      } else {
        await joinEvent(event.id, user.uid);
      }
      await refreshProfile();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(event.id) }),
      ]);
      toast.success(wasAttending ? "Removed from your attending list." : "Added to your attending events.");
    } catch {
      toast.error("Couldn't update your attendance. Try again.");
    } finally {
      setAttendingId(null);
    }
  };

  const topThree = matchedInterests.slice(0, 3);
  const remainder = matchedInterests.length - topThree.length;
  const subtitle = remainder > 0
    ? `Because you like ${topThree.join(", ")} + ${remainder} more`
    : `Because you like ${topThree.join(", ")}`;

  return (
    <>
      <section
        aria-label="For You"
        className="rounded-[24px] p-4 mb-6"
        style={{
          background: "rgba(255,255,255,0.55)",
          boxShadow: "0 1px 8px rgba(50,40,35,0.06), 0 0 0 1px rgba(170,140,120,0.12)",
        }}
      >
        {/* Header */}
        <div className="flex items-baseline gap-2 mb-3 px-1">
          <span className="text-[10px] font-black tracking-[0.18em] uppercase text-muted-foreground/45">
            ✨ Picked for you
          </span>
          <span className="text-[12px] text-muted-foreground/60 font-medium truncate">
            — {subtitle}
          </span>
        </div>

        {/* Scrollable card row */}
        <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 w-max">
            {recommended.map((event) => (
              <div key={event.id} className="w-[130px] md:w-[150px] shrink-0">
                <PosterCard
                  eventId={event.id}
                  title={event.title}
                  date={event.date}
                  endTime={event.endTime}
                  location={event.location}
                  description={event.description}
                  imagePath={event.imagePath ?? null}
                  rotation="0deg"
                  marginTop={0}
                  attachmentType="pushpin"
                  pushpinColor="transparent"
                  actionLabel="Open"
                  actionClassName=""
                  onOpen={() => setSelectedEvent(event)}
                  isSaved={savedEvents.includes(event.id)}
                  isAttending={profile?.joinedEvents?.includes(event.id) ?? false}
                  isSavePending={savingId === event.id}
                  isAttendancePending={attendingId === event.id}
                  onToggleSave={() => handleToggleSave(event)}
                  onToggleAttendance={() => handleToggleAttendance(event)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isSaved={savedEvents.includes(selectedEvent.id)}
          isAttending={profile?.joinedEvents?.includes(selectedEvent.id) ?? false}
          isSavePending={savingId === selectedEvent.id}
          isAttendancePending={attendingId === selectedEvent.id}
          onClose={() => setSelectedEvent(null)}
          onToggleSave={() => handleToggleSave(selectedEvent)}
          onToggleAttendance={() => handleToggleAttendance(selectedEvent)}
        />
      )}
    </>
  );
};

export default ForYouStrip;
