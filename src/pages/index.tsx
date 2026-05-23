import { useState, type CSSProperties } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Noticeboard, { type FilterMode } from "@/components/Noticeboard";
import { useTopTags } from "@/hooks/useTopTags";

// ── Static pinned pills (always shown first) ──────────────────────────────────

const PINNED_TAGS: { label: string; filter: FilterMode; bg: string; color: string }[] = [
  { label: "#happening-now", filter: "happening-now", bg: "oklch(93% 0.04 15)",  color: "oklch(34% 0.10 15)"  },
  { label: "#today",          filter: "today",          bg: "oklch(95% 0.07 82)",  color: "oklch(36% 0.12 62)"  },
];

// ── Deterministic color palette for dynamic tags ──────────────────────────────

const TAG_COLOR_PALETTE = [
  { bg: "oklch(94% 0.04 162)", color: "oklch(30% 0.09 162)" },
  { bg: "oklch(93% 0.04 280)", color: "oklch(33% 0.10 280)" },
  { bg: "oklch(92% 0.05 262)", color: "oklch(34% 0.10 262)" },
  { bg: "oklch(94% 0.04 120)", color: "oklch(30% 0.09 120)" },
  { bg: "oklch(93% 0.05 310)", color: "oklch(32% 0.11 310)" },
  { bg: "oklch(94% 0.04 45)",  color: "oklch(30% 0.10 45)"  },
];

