import type React from "react";
import type { Timestamp } from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Soft palette for placeholder avatar circles in the social-proof deck
const AVATAR_COLORS = ["#f97316", "#a855f7", "#3b82f6", "#10b981", "#ec4899", "#f59e0b"];

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

interface PosterCardProps {
  eventId: string;
  title: string;
  date: Timestamp | string | null | undefined;
  endTime: Timestamp | string | null | undefined;
  location: string;
  description: string;
  imagePath: string | null;
  rotation: string;
  attachmentType: "pushpin" | "washi";
  pushpinColor?: string;
  washiColor?: string;
  washiSide?: "left" | "right";
  washiRotation?: number;
  actionLabel: string;
  actionClassName: string;
  marginTop?: number;
  onOpen: () => void;
  isSaved: boolean;
  isAttending: boolean;
  isSavePending?: boolean;
  isAttendancePending?: boolean;
  onToggleSave: () => void;
  onToggleAttendance: () => void;
  onReport?: () => void;
  rsvpCount?: number;
  attendingUserAvatar?: string | null;
}

function formatDate(ts: Timestamp | string | null | undefined): string {
  if (!ts) return "Date TBD";
  if (typeof ts === "string") return ts;
  if (typeof ts.toDate !== "function") return "Date TBD";
  return ts.toDate().toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(ts: Timestamp | string | null | undefined): string | null {
  if (!ts) return null;
  if (typeof ts === "string") return ts; // legacy string storage e.g. "9:00 PM"
  if (typeof ts.toDate !== "function") return null;
  return ts.toDate().toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
}

function isPdfUrl(url: string): boolean {
  return url.split("?")[0].toLowerCase().endsWith(".pdf");
}

const PosterCard = ({
  eventId,
  title,
  date,
  endTime,
  location,
  description,
  imagePath,
  rotation,
  attachmentType,
  pushpinColor = "#FF5252",
  washiColor = "rgba(178, 235, 242, 0.70)",
  washiSide = "right",
  washiRotation = -12,
  actionLabel,
  actionClassName,
  marginTop = 0,
  onOpen,
  isSaved,
  isAttending,
  isSavePending = false,
  isAttendancePending = false,
  onToggleSave,
  onToggleAttendance,
  onReport,
  rsvpCount = 0,
  attendingUserAvatar = null,
}: PosterCardProps) => {
  const fallbackGradient = GRADIENT_PALETTE[hashId(eventId) % GRADIENT_PALETTE.length];
  const showImage = imagePath && !isPdfUrl(imagePath);
  const showPdf = imagePath && isPdfUrl(imagePath);

  // True when the event's date matches today — drives the "Today" pulse badge
  const isExpiringSoon = (() => {
    if (!date || typeof date === "string") return false;
    const ts = date as { toDate?: () => Date };
    if (typeof ts.toDate !== "function") return false;
    const d = ts.toDate();
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  })();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      className="poster-card group relative cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      style={{ transform: `rotate(${rotation})`, marginTop: `${marginTop}px` }}
      role="link"
      tabIndex={0}
      aria-label={`Open event: ${title}`}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      {/* Attachment */}
      {attachmentType === "pushpin" ? (
        <div className="pushpin" style={{ backgroundColor: pushpinColor }} />
      ) : (
        <div
          className="washi-tape absolute z-20 h-7 shadow-sm border border-white/20"
          style={{
            width: "76px",
            top: "-13px",
            [washiSide]: "14px",
            background: washiColor,
            transform: `rotate(${washiRotation}deg)`,
          }}
        />
      )}

      {/* Card */}
      <div className="relative rounded-lg overflow-hidden shadow-xl border-4 border-white">
        <div className="w-full aspect-[3/4] relative">

          {/* Poster image */}
          {showImage && (
            <img
              src={imagePath}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          )}

          {/* PDF placeholder */}
          {showPdf && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              style={{ background: fallbackGradient }}
            >
              <span className="material-symbols-outlined text-white/80 text-[48px]">picture_as_pdf</span>
              <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">Event Poster</span>
            </div>
          )}

          {/* No poster fallback */}
          {!imagePath && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white/90"
              style={{ background: fallbackGradient }}
            >
              <div className="w-16 h-1 bg-white/40 rounded-full mb-3" />
              <div className="w-24 h-1 bg-white/25 rounded-full mb-6" />
              <div className="text-center font-bold text-lg leading-tight drop-shadow">{title}</div>
              <div className="w-20 h-0.5 bg-white/30 rounded-full mt-4" />
              <div className="text-xs opacity-60 mt-2 tracking-widest uppercase">FlockIn!!</div>
            </div>
          )}

          {/* Today badge — always visible, floats above the hover overlay */}
          {isExpiringSoon && (
            <div
              className="absolute top-2 left-2 sm:top-3 sm:left-3 z-30 flex items-center gap-1 px-1.5 py-0.5 rounded-full pointer-events-none"
              style={{ background: "rgba(251,191,36,0.92)", backdropFilter: "blur(4px)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-800 animate-pulse shrink-0" />
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-amber-900">Today</span>
            </div>
          )}

          {/* Hover glass overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex flex-col p-3 sm:p-5 text-white justify-end"
            style={{
              background: 'linear-gradient(180deg, rgba(20,15,12,0.0) 0%, rgba(20,15,12,0.55) 35%, rgba(20,15,12,0.94) 75%)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
            }}
          >

            {/* ··· report menu — top-right */}
            {onReport && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                      aria-label="More options"
                    >
                      <span className="material-symbols-outlined text-[14px] sm:text-[18px]">more_horiz</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[140px]">
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                      onClick={onReport}
                    >
                      <span className="material-symbols-outlined text-[16px]">flag</span>
                      Report event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <h3 className="font-bold text-[11px] sm:text-sm lg:text-base mb-1 leading-tight line-clamp-2">{title}</h3>
            <div className="flex items-center gap-1 sm:gap-2 mb-0.5">
              <span className="material-symbols-outlined text-[12px] sm:text-[15px] lg:text-[18px] shrink-0" style={{ color: '#FFCB77' }}>calendar_today</span>
              <span className="text-[9px] sm:text-[11px] lg:text-[13px] font-semibold tracking-wide text-white/90 truncate">
                {(() => {
                  const startT = formatTime(date);
                  const endT = formatTime(endTime);
                  return endT
                    ? `${formatDate(date)} · ${startT} → ${endT}`
                    : `${formatDate(date)}${startT ? ` · ${startT}` : ""}`;
                })()}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-2 lg:mb-3">
              <span className="material-symbols-outlined text-[12px] sm:text-[15px] lg:text-[18px] shrink-0" style={{ color: '#24E5D2' }}>location_on</span>
              <span className="text-[9px] sm:text-[11px] lg:text-[13px] font-semibold tracking-wide text-white/90 truncate">{location}</span>
            </div>

            {/* Social proof — avatar deck + going count */}
            {rsvpCount > 0 && (
              <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                <div className="flex items-center">
                  {attendingUserAvatar && (
                    <img
                      src={attendingUserAvatar}
                      alt="You"
                      className="w-[18px] h-[18px] sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full object-cover ring-[1.5px] ring-black/25 shrink-0"
                    />
                  )}
                  {Array.from({
                    length: Math.min(
                      rsvpCount - (attendingUserAvatar ? 1 : 0),
                      attendingUserAvatar ? 2 : 3,
                    ),
                  }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[18px] h-[18px] sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full ring-[1.5px] ring-black/25 shrink-0"
                      style={{
                        background: AVATAR_COLORS[(i + (attendingUserAvatar ? 1 : 0)) % AVATAR_COLORS.length],
                        marginLeft: attendingUserAvatar || i > 0 ? "-5px" : 0,
                      }}
                    />
                  ))}
                  {rsvpCount > (attendingUserAvatar ? 3 : 3) && (
                    <div
                      className="w-[18px] h-[18px] sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full ring-[1.5px] ring-black/25 shrink-0 flex items-center justify-center text-[7px] sm:text-[8px] lg:text-[9px] font-bold text-white"
                      style={{ background: "rgba(255,255,255,0.22)", marginLeft: "-5px" }}
                    >
                      +{rsvpCount - (attendingUserAvatar ? 2 : 3)}
                    </div>
                  )}
                </div>
                <span className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-white/75 leading-none">
                  {rsvpCount === 1 ? "1 going" : `${rsvpCount} going`}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-1">
              <button
                type="button"
                className={`w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-colors disabled:cursor-wait disabled:opacity-70 shrink-0 ${
                  isSaved ? "bg-red-400/80 text-white hover:bg-red-400" : "bg-white/20 hover:bg-red-400/40"
                }`}
                aria-label={isSaved ? `Remove ${title} from saved events` : `Save ${title}`}
                aria-pressed={isSaved}
                disabled={isSavePending}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleSave();
                }}
              >
                <span
                  className="material-symbols-outlined text-[14px] sm:text-[18px] lg:text-[22px]"
                  style={{ fontVariationSettings: isSaved ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" : undefined }}
                >
                  favorite
                </span>
              </button>
              <button
                type="button"
                className="px-2 py-1 sm:px-4 sm:py-1.5 lg:px-5 lg:py-2 rounded-full font-bold text-[9px] sm:text-xs lg:text-sm hover:scale-105 transition-transform disabled:cursor-wait disabled:opacity-75 truncate"
                style={isAttending
                  ? { background: 'rgba(255,255,255,0.20)', color: '#fff', boxShadow: '0 0 0 1px rgba(255,255,255,0.3)' }
                  : { background: '#24E5D2', color: '#07453E' }
                }
                aria-pressed={isAttending}
                disabled={isAttendancePending}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleAttendance();
                }}
              >
                {isAttendancePending ? "…" : isAttending ? "✓ Going" : "I'm going!"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterCard;
