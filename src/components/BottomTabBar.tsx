import { useNavigate, useLocation } from "react-router-dom";
import { Grid2X2, Bookmark, Plus, User } from "lucide-react";

const TABS = [
  { id: "noticeboard", label: "Noticeboard", icon: Grid2X2, route: "/" },
  { id: "saved", label: "Saved", icon: Bookmark, route: "/dashboard" },
  { id: "post", label: "Post", icon: Plus, route: "/events/new", isButton: true },
  { id: "myspace", label: "My Space", icon: User, route: "/dashboard" },
];

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (route: string) => {
    if (route === "/") {
      return location.pathname === "/";
    }
    return location.pathname === route;
  };

  const handleTabClick = (route: string) => {
    navigate(route);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-surface-variant flex items-center justify-around h-16 pb-4">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab.route);

        if (tab.isButton) {
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.route)}
              className="flex flex-col items-center justify-center gap-1 relative -top-6 w-16 h-16 rounded-full transition-all active:scale-90"
              style={{ backgroundColor: "#E07A5F" }}
            >
              <Icon size={28} color="white" strokeWidth={2} />
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.route)}
            className="flex flex-col items-center justify-center gap-1 flex-1 transition-colors"
          >
            <Icon
              size={24}
              strokeWidth={2}
              color={active ? "#E07A5F" : "#524341"}
            />
            <span
              className="text-xs font-medium"
              style={{
                color: active ? "#E07A5F" : "#524341",
              }}
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
