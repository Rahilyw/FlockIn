import type { CSSProperties } from "react";

export type EmptyVariant = "saved" | "going" | "my-events" | "clubs" | "no-results";

interface Dot {
  w: number; c: string;
  top?: string; left?: string; right?: string; bottom?: string;
  r?: number; rot?: number;
}

interface PosterSpec { gradient: string; rotate: string; mb?: number; }

interface VariantCfg {
  bg: string;
  dots: Dot[];
  left: PosterSpec;
  center: PosterSpec;
  right: PosterSpec;
  anchorIcon: string;
  anchorColor: string;
  anchorGlow: string;
  ctaBg: string;
  ctaText: string;
  ctaShadow: string;
  ctaIcon: string;
  defaultMessage: string;
  defaultCta: string;
}

const V: Record<EmptyVariant, VariantCfg> = {
  saved: {
    bg: "radial-gradient(ellipse 80% 70% at 50% 30%, #fff8e9 0%, #f6f0e0 70%)",
    dots: [
      { w: 8,  c: "#24E5D2", top: "14%",    left: "10%"            },
      { w: 6,  c: "#FE6D73", top: "12%",    right: "14%"           },
      { w: 10, c: "#FFCB77", bottom: "18%", left: "14%",  r: 999   },
      { w: 7,  c: "#626CDA", bottom: "20%", right: "10%", r: 2, rot: 20 },
      { w: 5,  c: "#1F8A6E", top: "40%",    left: "6%"             },
      { w: 9,  c: "#E89B3C", top: "48%",    right: "8%", r: 2, rot: 40 },
      { w: 6,  c: "#FE6D73", top: "24%",    left: "20%", r: 2, rot: 15 },
    ],
    left:   { gradient: "linear-gradient(160deg,#FE6D73 0%,#E89B3C 60%,#FBFF96 100%)", rotate: "-6deg", mb: 6  },
    center: { gradient: "linear-gradient(160deg,#24E5D2 0%,#626CDA 60%,#FE6D73 100%)", rotate:  "3deg"         },
    right:  { gradient: "linear-gradient(160deg,#FFCB77 0%,#FE6D73 60%,#626CDA 100%)", rotate: "-3deg", mb: 10 },
    anchorIcon: "favorite", anchorColor: "#FE6D73", anchorGlow: "rgba(214,59,42,.4)",
    ctaBg: "#24E5D2", ctaText: "#07453E",
    ctaShadow: "0 4px 18px rgba(36,229,210,.45), inset 0 1px 0 rgba(255,255,255,.5)",
    ctaIcon: "explore",
    defaultMessage: "Nothing saved yet — tap the ♥ on any poster to save it here.",
    defaultCta: "Browse the Noticeboard",
  },
  going: {
    bg: "radial-gradient(ellipse 80% 70% at 50% 30%, #f0fff8 0%, #e0f7f0 70%)",
    dots: [
      { w: 9,  c: "#FFCB77", top: "12%",    left: "8%",   r: 2, rot: 15 },
      { w: 7,  c: "#FE6D73", top: "16%",    right: "10%"               },
      { w: 6,  c: "#24E5D2", bottom: "20%", left: "12%",  r: 999       },
      { w: 8,  c: "#626CDA", bottom: "22%", right: "8%",  r: 2, rot: 30 },
      { w: 5,  c: "#E89B3C", top: "38%",    left: "5%",   r: 2, rot: 45 },
      { w: 10, c: "#1F8A6E", top: "50%",    right: "6%"                },
      { w: 6,  c: "#C95D36", top: "28%",    left: "22%",  r: 999       },
      { w: 5,  c: "#FFCB77", bottom: "30%", right: "18%", r: 2, rot: 20 },
    ],
    left:   { gradient: "linear-gradient(160deg,#FFCB77 0%,#1F8A6E 60%,#24E5D2 100%)", rotate: "-8deg", mb: 8 },
    center: { gradient: "linear-gradient(160deg,#C95D36 0%,#FE6D73 55%,#626CDA 100%)", rotate:  "5deg"        },
    right:  { gradient: "linear-gradient(160deg,#626CDA 0%,#24E5D2 55%,#1F8A6E 100%)", rotate: "-4deg", mb: 4 },
    anchorIcon: "celebration", anchorColor: "#FFCB77", anchorGlow: "rgba(255,203,119,.55)",
    ctaBg: "#C95D36", ctaText: "#fff",
    ctaShadow: "0 4px 18px rgba(201,93,54,.4), inset 0 1px 0 rgba(255,255,255,.25)",
    ctaIcon: "explore",
    defaultMessage: "No RSVPs yet — find something fun happening on campus!",
    defaultCta: "Browse the Noticeboard",
  },
  "my-events": {
    bg: "radial-gradient(ellipse 80% 70% at 50% 30%, #fff4ee 0%, #f5e4d8 70%)",
    dots: [
      { w: 8,  c: "#C95D36", top: "14%",    left: "8%"              },
      { w: 6,  c: "#FFCB77", top: "10%",    right: "12%", r: 2, rot: 20 },
      { w: 10, c: "#E89B3C", bottom: "18%", left: "10%",  r: 2, rot: 35 },
      { w: 7,  c: "#5D4037", bottom: "24%", right: "8%",  r: 999       },
      { w: 5,  c: "#C95D36", top: "42%",    left: "5%",   r: 2, rot: 15 },
      { w: 8,  c: "#FFCB77", top: "46%",    right: "7%"              },
      { w: 6,  c: "#E89B3C", top: "26%",    left: "22%",  r: 999       },
    ],
    left:   { gradient: "linear-gradient(160deg,#FFCB77 0%,#C95D36 60%,#5D4037 100%)", rotate: "-5deg", mb: 4 },
    center: { gradient: "linear-gradient(160deg,#0F3D5C 0%,#2A6FC8 55%,#E89B3C 100%)", rotate:  "2deg"        },
    right:  { gradient: "linear-gradient(160deg,#E89B3C 0%,#C95D36 55%,#FFCB77 100%)", rotate: "-7deg", mb: 8 },
    anchorIcon: "edit", anchorColor: "#FFCB77", anchorGlow: "rgba(201,93,54,.45)",
    ctaBg: "#C95D36", ctaText: "#fff",
    ctaShadow: "0 4px 18px rgba(201,93,54,.4), inset 0 1px 0 rgba(255,255,255,.25)",
    ctaIcon: "add_circle",
    defaultMessage: "You haven't posted any events yet. Share something happening on campus!",
    defaultCta: "Post your first event",
  },
  clubs: {
    bg: "radial-gradient(ellipse 80% 70% at 50% 30%, #f0f8f5 0%, #dff0ea 70%)",
    dots: [
      { w: 8,  c: "#1F8A6E", top: "13%",    left: "9%"               },
      { w: 6,  c: "#24E5D2", top: "11%",    right: "13%"             },
      { w: 9,  c: "#626CDA", bottom: "20%", left: "13%",  r: 2, rot: 25 },
      { w: 7,  c: "#1F8A6E", bottom: "22%", right: "9%",  r: 999        },
      { w: 5,  c: "#24E5D2", top: "40%",    left: "5%",   r: 2, rot: 15 },
      { w: 8,  c: "#E89B3C", top: "48%",    right: "7%",  r: 2, rot: 40 },
      { w: 6,  c: "#1F8A6E", top: "25%",    left: "21%",  r: 999        },
    ],
    left:   { gradient: "linear-gradient(160deg,#1F8A6E 0%,#24E5D2 60%,#FBFF96 100%)", rotate: "-4deg", mb: 6  },
    center: { gradient: "linear-gradient(160deg,#626CDA 0%,#1F8A6E 55%,#24E5D2 100%)", rotate:  "6deg"         },
    right:  { gradient: "linear-gradient(160deg,#24E5D2 0%,#626CDA 55%,#1F8A6E 100%)", rotate: "-6deg", mb: 10 },
    anchorIcon: "group", anchorColor: "#24E5D2", anchorGlow: "rgba(36,229,210,.5)",
    ctaBg: "#1F8A6E", ctaText: "#fff",
    ctaShadow: "0 4px 18px rgba(31,138,110,.4), inset 0 1px 0 rgba(255,255,255,.25)",
    ctaIcon: "search",
    defaultMessage: "No clubs match your search. Try different keywords.",
    defaultCta: "Clear search",
  },
  "no-results": {
    bg: "radial-gradient(ellipse 80% 70% at 50% 30%, #f5f4ff 0%, #eae8f8 70%)",
    dots: [
      { w: 7,  c: "#626CDA", top: "13%",    left: "8%",   r: 2, rot: 20 },
      { w: 5,  c: "#24E5D2", top: "12%",    right: "12%"              },
      { w: 8,  c: "#FE6D73", bottom: "19%", left: "11%",  r: 999       },
      { w: 6,  c: "#626CDA", bottom: "22%", right: "9%",  r: 2, rot: 30 },
      { w: 9,  c: "#E89B3C", top: "42%",    left: "5%",   r: 2, rot: 45 },
      { w: 6,  c: "#626CDA", top: "46%",    right: "7%",  r: 999       },
      { w: 5,  c: "#24E5D2", top: "25%",    left: "20%",  r: 2, rot: 10 },
    ],
    left:   { gradient: "linear-gradient(160deg,#a5b4fc 0%,#818cf8 55%,#6366f1 100%)", rotate: "-5deg", mb: 6  },
    center: { gradient: "linear-gradient(160deg,#626CDA 0%,#a5b4fc 55%,#24E5D2 100%)", rotate:  "4deg"         },
    right:  { gradient: "linear-gradient(160deg,#c4b5fd 0%,#626CDA 55%,#818cf8 100%)", rotate: "-3deg", mb: 10 },
    anchorIcon: "search_off", anchorColor: "#626CDA", anchorGlow: "rgba(98,108,218,.45)",
    ctaBg: "#626CDA", ctaText: "#fff",
    ctaShadow: "0 4px 18px rgba(98,108,218,.4), inset 0 1px 0 rgba(255,255,255,.25)",
    ctaIcon: "restart_alt",
    defaultMessage: "Nothing matches your search. Try different keywords or clear your filters.",
    defaultCta: "Clear filters",
  },
};

