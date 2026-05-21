import type React from "react";
import type { Timestamp } from "firebase/firestore";

interface PosterCardProps {
  title: string;
  date: Timestamp;
  location: string;
  description: string;
  posterUrl: string | null;
  rotation: number;
  attachmentType: "pushpin" | "washi";
  pushpinColor?: string;
  washiColor?: string;
  washiSide?: "left" | "right";
  washiRotation?: number;
  fallbackGradient: string;
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
}

function formatDate(ts: Timestamp): string {
  return ts.toDate().toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isPdfUrl(url: string): boolean {
  return url.split("?")[0].toLowerCase().endsWith(".pdf");
}

const PosterCard = ({
  title,
  date,
  location,
  description,
  posterUrl,
  rotation,
  attachmentType,
  pushpinColor = "#FF5252",
  washiColor = "rgba(178, 235, 242, 0.70)",
  washiSide = "right",
  washiRotation = -12,
  fallbackGradient,
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
}: PosterCardProps) => {
  const showImage = posterUrl && !isPdfUrl(posterUrl);
  const showPdf = posterUrl && isPdfUrl(posterUrl);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      className="poster-card group relative cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      style={{ transform: `rotate(${rotation}deg)`, marginTop: `${marginTop}px` }}
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
          className="washi-tape absolute z-20 h-7 shadow-sm border border-white/30"
          style={{
            width: "72px",
            top: 0,
            [washiSide]: "16px",
            backgroundColor: washiColor,
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
              src={posterUrl}
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
          {!posterUrl && (
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

          {/* Hover glass overlay */}
          <div className="glass-overlay absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex flex-col p-6 text-white justify-end">
            <h3 className="font-bold text-xl mb-2 leading-tight">{title}</h3>
            <div className="flex items-center gap-2 mb-1 text-white/80">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span className="text-xs font-semibold tracking-wide">{formatDate(date)}</span>
            </div>
            <div className="flex items-center gap-2 mb-4 text-white/80">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              <span className="text-xs font-semibold tracking-wide">{location}</span>
            </div>
            <p className="text-sm mb-5 line-clamp-3 text-white/70">{description}</p>
            <div className="flex items-center justify-between">
              <button
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:cursor-wait disabled:opacity-70 ${
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
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: isSaved ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" : undefined }}
                >
                  favorite
                </span>
              </button>
              <button
                type="button"
                className={`px-5 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform disabled:cursor-wait disabled:opacity-75 ${
                  isAttending ? "bg-white/20 text-white ring-1 ring-white/30" : actionClassName
                }`}
                aria-pressed={isAttending}
                disabled={isAttendancePending}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleAttendance();
                }}
              >
                {isAttendancePending ? "Saving..." : isAttending ? "Leave" : actionLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterCard;