function hashTag(tag: string): number {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (Math.imul(31, h) + tag.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const NAV_ITEMS: {
  icon: string;
  label: string;
  to: string;
  active: CSSProperties;
  inactive: CSSProperties;
}[] = [
  {
    icon: "dynamic_feed",
    label: "Your Feed",
    to: "/",
    active:   { background: "oklch(84% 0.15 196 / 0.30)", border: "1.5px solid oklch(64% 0.19 196 / 0.52)", color: "oklch(23% 0.13 196)" },
    inactive: { background: "oklch(91% 0.07 196 / 0.20)", border: "1.5px solid oklch(84% 0.10 196 / 0.32)", color: "oklch(40% 0.11 196)" },
  },
  {
    icon: "trending_up",
    label: "Trending",
    to: "/events",
    active:   { background: "oklch(86% 0.16 65 / 0.30)", border: "1.5px solid oklch(70% 0.21 65 / 0.52)", color: "oklch(28% 0.14 65)" },
    inactive: { background: "oklch(93% 0.07 65 / 0.20)", border: "1.5px solid oklch(86% 0.10 65 / 0.32)", color: "oklch(44% 0.12 65)" },
  },
  {
    icon: "group",
    label: "Clubs",
    to: "/clubs",
    active:   { background: "oklch(83% 0.13 162 / 0.30)", border: "1.5px solid oklch(62% 0.16 162 / 0.52)", color: "oklch(24% 0.11 162)" },
    inactive: { background: "oklch(91% 0.06 162 / 0.20)", border: "1.5px solid oklch(84% 0.09 162 / 0.32)", color: "oklch(40% 0.09 162)" },
  },
  {
    icon: "layers",
    label: "Resources",
    to: "/resources",
    active:   { background: "oklch(81% 0.14 280 / 0.28)", border: "1.5px solid oklch(62% 0.18 280 / 0.50)", color: "oklch(26% 0.14 280)" },
    inactive: { background: "oklch(90% 0.07 280 / 0.20)", border: "1.5px solid oklch(83% 0.10 280 / 0.30)", color: "oklch(42% 0.13 280)" },
  },
  {
    icon: "bookmark",
    label: "Saved",
    to: "/dashboard",
    active:   { background: "oklch(82% 0.14 18 / 0.30)", border: "1.5px solid oklch(63% 0.17 18 / 0.52)", color: "oklch(25% 0.12 18)" },
    inactive: { background: "oklch(91% 0.06 18 / 0.20)", border: "1.5px solid oklch(84% 0.09 18 / 0.30)", color: "oklch(42% 0.10 18)" },
  },
];

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFilter, setSelectedFilter] = useState<FilterMode>(null);
  const { data: topTags = [] } = useTopTags(8);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <div className="flex flex-1 items-start">

        {/* ── Sidebar column ── */}
        <div className="hidden md:block w-[272px] shrink-0">
          <div className="sticky top-[4.5rem] p-3">
            {/* The floating card — rounded on all sides, detached from edges */}
            <aside
              className="flex flex-col rounded-[28px] bg-white/72 backdrop-blur-xl"
              style={{
                boxShadow: [
                  "0 6px 32px oklch(50% 0.10 196 / 0.11)",   /* outer depth */
                  "0 1px 8px oklch(60% 0.08 196 / 0.08)",    /* close shadow */
                  "0 0 0 1.5px oklch(90% 0.07 196 / 0.50)",  /* tinted ring */
                  "inset 0 1.5px 0 rgba(255,255,255,0.82)",  /* glass top highlight */
                ].join(", "),
              }}
            >
              <div className="px-3 pt-7 pb-5 flex flex-col">
                <p className="text-[10px] font-black tracking-[0.18em] uppercase text-muted-foreground/45 mb-4 px-1">
                  Discover
                </p>

                <nav className="flex flex-col gap-2">
                  {NAV_ITEMS.map(({ icon, label, to, active, inactive }) => {
                    const itemActive = isActive(to);
                    return (
                      <Link
                        key={label}
                        to={to}
                        style={itemActive ? active : inactive}
                        className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] font-semibold transition-all duration-150 hover:brightness-[1.08] hover:scale-[1.015]"
                      >
                        <span className="material-symbols-outlined text-[22px] leading-none">
                          {icon}
                        </span>
                        {label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Post Event — directly below nav */}
                <button
                  onClick={() => navigate("/events/new")}
                  className="mt-5 w-full flex items-center justify-center gap-2.5 text-white font-bold text-[15px] py-3.5 px-4 rounded-2xl active:scale-95 transition-all duration-150 hover:brightness-110"
                  style={{
                    background: "hsl(var(--primary))",
                    boxShadow: "0 6px 22px oklch(55% 0.20 196 / 0.38)",
                  }}
                >
                  <span className="material-symbols-outlined text-[20px] leading-none">add_circle</span>
                  Post an Event
                </button>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Main content ── */}
        <main className="flex-1 px-6 py-6">
          <div className="flex flex-wrap gap-2.5 mb-8">
            {/* Pinned special filters */}
            {PINNED_TAGS.map((tag) => (
              <button
                key={tag.label}
                aria-pressed={selectedFilter === tag.filter}
                onClick={() => setSelectedFilter((current) => current === tag.filter ? null : tag.filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer hover:brightness-95 active:scale-95 transition-all shadow-sm ${
                  selectedFilter === tag.filter ? "ring-2 ring-offset-1 ring-current" : ""
                }`}
                style={{ background: tag.bg, color: tag.color }}
              >
                {tag.label}
              </button>
            ))}

            {/* Live tags from Firestore */}
            {topTags.map((tag) => {
              const filter: FilterMode = `tag:${tag.name}`;
              const { bg, color } = TAG_COLOR_PALETTE[hashTag(tag.name) % TAG_COLOR_PALETTE.length];
              return (
                <button
                  key={tag.name}
                  aria-pressed={selectedFilter === filter}
                  onClick={() => setSelectedFilter((current) => current === filter ? null : filter)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer hover:brightness-95 active:scale-95 transition-all shadow-sm ${
                    selectedFilter === filter ? "ring-2 ring-offset-1 ring-current" : ""
                  }`}
                  style={{ background: bg, color }}
                >
                  #{tag.name}
                </button>
              );
            })}
          </div>

          <Noticeboard filter={selectedFilter} />
        </main>
      </div>

      {/* ── Mobile FAB ── */}
      <button
        onClick={() => navigate("/events/new")}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center active:scale-90 transition-transform"
        style={{
          background: "hsl(var(--primary))",
          boxShadow: "0 6px 20px oklch(55% 0.20 196 / 0.40)",
        }}
        aria-label="Post an event"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>
    </div>
  );
};

export default Index;
