import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useEventDetail } from "@/hooks/useEventDetail";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useAuth } from "@/contexts/AuthContext";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";
import { joinEvent, leaveEvent } from "@/lib/firestore";
import { queryKeys } from "@/hooks/queryKeys";
import { toast } from "@/components/ui/sonner";
import Header from "@/components/Header";
import type { Event } from "@/types/firebaseTypes";
import type { Timestamp } from "firebase/firestore";

// ── Helpers ───────────────────────────────────────────────────────────────────

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const GRADIENT_PALETTE = [
  "linear-gradient(160deg, #f97316 0%, #a855f7 50%, #3b82f6 100%)",
  "linear-gradient(160deg, #134e4a 0%, #0ea5e9 60%, #67e8f9 100%)",
  "linear-gradient(160deg, #166534 0%, #84cc16 60%, #fde68a 100%)",
  "linear-gradient(160deg, #1e1b4b 0%, #7c3aed 55%, #ec4899 100%)",
  "linear-gradient(160deg, #7f1d1d 0%, #f97316 55%, #fde68a 100%)",
  "linear-gradient(160deg, #0c4a6e 0%, #0ea5e9 55%, #a7f3d0 100%)",
  "linear-gradient(160deg, #4a044e 0%, #d946ef 55%, #f0abfc 100%)",
  "linear-gradient(160deg, #1c1917 0%, #d97706 55%, #fef3c7 100%)",
];

function formatDateRange(start: Timestamp, end?: Timestamp): { date: string; time: string } {
  const s = start?.toDate?.();
  if (!s) return { date: "Date TBD", time: "" };

  const date = s.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const startTime = s.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  if (end) {
    const e = end.toDate();
    const endTime = e.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return { date, time: `${startTime} – ${endTime}` };
  }
  return { date, time: startTime };
}

function isPdfUrl(url: string) {
  return url.split("?")[0].toLowerCase().endsWith(".pdf");
}

// ── Category colors ───────────────────────────────────────────────────────────

