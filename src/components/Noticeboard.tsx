import { useState, Component } from "react";
import type { ReactNode } from "react";
import PosterCard from "./PosterCard";

class PosterErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  render() { return this.state.crashed ? null : this.props.children; }
}
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { joinEvent, leaveEvent, reportEvent } from "@/lib/firestore";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useEvents } from "@/hooks/useEvents";
import { queryKeys } from "@/hooks/queryKeys";
import type { Event, EventCategory } from "@/types/firebaseTypes";

export type FilterMode = "happening-now" | "today" | "this-week" | "next-week" | `tag:${string}` | `category:${string}`;

// ── Visual presets ────────────────────────────────────────────────────────────

const MARGIN_TOPS = [0, 48, 24, 80, 16, 60, 32, 72, 8, 56, 40, 64];

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRotation(id: string): string {
  return `${-3 + (hashId(id) % 7)}deg`;
}

function isSameLocalDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function matchesFilter(event: Event, filter: FilterMode): boolean {
  if (!filter) return true;

  if (filter === "happening-now") {
    const now = new Date();
    const start = event.date?.toDate?.();
    const end = event.endTime?.toDate?.();
    return Boolean(start && end && start <= now && end >= now);
  }

  if (filter === "today") {
    const start = event.date?.toDate?.();
    return Boolean(start && isSameLocalDate(start, new Date()));
  }

  if (filter === "this-week") {
    const start = event.date?.toDate?.();
    if (!start) return false;
    const now = new Date();
    const in7 = new Date(now);
    in7.setDate(in7.getDate() + 7);
    return start >= now && start <= in7;
  }

  if (filter === "next-week") {
    const start = event.date?.toDate?.();
    if (!start) return false;
    const now = new Date();
    const in7 = new Date(now);
    in7.setDate(in7.getDate() + 7);
    const in14 = new Date(now);
    in14.setDate(in14.getDate() + 14);
    return start > in7 && start <= in14;
  }

  if (filter.startsWith("category:")) {
    const cat = filter.slice("category:".length);
    return event.category === cat;
  }

  const selectedTag = filter.slice("tag:".length);
  return event.tags.includes(selectedTag);
}

const ATTACHMENTS: Array<{
  attachmentType: "pushpin" | "washi";
  pushpinColor?: string;
  washiColor?: string;
  washiSide?: "left" | "right";
  washiRotation?: number;
}> = [
  { attachmentType: "pushpin", pushpinColor: "#FF5252" },
  { attachmentType: "washi", washiColor: "rgba(178,235,242,0.70)", washiSide: "right", washiRotation: -12 },
  { attachmentType: "pushpin", pushpinColor: "#F06292" },
  { attachmentType: "washi", washiColor: "rgba(220,231,117,0.70)", washiSide: "left", washiRotation: 12 },
  { attachmentType: "pushpin", pushpinColor: "#FFB300" },
  { attachmentType: "washi", washiColor: "rgba(200,180,255,0.70)", washiSide: "right", washiRotation: -8 },
];


const ACTION_BY_CATEGORY: Record<EventCategory, { label: string; className: string }> = {
  Workshop: { label: "Sign Up", className: "bg-secondary-container text-on-secondary-container" },
  Career:   { label: "Register", className: "bg-primary-container text-on-primary-container" },
  Sport:    { label: "Join", className: "bg-tertiary-container text-on-tertiary-container" },
  Academic: { label: "Learn More", className: "bg-secondary-container text-on-secondary-container" },
  Music:    { label: "RSVP", className: "bg-primary-container text-on-primary-container" },
  Art:      { label: "RSVP", className: "bg-tertiary-container text-on-tertiary-container" },
  Social:   { label: "Join Us", className: "bg-primary text-on-primary" },
  Food:     { label: "Attend", className: "bg-secondary-container text-on-secondary-container" },
  Other:    { label: "Learn More", className: "bg-primary-container text-on-primary-container" },
};

// ── Skeleton card ─────────────────────────────────────────────────────────────

const SKELETON_ROTATIONS = [-2, 3, -1, 6, -3, 2, -5, 4, -1, 3, -4, 2];

function SkeletonCard({ index }: { index: number }) {
  const rotation = SKELETON_ROTATIONS[index % SKELETON_ROTATIONS.length];
  const marginTop = MARGIN_TOPS[index % MARGIN_TOPS.length];
  return (
    <div
      className="relative"
      style={{ transform: `rotate(${rotation}deg)`, marginTop: `${marginTop}px` }}
    >
      <div className="relative rounded-lg overflow-hidden shadow-xl border-4 border-white">
        <div className="w-full aspect-[3/4] bg-surface-container-low animate-pulse" />
      </div>
    </div>
  );
}

