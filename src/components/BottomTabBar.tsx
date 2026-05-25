import { useNavigate, useLocation } from "react-router-dom";

const HIDDEN_ON = ["/login", "/signup", "/admin", "/onboarding"];

const LEFT_TABS  = [{ id: "noticeboard", label: "Noticeboard", icon: "dynamic_feed", route: "/",          tabState: null }] as const;
const RIGHT_TABS = [{ id: "myspace",     label: "My Space",    icon: "person",       route: "/dashboard", tabState: null }] as const;

const PEACOCK_GRADIENT =
  "linear-gradient(145deg, #0F3D5C 0%, #2A6FC8 28%, #1F8A6E 54%, #24E5D2 78%, #0ea5e9 100%)";

const RAINBOW_RING =
  "conic-gradient(from 0deg, #ff0080, #ff6b00, #ffd700, #00e676, #00b4d8, #7c4dff, #ff0080)";

const ACTIVE_BG  = "#C7F5EF";
const ACTIVE_FG  = "#1F8A6E";
const INACTIVE   = "#a8a29e";

const BottomTabBar = () => {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;

  const isActive = (id: string) => {
    if (id === "noticeboard") return pathname === "/";
    if (id === "myspace")     return pathname.startsWith("/dashboard") || pathname.startsWith("/profile");
    return false;
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        height: 68,
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* Tab row */}
      <div className="flex items-end h-full px-1 pb-3">

        {/* Left tab */}
        {LEFT_TABS.map((tab) => {
          const active = isActive(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.route)}
              className="flex-1 flex flex-col items-center gap-[2px] pt-2"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <div
                className="flex items-center justify-center rounded-full transition-all duration-200"
                style={{ width: 52, height: 30, background: active ? ACTIVE_BG : "transparent" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 20,
                    color: active ? ACTIVE_FG : INACTIVE,
                    fontVariationSettings: active ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400",
                    transition: "color 0.2s",
                  }}
                >
                  {tab.icon}
                </span>
              </div>
              <span className="text-[9.5px] font-bold leading-none" style={{ color: active ? ACTIVE_FG : INACTIVE }}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* FAB spacer */}
        <div style={{ width: 72, flexShrink: 0 }} />

        {/* Right tab */}
        {RIGHT_TABS.map((tab) => {
          const active = isActive(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.route)}
              className="flex-1 flex flex-col items-center gap-[2px] pt-2"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <div
                className="flex items-center justify-center rounded-full transition-all duration-200"
                style={{ width: 52, height: 30, background: active ? ACTIVE_BG : "transparent" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 20,
                    color: active ? ACTIVE_FG : INACTIVE,
                    fontVariationSettings: active ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400",
                    transition: "color 0.2s",
                  }}
                >
                  {tab.icon}
                </span>
              </div>
              <span className="text-[9.5px] font-bold leading-none" style={{ color: active ? ACTIVE_FG : INACTIVE }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* FAB — floats above bar center */}
      <button
        onClick={() => navigate("/events/new")}
        aria-label="Post an event"
        className="fk-press absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: 18,
          width: 62, height: 62,
          borderRadius: "50%",
          padding: 3,
          background: RAINBOW_RING,
          boxShadow: "0 6px 24px rgba(0,0,0,0.22), 0 2px 8px rgba(36,229,210,0.35)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Peacock inner disc */}
        <div
          style={{
            width: "100%", height: "100%",
            borderRadius: "50%",
            background: PEACOCK_GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 28,
              color: "#fff",
              fontVariationSettings: "'FILL' 1, 'wght' 600",
            }}
          >
            add
          </span>
        </div>
      </button>
    </nav>
  );
};

export default BottomTabBar;
