import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import type { Event } from "@/types/firebaseTypes";
import type { Timestamp } from "firebase/firestore";

const CATEGORY_STYLE: Record<string, { bg: string; color: string; icon: string }> = {
  Music:    { bg: "#E2E4FB", color: "#3a44b8", icon: "music_note" },
  Art:      { bg: "#FFF4D8", color: "#7a5a10", icon: "palette" },
  Workshop: { bg: "#DDF3DD", color: "#1f5a2a", icon: "build" },
  Social:   { bg: "#F6D8FF", color: "#5d2a7a", icon: "people" },
  Sport:    { bg: "#D8E3FF", color: "#1f3a8c", icon: "sports" },
  Academic: { bg: "#FFE8C7", color: "#7a4a10", icon: "school" },
  Career:   { bg: "#E2E4FB", color: "#3a44b8", icon: "work" },
  Food:     { bg: "#FFE0D5", color: "#7c2d12", icon: "restaurant" },
  Other:    { bg: "#E4E2DD", color: "#524341", icon: "category" },
};

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

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function formatDate(ts: Timestamp | null | undefined): string {
  if (!ts?.toDate) return "Date TBD";
  return ts.toDate().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function formatTime(ts: Timestamp | null | undefined): string | null {
  if (!ts?.toDate) return null;
  return ts.toDate().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function isPdfUrl(url: string): boolean {
  return url.split("?")[0].toLowerCase().endsWith(".pdf");
}

function InfoRow({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 20, color: "var(--fk-paprika)", marginTop: 1, flexShrink: 0 }}
      >
        {icon}
      </span>
      <span style={{ fontSize: 14, lineHeight: 1.45, color: "#2A1F1A" }}>{children}</span>
    </div>
  );
}

interface EventDetailModalProps {
  event: Event;
  isSaved: boolean;
  isAttending: boolean;
  isSavePending: boolean;
  isAttendancePending: boolean;
  onClose: () => void;
  onToggleSave: () => void;
  onToggleAttendance: () => void;
}