// ── Noticeboard ───────────────────────────────────────────────────────────────

interface NoticeboardProps {
  filters?: Set<string>;
}

const Noticeboard = ({ filters = new Set() }: NoticeboardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, profile, refreshProfile } = useAuth();
  const { savedEvents, toggleEvent } = useBookmarks();
  const { data: events, isLoading, isError } = useEvents({
    limit: 22,
    approvedOnly: true,
    activeOnly: true,
  });
  const [savingEventId, setSavingEventId] = useState<string | null>(null);
  const [attendingEventId, setAttendingEventId] = useState<string | null>(null);

  const redirectToLogin = () => {
    navigate("/login", { state: { from: location } });
  };

  const handleToggleSave = async (event: Event) => {
    if (!user) {
      redirectToLogin();
      return;
    }

    setSavingEventId(event.id);
    const wasSaved = savedEvents.includes(event.id);
    try {
      await toggleEvent(event.id);
      toast.success(wasSaved ? "Removed from saved events." : "Saved to My Space.");
    } catch {
      toast.error("Couldn't update your saved events. Try again.");
    } finally {
      setSavingEventId(null);
    }
  };

  const handleToggleAttendance = async (event: Event) => {
    if (!user) {
      redirectToLogin();
      return;
    }

    setAttendingEventId(event.id);
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
      setAttendingEventId(null);
    }
  };

  const handleReport = async (event: Event) => {
    if (!user) {
      redirectToLogin();
      return;
    }
    try {
      await reportEvent(event.id);
      toast.success("Thanks for letting us know — we'll review this event.");
    } catch {
      toast.error("Couldn't submit report. Try again.");
    }
  };

  return (
    <div className="relative rounded-[32px] p-4 bg-[#5D4037] shadow-2xl border-[12px] border-[#3E2723]">
      <div className="board-texture rounded-[20px] min-h-[900px] w-full relative masonry-grid">

        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)}

        {isError && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-white/70 gap-3">
            <span className="material-symbols-outlined text-[48px]">error</span>
            <p className="font-semibold">Couldn't load events. Check your connection.</p>
          </div>
        )}

        {events?.map((event, i) => {
          const attachment = ATTACHMENTS[i % ATTACHMENTS.length];
          const action = ACTION_BY_CATEGORY[event.category] ?? ACTION_BY_CATEGORY.Other;
          const isSaved = savedEvents.includes(event.id);
          const isAttending = profile?.joinedEvents?.includes(event.id) ?? false;
          const filterActive = filters.size > 0;
          const matches = filterActive
            ? [...filters].every((f) => matchesFilter(event, f as FilterMode))
            : true;

          return (
            <div
              key={event.id}
              className="animate-card-enter"
              style={{
                animationDelay: `${Math.min(i * 55, 900)}ms`,
                transition: "opacity 320ms cubic-bezier(0.25,1,0.5,1), transform 320ms cubic-bezier(0.25,1,0.5,1)",
                opacity: filterActive && !matches ? 0.18 : 1,
                transform: filterActive && matches
                  ? "scale(1.02) translateY(-3px)"
                  : filterActive && !matches
                  ? "scale(0.95)"
                  : "scale(1)",
              }}
            >
              <PosterErrorBoundary key={event.id}>
                <PosterCard
                  eventId={event.id}
                  title={event.title}
                  date={event.date}
                  endTime={event.endTime}
                  location={event.location}
                  description={event.description}
                  imagePath={event.imagePath ?? event.posterUrl ?? null}
                  rotation={seededRotation(event.id)}
                  marginTop={MARGIN_TOPS[i % MARGIN_TOPS.length]}
                  actionLabel={action.label}
                  actionClassName={action.className}
                  onOpen={() => navigate(`/events/${event.id}`)}
                  isSaved={isSaved}
                  isAttending={isAttending}
                  isSavePending={savingEventId === event.id}
                  isAttendancePending={attendingEventId === event.id}
                  onToggleSave={() => handleToggleSave(event)}
                  onToggleAttendance={() => handleToggleAttendance(event)}
                  onReport={() => handleReport(event)}
                  {...attachment}
                />
              </PosterErrorBoundary>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Noticeboard;