const CATEGORY_STYLE: Record<string, { bg: string; color: string }> = {
  Music:    { bg: "oklch(93% 0.04 280)", color: "oklch(33% 0.10 280)" },
  Art:      { bg: "oklch(94% 0.04 162)", color: "oklch(30% 0.09 162)" },
  Workshop: { bg: "oklch(94% 0.04 120)", color: "oklch(30% 0.09 120)" },
  Social:   { bg: "oklch(93% 0.05 310)", color: "oklch(32% 0.11 310)" },
  Sport:    { bg: "oklch(92% 0.05 262)", color: "oklch(34% 0.10 262)" },
  Academic: { bg: "oklch(94% 0.04 45)",  color: "oklch(30% 0.10 45)"  },
  Career:   { bg: "oklch(93% 0.04 280)", color: "oklch(33% 0.10 280)" },
  Food:     { bg: "oklch(94% 0.04 45)",  color: "oklch(30% 0.10 45)"  },
  Other:    { bg: "oklch(94% 0.02 260)", color: "oklch(42% 0.08 260)" },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function InfoRow({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="material-symbols-outlined text-[20px] mt-0.5 shrink-0"
        style={{ color: "oklch(50% 0.14 25)" }}
      >
        {icon}
      </span>
      <div className="text-[14px] text-foreground leading-snug">{children}</div>
    </div>
  );
}

function CreatorAvatar({ photo, name }: { photo?: string; name: string }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";
  return photo ? (
    <img src={photo} alt={name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/60" />
  ) : (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ring-2 ring-white/60"
      style={{ background: "oklch(44% 0.14 25)", color: "oklch(97% 0.01 25)" }}
    >
      {initials}
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-5xl">
        <div className="w-20 h-8 bg-muted/60 rounded-full animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          <div className="aspect-[3/4] bg-muted/60 rounded-3xl animate-pulse" />
          <div className="space-y-4 pt-2">
            <div className="h-5 w-24 bg-muted/60 rounded-full animate-pulse" />
            <div className="h-9 w-4/5 bg-muted/60 rounded-xl animate-pulse" />
            <div className="h-5 w-2/3 bg-muted/60 rounded-xl animate-pulse" />
            <div className="space-y-3 pt-4">
              {[1,2,3].map(i => <div key={i} className="h-5 w-1/2 bg-muted/60 rounded-xl animate-pulse" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Delete dialog ─────────────────────────────────────────────────────────────

function DeleteDialog({ onConfirm, onCancel, isDeleting }: { onConfirm: () => void; onCancel: () => void; isDeleting: boolean }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-3xl p-6 max-w-sm w-full shadow-2xl" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)" }}>
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-destructive text-[24px]">delete_forever</span>
        </div>
        <h3 className="text-lg font-bold text-center mb-1">Delete this event?</h3>
        <p className="text-muted-foreground text-sm text-center mb-6">
          This can't be undone. All attendees will be removed.
        </p>
        <div className="flex gap-3">
          <button
            className="flex-1 py-2.5 rounded-2xl text-sm font-semibold border border-border hover:bg-muted/40 transition-colors"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2.5 rounded-2xl text-sm font-bold text-white bg-destructive hover:bg-destructive/90 transition-colors disabled:opacity-60"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: event, isLoading } = useEventDetail(id!);
  const { savedEvents, toggleEvent } = useBookmarks();
  const { user, profile, refreshProfile } = useAuth();
  const [joining, setJoining] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutateAsync: deleteEventMutation, isPending: isDeleting } = useDeleteEvent({
    eventId: id!,
    userId: user?.uid ?? "",
  });

  const isAttending = profile?.joinedEvents?.includes(id!) ?? false;
  const isBookmarked = savedEvents.includes(id!);
  const isOrganizer = event?.creatorId === user?.uid;

  const handleJoinLeave = async () => {
    if (!user) { navigate("/login"); return; }
    setJoining(true);
    try {
      if (isAttending) {
        await leaveEvent(id!, user.uid);
      } else {
        await joinEvent(id!, user.uid);
      }
      await refreshProfile();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(id!) }),
      ]);
      toast.success(isAttending ? "You've left this event." : "You're going! 🎉");
    } catch {
      toast.error("Couldn't update your RSVP. Try again.");
    } finally {
      setJoining(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEventMutation();
      toast.success("Event deleted.");
      navigate("/");
    } catch {
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  if (!event) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center px-4">
          <span className="material-symbols-outlined text-[64px] text-muted-foreground/30">search_off</span>
          <p className="text-muted-foreground font-medium">This event doesn't exist or was removed.</p>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:brightness-110"
            style={{ background: "hsl(var(--primary))" }}
          >
            Back to Noticeboard
          </button>
        </div>
      </div>
    );
  }

  const { date, time } = formatDateRange(event.date, event.endTime);
  const catStyle = CATEGORY_STYLE[event.category] ?? CATEGORY_STYLE.Other;
  const fallbackGradient = GRADIENT_PALETTE[hashId(event.id) % GRADIENT_PALETTE.length];
  const showImage = event.imagePath && !isPdfUrl(event.imagePath);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-5xl pb-28 lg:pb-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-12 items-start">

          {/* ── Left: Poster image ── */}
          <div className="relative">
            {/* Poster card with border + shadow (matches noticeboard aesthetic) */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 aspect-[3/4]"
              style={{ boxShadow: "0 20px 60px oklch(20% 0.05 30 / 0.25), 0 4px 12px oklch(20% 0.05 30 / 0.12)" }}>
              {showImage ? (
                <img
                  src={event.imagePath!}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : event.imagePath && isPdfUrl(event.imagePath) ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: fallbackGradient }}>
                  <span className="material-symbols-outlined text-white/80 text-[56px]">picture_as_pdf</span>
                  <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">Event Poster</span>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-white/90" style={{ background: fallbackGradient }}>
                  <div className="w-16 h-1 bg-white/40 rounded-full mb-3" />
                  <div className="w-24 h-1 bg-white/25 rounded-full mb-8" />
                  <p className="text-center font-black text-2xl leading-tight drop-shadow-lg">{event.title}</p>
                  <div className="w-20 h-0.5 bg-white/30 rounded-full mt-6" />
                  <p className="text-xs opacity-60 mt-2 tracking-widest uppercase">FlockIn!!</p>
                </div>
              )}

              {/* RSVP count overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold text-white"
                  style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}
                >
                  <span className="material-symbols-outlined text-[16px]">group</span>
                  {event.rsvpCount} going
                </div>
              </div>
            </div>

            {/* Organizer status badge (only shown to the creator) */}
            {isOrganizer && event.status !== "approved" && (
              <div
                className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
                style={event.status === "pending"
                  ? { background: "oklch(95% 0.07 75)", color: "oklch(30% 0.13 75)", border: "1px solid oklch(74% 0.14 75 / 0.5)" }
                  : { background: "oklch(94% 0.05 20)", color: "oklch(32% 0.13 20)", border: "1px solid oklch(66% 0.16 20 / 0.5)" }
                }
              >
                <span className="material-symbols-outlined text-[18px]">
                  {event.status === "pending" ? "schedule" : "cancel"}
                </span>
                {event.status === "pending"
                  ? "Pending review — visible to you only"
                  : "This event wasn't approved"}
              </div>
            )}
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col gap-6">

            {/* Category + title */}
            <div>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3"
                style={catStyle}
              >
                {event.category}
              </span>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                {event.title}
              </h1>
            </div>

            {/* Date / time / location */}
            <div className="flex flex-col gap-3 py-4 px-4 rounded-2xl" style={{ background: "oklch(99% 0.02 25 / 0.65)", border: "1px solid oklch(88% 0.05 25 / 0.45)", boxShadow: "0 1px 8px oklch(60% 0.05 25 / 0.08)" }}>
              <InfoRow icon="calendar_today">
                <span className="font-semibold">{date}</span>
              </InfoRow>
              {time && (
                <InfoRow icon="schedule">
                  <span>{time}</span>
                </InfoRow>
              )}
              <InfoRow icon="location_on">
                <span>{event.location}</span>
              </InfoRow>
            </div>

            {/* Creator */}
            <div className="flex items-center gap-3">
              <CreatorAvatar
                photo={event.creatorPhoto || undefined}
                name={event.creatorName || "Organiser"}
              />
              <div>
                <p className="text-[10px] font-black tracking-[0.12em] uppercase" style={{ color: "oklch(60% 0.08 25)" }}>Organised by</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{event.creatorName || "Campus Organiser"}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/50" />

            {/* Description */}
            <div>
              <p className="text-[10px] font-black tracking-[0.12em] uppercase mb-3" style={{ color: "oklch(50% 0.14 25)" }}>About this event</p>
              <p className="text-foreground leading-relaxed whitespace-pre-line text-[15px]">{event.description}</p>
            </div>

            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "oklch(96% 0.03 25)", color: "oklch(44% 0.12 25)", border: "1.5px solid oklch(82% 0.07 25 / 0.7)" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Action bar (desktop — inline) ── */}
            <div className="hidden lg:flex items-center gap-3 pt-2">
              <ActionButtons
                isAttending={isAttending}
                isBookmarked={isBookmarked}
                isOrganizer={isOrganizer}
                joining={joining}
                onJoin={handleJoinLeave}
                onBookmark={() => toggleEvent(event.id)}
                onEdit={() => navigate(`/events/${id}/edit`)}
                onDelete={() => setShowDeleteDialog(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky bottom bar (mobile) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3"
        style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)", borderTop: "1px solid oklch(88% 0.04 30 / 0.4)" }}>
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <ActionButtons
            isAttending={isAttending}
            isBookmarked={isBookmarked}
            isOrganizer={isOrganizer}
            joining={joining}
            onJoin={handleJoinLeave}
            onBookmark={() => toggleEvent(event.id)}
            onEdit={() => navigate(`/events/${id}/edit`)}
            onDelete={() => setShowDeleteDialog(true)}
          />
        </div>
      </div>

      {showDeleteDialog && (
        <DeleteDialog
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

// ── Action buttons (shared between mobile sticky bar + desktop inline) ────────

function ActionButtons({
  isAttending, isBookmarked, isOrganizer, joining,
  onJoin, onBookmark, onEdit, onDelete,
}: {
  isAttending: boolean;
  isBookmarked: boolean;
  isOrganizer: boolean;
  joining: boolean;
  onJoin: () => void;
  onBookmark: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      {/* Primary RSVP */}
      <button
        onClick={onJoin}
        disabled={joining}
        className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-60"
        style={isAttending ? {
          background: "oklch(96% 0.03 25)",
          color: "oklch(44% 0.14 25)",
          border: "1.5px solid oklch(44% 0.14 25 / 0.4)",
        } : {
          background: "oklch(44% 0.14 25)",
          color: "oklch(97% 0.01 25)",
          boxShadow: "0 4px 16px oklch(44% 0.14 25 / 0.35)",
        }}
      >
        {joining ? "…" : isAttending ? "✓ You're going" : "I'm going! 🎉"}
      </button>

      {/* Bookmark */}
      <button
        onClick={onBookmark}
        className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={isBookmarked
          ? { background: "oklch(82% 0.14 18 / 0.25)", border: "1.5px solid oklch(63% 0.17 18 / 0.5)" }
          : { background: "rgba(255,255,255,0.6)", border: "1.5px solid oklch(85% 0.04 30 / 0.6)" }
        }
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark event"}
      >
        <span
          className="material-symbols-outlined text-[20px]"
          style={{
            color: isBookmarked ? "oklch(45% 0.15 18)" : "oklch(50% 0.08 30)",
            fontVariationSettings: isBookmarked ? "'FILL' 1, 'wght' 500" : undefined,
          }}
        >
          favorite
        </span>
      </button>

      {/* Organizer controls */}
      {isOrganizer && (
        <>
          <button
            onClick={onEdit}
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{ background: "rgba(255,255,255,0.6)", border: "1.5px solid oklch(85% 0.04 30 / 0.6)" }}
            aria-label="Edit event"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">edit</span>
          </button>
          <button
            onClick={onDelete}
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{ background: "rgba(255,255,255,0.6)", border: "1.5px solid oklch(85% 0.04 30 / 0.6)" }}
            aria-label="Delete event"
          >
            <span className="material-symbols-outlined text-[20px] text-destructive">delete</span>
          </button>
        </>
      )}
    </>
  );
}
