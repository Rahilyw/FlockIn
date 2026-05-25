import { useNavigate, useLocation } from "react-router-dom";

const HIDDEN_ON = ["/login", "/signup", "/admin", "/onboarding"];

const TABS = [
  { id: "noticeboard", label: "Noticeboard", icon: "dynamic_feed", route: "/" },
  { id: "saved",       label: "Saved",       icon: "bookmark",     route: "/dashboard", tabState: "saved" },
  { id: "post",        label: "Post",         icon: "add",          route: "/events/new", isButton: true },
  { id: "myspace",     label: "My Space",     icon: "person",       route: "/dashboard" },
] as const;

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (HIDDEN_ON.some((p) => location.pathname === p || location.pathname.startsWith(p + "/"))) {
    return null;
  }

  const isActive = (route: string, tabId: string) => {
    if (route === "/") return location.pathname === "/";
    if (tabId === "saved") return false;
    return location.pathname === route || location.pathname.startsWith(route + "/");
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around"
      style={{
        background: "#fff",
        borderTop: "1px solid var(--fk-border)",
        height: 70,
        padding: "0 4px 12px",
        boxShadow: "0 -4px 16px rgba(50,40,35,.06)",
      }}
    >
      {TABS.map((tab) => {
        const active = isActive(tab.route, tab.id);

        if (tab.isButton) {
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.route)}
              aria-label="Post an event"
              className="fk-press flex items-center justify-center"
              style={{
                position: "relative",
                top: -18,
                width: 58,
                height: 58,
                borderRadius: 999,
                background: "var(--fk-paprika)",
                color: "#fff",
                border: "none",
                boxShadow: "0 8px 22px rgba(201,93,54,.45)",
                cursor: "pointer",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                {tab.icon}
              </span>
            </button>
          );
        }

        const handleClick = () => {
          if ("tabState" in tab && tab.tabState) {
            navigate(tab.route, { state: { tab: tab.tabState } });
          } else {
            navigate(tab.route);
          }
        };

        return (
          <button
            key={tab.id}
            onClick={handleClick}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 22,
                color: active ? "var(--fk-paprika)" : "var(--fk-fg-muted)",
                fontVariationSettings: active
                  ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
                  : undefined,
              }}
            >
              {tab.icon}
            </span>
            <span
              className="text-[10px] font-bold"
              style={{ color: active ? "var(--fk-paprika)" : "var(--fk-fg-muted)" }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomTabBar;
