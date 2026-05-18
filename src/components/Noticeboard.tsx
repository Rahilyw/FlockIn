import PosterCard from "./PosterCard";
import { useEvents } from "@/hooks/useEvents";
import type { EventCategory } from "@/types/firebaseTypes";

// ── Visual presets cycling by card index ──────────────────────────────────────

const ROTATIONS = [-2, 3, -1, 6, -3, 2, -5, 4, -1, 3, -4, 2];
const MARGIN_TOPS = [0, 48, 24, 80, 16, 60, 32, 72, 8, 56, 40, 64];

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

const FALLBACK_GRADIENTS = [
  "linear-gradient(160deg, #f97316 0%, #a855f7 50%, #3b82f6 100%)",
  "linear-gradient(160deg, #134e4a 0%, #0ea5e9 60%, #67e8f9 100%)",
  "linear-gradient(160deg, #166534 0%, #84cc16 60%, #fde68a 100%)",
  "linear-gradient(160deg, #1e1b4b 0%, #7c3aed 55%, #ec4899 100%)",
  "linear-gradient(160deg, #7f1d1d 0%, #f97316 55%, #fde68a 100%)",
  "linear-gradient(160deg, #0c4a6e 0%, #0ea5e9 55%, #a7f3d0 100%)",
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

function SkeletonCard({ index }: { index: number }) {
  const rotation = ROTATIONS[index % ROTATIONS.length];
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

const Noticeboard = () => {
  const { data: events, isLoading, isError } = useEvents({ limit: 22 });

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

          return (
            <PosterCard
              key={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              description={event.description}
              posterUrl={event.posterUrl}
              rotation={ROTATIONS[i % ROTATIONS.length]}
              marginTop={MARGIN_TOPS[i % MARGIN_TOPS.length]}
              fallbackGradient={FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length]}
              actionLabel={action.label}
              actionClassName={action.className}
              {...attachment}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Noticeboard;
