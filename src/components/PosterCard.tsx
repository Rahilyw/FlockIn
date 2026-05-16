interface PosterCardProps {
  title: string;
  date: string;
  location: string;
  description: string;
  rotation: number;
  attachmentType: "pushpin" | "washi";
  pushpinColor?: string;
  washiColor?: string;
  washiSide?: "left" | "right";
  washiRotation?: number;
  posterGradient: string;
  posterAccentColor?: string;
  actionLabel: string;
  actionClassName: string;
  marginTop?: number;
}

const PosterCard = ({
  title,
  date,
  location,
  description,
  rotation,
  attachmentType,
  pushpinColor = "#FF5252",
  washiColor = "rgba(178, 235, 242, 0.70)",
  washiSide = "right",
  washiRotation = -12,
  posterGradient,
  actionLabel,
  actionClassName,
  marginTop = 0,
}: PosterCardProps) => {
  return (
    <div
      className="poster-card group relative"
      style={{ transform: `rotate(${rotation}deg)`, marginTop: `${marginTop}px` }}
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
        {/* Poster visual — gradient art */}
        <div
          className="w-full aspect-[3/4] relative"
          style={{ background: posterGradient }}
        >
          {/* Decorative poster content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white/90">
            <div className="w-16 h-1 bg-white/40 rounded-full mb-3" />
            <div className="w-24 h-1 bg-white/25 rounded-full mb-6" />
            <div className="text-center font-bold text-lg leading-tight drop-shadow">{title}</div>
            <div className="w-20 h-0.5 bg-white/30 rounded-full mt-4" />
            <div className="text-xs opacity-60 mt-2 tracking-widest uppercase">FlockIn!!</div>
          </div>

          {/* Hover glass overlay */}
          <div className="glass-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col p-6 text-white justify-end">
            <h3 className="font-bold text-xl mb-2 leading-tight">{title}</h3>
            <div className="flex items-center gap-2 mb-1 text-white/80">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span className="text-xs font-semibold tracking-wide">{date}</span>
            </div>
            <div className="flex items-center gap-2 mb-4 text-white/80">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              <span className="text-xs font-semibold tracking-wide">{location}</span>
            </div>
            <p className="text-sm mb-5 line-clamp-3 text-white/70">{description}</p>
            <div className="flex items-center justify-between">
              <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-red-400/40 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
              </button>
              <button className={`px-5 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform ${actionClassName}`}>
                {actionLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterCard;
