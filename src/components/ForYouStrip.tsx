import { useState, useEffect } from "react";
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

const DISMISSED_KEY = (uid: string) => `fk_foryou_dismissed_${uid}`;

const ForYouStrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, profile, refreshProfile } = useAuth();
  const { savedEvents, toggleEvent } = useBookmarks();

  const interests = profile?.interests ?? [];

  // Fresh refetch on every mount + window focus so recommendations stay current
  const { data: events = [] } = useEvents({
    limit: 40,
    approvedOnly: true,
    activeOnly: true,
  }, { refetchOnMount: true, refetchOnWindowFocus: true });

  const { events: recommended, matchedInterests } = useRecommendedEvents(events, interests, 10);

  // Dismissed event IDs — persisted per user in localStorage
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem(DISMISSED_KEY(user.uid));
      setDismissedIds(new Set(raw ? JSON.parse(raw) : []));
    } catch {
      setDismissedIds(new Set());
    }
  }, [user?.uid]);

  const handleDismiss = (eventId: string) => {
    if (!user) return;
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(eventId);
      try { localStorage.setItem(DISMISSED_KEY(user.uid), JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };

  const handleClearDismissed = () => {
    if (!user) return;
    setDismissedIds(new Set());
    try { localStorage.removeItem(DISMISSED_KEY(user.uid)); } catch { /* ignore */ }
  };

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [attendingId, setAttendingId] = useState<string | null>(null);

  const visible = recommended.filter((e) => !dismissedIds.has(e.id));

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
      <section aria-label="Picked for you" className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] font-black tracking-[0.18em] uppercase text-muted-foreground/50">
              ✨ Picked for you
            </span>
            <span className="text-[12px] text-muted-foreground/60 font-medium hidden sm:inline">
              — {subtitle}
            </span>
          </div>
          {dismissedIds.size > 0 && (
            <button
              onClick={handleClearDismissed}
              className="text-[11px] font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Reset hidden
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          // All recommendations dismissed
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
            <span className="material-symbols-outlined text-[36px] text-muted-foreground/30">auto_awesome</span>
            <p className="text-sm font-medium text-muted-foreground/50">You've hidden all suggestions.</p>
            <button
              onClick={handleClearDismissed}
              className="text-[12px] font-bold text-primary/70 hover:text-primary transition-colors mt-1"
            >
              Show them again
            </button>
          </div>
        ) : (
          <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 w-max sm:w-auto sm:flex-wrap">
              {visible.map((event) => (
                <div key={event.id} className="relative w-[130px] sm:w-[150px] shrink-0">
                  {/* Dismiss button */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDismiss(event.id); }}
                    aria-label={`Hide ${event.title} from recommendations`}
                    className="absolute -top-2 -right-2 z-20 w-5 h-5 rounded-full bg-foreground/70 hover:bg-foreground text-background flex items-center justify-center transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 11, lineHeight: 1 }}>close</span>
                  </button>
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
        )}
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
