import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Noticeboard from "@/components/Noticeboard";

const TAGS = [
  { label: "#Tonight", bg: "#FFD6E0", color: "#7A423A" },
  { label: "#ArtsWeek", bg: "#E0F2F1", color: "#214E43" },
  { label: "#CareerFair", bg: "#F3E5F5", color: "#434463" },
  { label: "#FreePizza", bg: "#FFF9C4", color: "#894E45" },
  { label: "#LiveMusic", bg: "#D1C4E9", color: "#5A5C7C" },
];

const NAV_ITEMS = [
  { icon: "dynamic_feed", label: "Your Feed", to: "/", active: true, color: "" },
  { icon: "trending_up", label: "Trending", to: "/trending", active: false, color: "#F6AD55" },
  { icon: "bookmark", label: "Saved", to: "/saved", active: false, color: "#F687B3" },
  { icon: "calendar_today", label: "Calendar", to: "/dashboard", active: false, color: "#63B3ED" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-[280px] sticky top-16 h-[calc(100vh-4rem)] bg-surface-container-low border-r border-outline-variant/30 p-margin-desktop gap-2 shadow-md overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold leading-tight text-primary">Welcome back</h2>
            <p className="text-sm font-semibold tracking-wide mt-1" style={{ color: "#4FD1C5" }}>
              Explore the board
            </p>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            {NAV_ITEMS.map(({ icon, label, to, active, color }) =>
              active ? (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center gap-4 px-4 py-3 bg-secondary-container text-on-secondary-container rounded-xl font-bold shadow-sm hover:translate-x-1 transition-transform duration-200"
                >
                  <span className="material-symbols-outlined">{icon}</span>
                  <span className="text-sm font-semibold tracking-widest uppercase">{label}</span>
                </Link>
              ) : (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-variant/50 hover:translate-x-1 transition-all duration-200"
                  style={{ color }}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                  <span className="text-sm font-semibold tracking-widest uppercase">{label}</span>
                </Link>
              )
            )}
          </nav>

          <button className="mt-auto group relative overflow-hidden bg-gradient-to-r from-primary-container to-tertiary-container text-on-primary-container font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95">
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">add_circle</span>
              Post Event
            </span>
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-gutter relative">
          {/* Tag chips */}
          <div className="flex flex-wrap gap-3 mb-8">
            {TAGS.map((tag) => (
              <button
                key={tag.label}
                className="px-4 py-2 rounded-full text-sm font-semibold tracking-wide cursor-pointer hover:brightness-95 transition-all shadow-sm"
                style={{ background: tag.bg, color: tag.color }}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* The Noticeboard */}
          <Noticeboard />
        </main>
      </div>

      {/* Mobile FAB */}
      <button className="md:hidden fixed bottom-6 right-6 w-16 h-16 rounded-full text-white shadow-2xl flex items-center justify-center active:scale-90 transition-transform" style={{ background: "linear-gradient(135deg, #894e45, #3a675a)" }}>
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>
    </div>
  );
};

export default Index;