export function EventDetailModal({
  event,
  isSaved,
  isAttending,
  isSavePending,
  isAttendancePending,
  onClose,
  onToggleSave,
  onToggleAttendance,
}: EventDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const cat = CATEGORY_STYLE[event.category] ?? CATEGORY_STYLE.Other;
  const imagePath = event.imagePath ?? event.posterUrl ?? null;
  const showImage = imagePath && !isPdfUrl(imagePath);
  const fallbackGradient = GRADIENT_PALETTE[hashId(event.id) % GRADIENT_PALETTE.length];
  const dateStr = formatDate(event.date);
  const startTime = formatTime(event.date);
  const endTime = formatTime(event.endTime);
  const timeStr = endTime ? `${startTime} – ${endTime}` : (startTime ?? "");
  const initials = (event.creatorName || "?").split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  const handleShare = async () => {
    const url = `${window.location.origin}/events/${event.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: event.title, url }); } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard.");
      } catch {
        toast.error("Couldn't copy link.");
      }
    }
  };

  return createPortal(
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(15,12,10,.55)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex", justifyContent: "center", alignItems: "flex-start",
        padding: "40px 16px", overflowY: "auto",
      }}
    >
      <div
        style={{
          background: "rgba(255,253,247,0.98)",
          borderRadius: 28,
          maxWidth: 860, width: "100%",
          boxShadow: "0 30px 80px rgba(0,0,0,.40)",
          overflow: "hidden",
          position: "relative",
          marginBottom: 40,
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close event detail"
          style={{
            position: "absolute", top: 18, right: 18, zIndex: 5,
            width: 36, height: 36, borderRadius: 999,
            background: "rgba(255,255,255,.85)", border: "none", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,.15)",
            transition: "all .15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.85)"; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
        </button>

        {/* Two-column grid — stacks on mobile */}
        <div className="fk-detail-grid" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 32, padding: 32 }}>

          {/* ── Poster ── */}
          <div>
            <div style={{
              borderRadius: 20, overflow: "hidden",
              border: "4px solid #fff",
              boxShadow: "0 20px 60px rgba(20,15,10,.30), 0 4px 12px rgba(20,15,10,.15)",
              aspectRatio: "3 / 4",
              position: "relative",
              background: "#1B1C19",
            }}>
              {showImage ? (
                <img
                  src={imagePath!}
                  alt={event.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{
                  position: "absolute", inset: 0,
                  background: fallbackGradient,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.9)", gap: 12, padding: 20,
                }}>
                  <div style={{ width: 56, height: 3, background: "rgba(255,255,255,.35)", borderRadius: 999 }} />
                  <div style={{ fontWeight: 800, fontSize: 18, textAlign: "center", lineHeight: 1.2, fontFamily: "Montserrat, sans-serif" }}>
                    {event.title}
                  </div>
                  <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.55 }}>FlockIn!!</div>
                </div>
              )}

              {/* Going count */}
              {event.rsvpCount > 0 && (
                <div style={{
                  position: "absolute", bottom: 14, left: 14,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 999,
                  background: "rgba(0,0,0,.45)", backdropFilter: "blur(8px)",
                  color: "#fff", fontSize: 12, fontWeight: 800,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>group</span>
                  {event.rsvpCount} going
                </div>
              )}
            </div>

            {/* View full page link */}
            <Link
              to={`/events/${event.id}`}
              onClick={onClose}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                marginTop: 16, color: "#6a5a50", fontSize: 12, fontWeight: 700,
                textDecoration: "none", opacity: 0.65,
                transition: "opacity .15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.65"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
              View full page
            </Link>
          </div>

          {/* ── Details ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>

            {/* Category + Title */}
            <div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 12px", borderRadius: 999,
                background: cat.bg, color: cat.color,
                fontSize: 11, fontWeight: 800, marginBottom: 10,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{cat.icon}</span>
                {event.category}
              </span>
              <h2 style={{
                margin: 0, fontSize: 30, fontWeight: 800,
                letterSpacing: "-0.02em", lineHeight: 1.1,
                fontFamily: "Montserrat, sans-serif", wordBreak: "break-word",
              }}>
                {event.title}
              </h2>
            </div>

            {/* Date / time / location */}
            <div style={{
              display: "flex", flexDirection: "column", gap: 12,
              padding: "16px 18px", borderRadius: 18,
              background: "rgba(255,253,247,.65)",
              border: "1px solid rgba(170,140,120,.30)",
              boxShadow: "0 1px 8px rgba(50,40,35,.05)",
            }}>
              <InfoRow icon="calendar_today"><strong>{dateStr}</strong></InfoRow>
              {timeStr && <InfoRow icon="schedule">{timeStr}</InfoRow>}
              <InfoRow icon="location_on">{event.location}</InfoRow>
            </div>

            {/* Organiser */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {event.creatorPhoto ? (
                <img
                  src={event.creatorPhoto}
                  alt={event.creatorName}
                  style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                />
              ) : (
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: "var(--fk-paprika)", color: "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 14, fontFamily: "Montserrat, sans-serif",
                }}>
                  {initials}
                </div>
              )}
              <div>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fk-paprika)", opacity: 0.8 }}>
                  ORGANISED BY
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, color: "#2A1F1A" }}>
                  {event.creatorName}
                </p>
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(0,0,0,.08)" }} />

            {/* Description */}
            <div>
              <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fk-paprika)" }}>
                ABOUT THIS EVENT
              </p>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "#2A1F1A" }}>
                {event.description}
              </p>
            </div>

            {/* Tags */}
            {event.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {event.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: "4px 12px", borderRadius: 999,
                      fontSize: 12, fontWeight: 800,
                      background: "#fff", color: "var(--fk-paprika)",
                      border: "1.5px solid rgba(201,93,54,.40)",
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Action row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 4 }}>
              <button
                onClick={onToggleAttendance}
                disabled={isAttendancePending}
                className="fk-press"
                style={{
                  flex: 1, padding: "14px 16px", borderRadius: 16,
                  background: isAttending ? "#FFE0D5" : "var(--fk-paprika)",
                  color: isAttending ? "#7c2d12" : "#fff",
                  border: isAttending ? "1.5px solid rgba(201,93,54,.40)" : "none",
                  fontFamily: "inherit", fontWeight: 800, fontSize: 15,
                  boxShadow: isAttending ? "none" : "0 4px 16px rgba(201,93,54,.35)",
                  cursor: isAttendancePending ? "wait" : "pointer",
                  opacity: isAttendancePending ? 0.7 : 1,
                  transition: "all .15s",
                }}
              >
                {isAttendancePending ? "Saving…" : isAttending ? "✓ You're going" : "I'm going! 🎉"}
              </button>

              <button
                onClick={onToggleSave}
                disabled={isSavePending}
                aria-pressed={isSaved}
                aria-label={isSaved ? "Remove from saved" : "Save event"}
                style={{
                  width: 46, height: 46, borderRadius: 999, flexShrink: 0,
                  background: isSaved ? "rgba(254,109,115,.20)" : "rgba(255,255,255,.7)",
                  border: isSaved ? "1.5px solid rgba(214,59,42,.4)" : "1.5px solid rgba(170,140,120,.4)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  cursor: isSavePending ? "wait" : "pointer",
                  color: isSaved ? "#a8323a" : "#6a5a50",
                  transition: "all .15s",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 20,
                    fontVariationSettings: isSaved ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" : undefined,
                  }}
                >
                  favorite
                </span>
              </button>

              <button
                onClick={handleShare}
                aria-label="Share event"
                style={{
                  width: 46, height: 46, borderRadius: 999, flexShrink: 0,
                  background: "rgba(255,255,255,.7)",
                  border: "1.5px solid rgba(170,140,120,.4)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  color: "#6a5a50",
                  transition: "all .15s",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>ios_share</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
