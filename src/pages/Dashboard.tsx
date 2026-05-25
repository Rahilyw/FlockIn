import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";
import Header from "@/components/Header";
import { EmptyState } from "@/components/EmptyState";
import { EventCard } from "@/components/EventCard";
import { useAuth } from "@/contexts/AuthContext";
import { useEventsByIds } from "@/hooks/useEventsByIds";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useMyEvents } from "@/hooks/useMyEvents";
import type { Event } from "@/types/firebaseTypes";

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  approved: {
    label: "Approved",
    icon: "check_circle",
    style: { background: "oklch(94% 0.06 162)", color: "oklch(26% 0.12 162)", border: "1px solid oklch(72% 0.13 162 / 0.5)" },
  },
  pending: {
    label: "Pending review",
    icon: "schedule",
    style: { background: "oklch(95% 0.07 75)", color: "oklch(30% 0.13 75)", border: "1px solid oklch(74% 0.14 75 / 0.5)" },
  },
  rejected: {
    label: "Not approved",
    icon: "cancel",
    style: { background: "oklch(94% 0.05 20)", color: "oklch(32% 0.13 20)", border: "1px solid oklch(66% 0.16 20 / 0.5)" },
  },
} as const;

function StatusBadge({ status }: { status: Event["status"] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide"
      style={cfg.style as CSSProperties}
    >
      <span className="material-symbols-outlined text-[13px] leading-none">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

// ── My Event row card ─────────────────────────────────────────────────────────

function MyEventRow({ event }: { event: Event }) {
  const navigate = useNavigate();
  const dateStr = event.date?.toDate?.()?.toLocaleDateString("en-CA", {
    weekday: "short", month: "short", day: "numeric",
  }) ?? "TBD";

  const gradient = [
    "linear-gradient(135deg, #f97316, #a855f7)",
    "linear-gradient(135deg, #0ea5e9, #84cc16)",
    "linear-gradient(135deg, #7c3aed, #ec4899)",
    "linear-gradient(135deg, #d97706, #0ea5e9)",
    "linear-gradient(135deg, #166534, #fde68a)",
  ][Math.abs([...event.id].reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0)) % 5];

  return (
    <div
      className="group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-white/60"
      onClick={() => navigate(`/events/${event.id}`)}
      style={{ boxShadow: "0 0 0 1px oklch(88% 0.04 30 / 0.4)" }}
    >
      {/* Thumbnail */}
      <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden">
        {event.imagePath ? (
          <img src={event.imagePath} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: gradient }} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[14px] leading-tight line-clamp-1 text-foreground group-hover:text-primary transition-colors">
          {event.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 text-[12px] text-muted-foreground">
          <span className="material-symbols-outlined text-[13px]">calendar_today</span>
          {dateStr}
          <span className="opacity-40 mx-0.5">·</span>
          <span className="material-symbols-outlined text-[13px]">group</span>
          {event.rsvpCount}
        </div>
      </div>

      {/* Status + edit */}
      <div className="shrink-0 flex flex-col items-end gap-2">
        <StatusBadge status={event.status} />
        {event.status !== "rejected" && (
          <button
            className="text-[11px] font-semibold text-primary/70 hover:text-primary transition-colors"
            onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}/edit`); }}
          >
            Edit →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[3/4] rounded-2xl bg-muted/60 animate-pulse" />
      ))}
    </div>
  );
}

function SkeletonRows({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-20 rounded-2xl bg-muted/60 animate-pulse" />
      ))}
    </div>
  );
}

// ── Tab pill button ───────────────────────────────────────────────────────────

const TABS = [
  { id: "my-events",  icon: "edit_calendar", label: "My Events" },
  { id: "saved",      icon: "favorite",      label: "Saved"     },
  { id: "going",      icon: "celebration",   label: "Going"     },
] as const;

type TabId = typeof TABS[number]["id"];

// ── Dashboard ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialTab = (location.state as { tab?: string } | null)?.tab;
  const [activeTab, setActiveTab] = useState<TabId>(
    initialTab === "saved" || initialTab === "going" ? initialTab : "my-events"
  );
  const { user, profile } = useAuth();
  const { savedEvents, toggleEvent } = useBookmarks();

  const { data: myEvents = [],        isLoading: loadingMyEvents   } = useMyEvents(user?.uid);
  const { data: savedEventsList = [], isLoading: loadingSaved      } = useEventsByIds(savedEvents);
  const { data: goingEventsList = [], isLoading: loadingGoing      } = useEventsByIds(profile?.joinedEvents ?? []);

  const counts: Record<TabId, number> = {
    "my-events": myEvents.length,
    "saved":     savedEvents.length,
    "going":     (profile?.joinedEvents ?? []).length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">

        {/* ── Page header ── */}
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              My Space
            </h1>
            <p className="text-muted-foreground mt-1">
              {profile?.displayName ? `Hey ${profile.displayName.split(" ")[0]} 👋 ` : ""}Your events, saved & RSVPs in one spot.
            </p>
          </div>
          <button
            onClick={() => navigate("/events/new")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-all hover:brightness-110 active:scale-95"
            style={{ background: "hsl(var(--primary))", boxShadow: "0 4px 16px oklch(55% 0.20 196 / 0.35)" }}
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Post an Event
          </button>
        </div>

        {/* ── Tab pills ── */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map(({ id, icon, label }) => {
            const active = activeTab === id;
            const count = counts[id];
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-px active:scale-95"
                style={active ? {
                  background: "oklch(44% 0.14 25)",
                  color: "oklch(97% 0.01 25)",
                  boxShadow: "0 3px 12px oklch(44% 0.14 25 / 0.35)",
                  transform: "translateY(-1px)",
                } : {
                  background: "oklch(96% 0.02 30)",
                  color: "oklch(40% 0.08 30)",
                  boxShadow: "0 1px 4px oklch(50% 0.05 30 / 0.12)",
                }}
              >
                <span className="material-symbols-outlined text-[16px] leading-none">{icon}</span>
                {label}
                {count > 0 && (
                  <span
                    className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                    style={active
                      ? { background: "rgba(255,255,255,0.25)", color: "oklch(97% 0.01 25)" }
                      : { background: "oklch(44% 0.14 25 / 0.12)", color: "oklch(44% 0.14 25)" }
                    }
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Tab: My Events ── */}
        {activeTab === "my-events" && (
          <div className="animate-content-fade">
            {loadingMyEvents ? (
              <SkeletonRows count={4} />
            ) : myEvents.length === 0 ? (
              <EmptyState variant="my-events" onCta={() => navigate("/events/new")} />
            ) : (
              <div className="flex flex-col gap-3">
                {/* Summary counts */}
                <div className="flex gap-3 mb-2 flex-wrap">
                  {(["approved", "pending", "rejected"] as const).map((s) => {
                    const n = myEvents.filter(e => e.status === s).length;
                    if (n === 0) return null;
                    const cfg = STATUS_CONFIG[s];
                    return (
                      <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={cfg.style as CSSProperties}>
                        <span className="material-symbols-outlined text-[14px] leading-none">{cfg.icon}</span>
                        {n} {cfg.label}
                      </span>
                    );
                  })}
                </div>

                {myEvents.map((event) => (
                  <MyEventRow key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Saved ── */}
        {activeTab === "saved" && (
          <div className="animate-content-fade">
            {loadingSaved ? (
              <SkeletonGrid count={4} />
            ) : savedEventsList.length === 0 ? (
              <EmptyState variant="saved" onCta={() => navigate("/")} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {savedEventsList.map((event, i) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isBookmarked={true}
                    onBookmark={toggleEvent}
                    style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Going ── */}
        {activeTab === "going" && (
          <div className="animate-content-fade">
            {loadingGoing ? (
              <SkeletonGrid count={4} />
            ) : goingEventsList.length === 0 ? (
              <EmptyState variant="going" onCta={() => navigate("/")} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {goingEventsList.map((event, i) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isBookmarked={savedEvents.includes(event.id)}
                    onBookmark={toggleEvent}
                    style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
