import React from "react";

const POLAROIDS = [
  {
    title: "Open Mic Night",
    hashtag: "#TONIGHT",
    gradient: "linear-gradient(145deg, #4f7de8 0%, #7b52c4 100%)",
    style: { top: "72px", left: "48px", transform: "rotate(-9deg)" },
    pinColor: "#FFD54F",
  },
  {
    title: "Pottery Workshop",
    hashtag: "#HAPPENING",
    gradient: "linear-gradient(145deg, #e8a85a 0%, #c07030 100%)",
    style: { top: "72px", right: "48px", transform: "rotate(6deg)" },
    pinColor: "#FFD54F",
  },
  {
    title: "Free Pizza Social",
    hashtag: "#FREEPIZZA",
    gradient: "linear-gradient(145deg, #38d9c8 0%, #1fa898 100%)",
    style: { bottom: "90px", left: "48px", transform: "rotate(5deg)" },
    pinColor: "#FFD54F",
  },
  {
    title: "Improv Comedy Show",
    hashtag: "#THISWEEK",
    gradient: "linear-gradient(145deg, #b088e0 0%, #e87fd8 100%)",
    style: { bottom: "90px", right: "48px", transform: "rotate(-6deg)" },
    pinColor: "#FFD54F",
  },
];

export function AuthBoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center select-none"
      style={{
        backgroundColor: "#3a7d52",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        boxShadow: "inset 0 0 80px rgba(0,0,0,0.18)",
      }}
    >
      {/* Wooden top frame */}
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: 20,
          background: "linear-gradient(to bottom, #8B6344 0%, #6D4C41 45%, #4E342E 100%)",
          borderBottom: "2px solid #3E2723",
          boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
        }}
      />

      {/* Wooden bottom frame */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: 20,
          background: "linear-gradient(to top, #8B6344 0%, #6D4C41 45%, #4E342E 100%)",
          borderTop: "2px solid #3E2723",
          boxShadow: "0 -4px 14px rgba(0,0,0,0.45)",
        }}
      />

      {/* Floating polaroid cards */}
      {POLAROIDS.map((p) => (
        <div
          key={p.title}
          className="absolute hidden lg:block"
          style={p.style as React.CSSProperties}
        >
          {/* Pushpin */}
          <div
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, #fff4 0%, transparent 60%), ${p.pinColor}`,
              position: "absolute",
              top: -7,
              left: "50%",
              transform: "translateX(-50%)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.55), inset 0 -1px 2px rgba(0,0,0,0.25)",
              zIndex: 2,
            }}
          />
          {/* Polaroid body */}
          <div
            style={{
              width: 116,
              background: "#FFFEF8",
              borderRadius: 4,
              padding: "7px 7px 22px 7px",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: 76,
                borderRadius: 2,
                background: p.gradient,
              }}
            />
            <div style={{ padding: "9px 4px 0", textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: 9.5,
                  color: "#1B1C19",
                  lineHeight: 1.3,
                  marginBottom: 4,
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 900,
                  fontSize: 7.5,
                  color: "#C95D36",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {p.hashtag}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-20 w-full flex items-center justify-center px-4 py-10">
        {children}
      </div>
    </div>
  );
}
