import { useNavigate, useLocation } from "react-router-dom";
import { Grid2X2, Bookmark, Plus, User } from "lucide-react";

const HIDDEN_ON = ["/login", "/signup", "/admin", "/onboarding"];

const TABS = [
  { id: "noticeboard", label: "Noticeboard", icon: Grid2X2, route: "/" },
  { id: "saved",       label: "Saved",       icon: Bookmark, route: "/dashboard", tabState: "saved" },
  { id: "post",        label: "Post",         icon: Plus,     route: "/events/new", isButton: true },
  { id: "myspace",     label: "My Space",     icon: User,     route: "/dashboard" },
] as const;

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (HIDDEN_ON.some((p) => location.pathname === p || location.pathname.startsWith(p + "/"))) {
    return null;
  }

  const isActive = (route: string, tabId: string) => {
    if (route === "/") return location.pathname === "/";
    if (tabId === "saved") return false; // never highlight Saved — My Space owns /dashboard highlight
    return location.pathname === route;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-surface-variant flex items-center justify-around h-16 pb-4">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab.route, tab.id);

        if (tab.isButton) {
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.route)}
              className="flex flex-col items-center justify-center gap-1 relative -top-6 w-16 h-16 rounded-full transition-all active:scale-90"
              style={{ backgroundColor: "#E07A5F" }}
              aria-label="Post an event"
            >
              <Icon size={28} color="white" strokeWidth={2} />
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
            className="flex flex-col items-center justify-center gap-1 flex-1 transition-colors"
          >
            <Icon size={24} strokeWidth={2} color={active ? "#E07A5F" : "#524341"} />
            <span className="text-xs font-medium" style={{ color: active ? "#E07A5F" : "#524341" }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomTabBar;