interface EmptyStateProps {
  variant: EmptyVariant;
  message?: string;
  cta?: string;
  onCta?: () => void;
}

export function EmptyState({ variant, message, cta, onCta }: EmptyStateProps) {
  const cfg = V[variant];
  const msg = message ?? cfg.defaultMessage;
  const ctaLabel = cta ?? cfg.defaultCta;

  return (
    <div
      style={{
        position: "relative", overflow: "hidden",
        borderRadius: 24,
        background: cfg.bg,
        padding: "48px 24px 40px",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 20, textAlign: "center",
        boxShadow: "0 2px 12px rgba(50,40,35,.07)",
        animation: "fk-empty-enter 0.45s cubic-bezier(0.25,1,0.5,1) both",
      }}
    >
      {/* Confetti dots */}
      {cfg.dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: d.w, height: d.w,
            background: d.c,
            borderRadius: d.r != null ? d.r : "50%",
            top: d.top, left: d.left, right: d.right, bottom: d.bottom,
            transform: d.rot ? `rotate(${d.rot}deg)` : undefined,
          } as CSSProperties}
        />
      ))}

      {/* Three tilted poster cards */}
      <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 10, zIndex: 1 }}>

        {/* Left poster */}
        <div style={{
          width: 84, height: 112, borderRadius: 10,
          background: cfg.left.gradient,
          border: "3px solid #fff",
          boxShadow: "0 8px 24px rgba(50,40,35,.20)",
          transform: `rotate(${cfg.left.rotate})`,
          marginBottom: cfg.left.mb ?? 0,
          flexShrink: 0,
        }} />

        {/* Center poster — tallest, with anchor icon */}
        <div style={{
          position: "relative",
          width: 84, height: 130, borderRadius: 10,
          background: cfg.center.gradient,
          border: "3px solid #fff",
          boxShadow: "0 8px 24px rgba(50,40,35,.20)",
          transform: `rotate(${cfg.center.rotate})`,
          flexShrink: 0,
        }}>
          <div style={{
            position: "absolute", top: -16, left: "50%",
            transform: "translateX(-50%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            filter: `drop-shadow(0 4px 10px ${cfg.anchorGlow})`,
          }}>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 38,
                color: cfg.anchorColor,
                fontVariationSettings: "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 40",
              }}
            >
              {cfg.anchorIcon}
            </span>
          </div>
        </div>

        {/* Right poster */}
        <div style={{
          width: 84, height: 112, borderRadius: 10,
          background: cfg.right.gradient,
          border: "3px solid #fff",
          boxShadow: "0 8px 24px rgba(50,40,35,.20)",
          transform: `rotate(${cfg.right.rotate})`,
          marginBottom: cfg.right.mb ?? 0,
          flexShrink: 0,
        }} />
      </div>

      {/* Message */}
      <p style={{
        margin: 0,
        maxWidth: 320,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.5,
        color: "#3D2B1F",
        position: "relative", zIndex: 1,
      }}>
        {msg}
      </p>

      {/* CTA */}
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="fk-press"
          style={{
            background: cfg.ctaBg,
            color: cfg.ctaText,
            fontWeight: 800,
            fontSize: 14,
            fontFamily: "inherit",
            border: "none",
            padding: "12px 24px",
            borderRadius: 999,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            position: "relative", zIndex: 1,
            boxShadow: cfg.ctaShadow,
            transition: "all .15s var(--fk-ease-out-quart)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{cfg.ctaIcon}</span>
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
