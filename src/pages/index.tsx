import { useState, type CSSProperties } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import Header from "@/components/Header";
import Noticeboard, { type FilterMode } from "@/components/Noticeboard";
import ForYouStrip from "@/components/ForYouStrip";
import { useTopTags } from "@/hooks/useTopTags";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { EVENT_CATEGORIES } from "@/lib/eventSchemas";

// ── Static pinned time-filter pills ───────────────────────────────────────────

const PINNED_TAGS: { label: string; filter: FilterMode; bg: string; color: string }[] = [
  { label: "#happening-now", filter: "happening-now", bg: "#E2E4FB", color: "#3a44b8" },
  { label: "#today",         filter: "today",         bg: "#FFE0D5", color: "#7c2d12" },
  { label: "#this-week",     filter: "this-week",     bg: "#FFE8C7", color: "#7a4a10" },
  { label: "#next-week",     filter: "next-week",     bg: "#DFF5E8", color: "#1c5a3e" },
];

// ── Per-category colors from design kit ──────────────────────────────────────

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  Music:    { bg: "#E2E4FB", color: "#3a44b8" },
  Art:      { bg: "#FFF4D8", color: "#7a5a10" },
  Workshop: { bg: "#DDF3DD", color: "#1f5a2a" },
  Social:   { bg: "#F6D8FF", color: "#5d2a7a" },
  Sport:    { bg: "#D8E3FF", color: "#1f3a8c" },
  Academic: { bg: "#FFE8C7", color: "#7a4a10" },
  Career:   { bg: "#E2E4FB", color: "#3a44b8" },
  Food:     { bg: "#FFE0D5", color: "#7c2d12" },
  Other:    { bg: "#E4E2DD", color: "#524341" },
};

// Fallback palette for trending tags (no fixed category)
const TAG_COLOR_PALETTE = [
  { bg: "#E2E4FB", color: "#3a44b8" },
  { bg: "#FFE0D5", color: "#7c2d12" },
  { bg: "#FFE8C7", color: "#7a4a10" },
  { bg: "#DFF5E8", color: "#1c5a3e" },
  { bg: "#F6D8FF", color: "#5d2a7a" },
  { bg: "#DDF3DD", color: "#1f5a2a" },
];

function hashTag(tag: string): number {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (Math.imul(31, h) + tag.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Category icon mapping (Material Symbols)
const CATEGORY_ICONS: Record<string, string> = {
  Music: "music_note",
  Art: "palette",
  Workshop: "build",
  Social: "people",
  Sport: "sports",
  Academic: "school",
  Career: "work",
  Food: "restaurant",
  Other: "category",
};

const NAV_ITEMS: {
  icon: string;
  label: string;
  to: string;
  active: CSSProperties;
  inactive: CSSProperties;
}[] = [
  {
    icon: "dynamic_feed",
    label: "Noticeboard",
    to: "/",
    active:   { background: "rgba(36,140,200,.30)",  border: "1.5px solid rgba(36,140,200,.52)",  color: "#13556a" },
    inactive: { background: "rgba(36,140,200,.12)",  border: "1.5px solid rgba(36,140,200,.20)",  color: "#3a6a82" },
  },
  {
    icon: "trending_up",
    label: "Trending",
    to: "/events",
    active:   { background: "rgba(250,165,90,.30)",  border: "1.5px solid rgba(232,140,60,.52)",  color: "#7a4a10" },
    inactive: { background: "rgba(250,165,90,.16)",  border: "1.5px solid rgba(232,140,60,.25)",  color: "#8a5a20" },
  },
  {
    icon: "group",
    label: "Clubs",
    to: "/clubs",
    active:   { background: "rgba(36,229,210,.30)",  border: "1.5px solid rgba(36,180,160,.52)",  color: "#0e5a4e" },
    inactive: { background: "rgba(36,229,210,.12)",  border: "1.5px solid rgba(36,180,160,.20)",  color: "#1d6a5e" },
  },
  {
    icon: "layers",
    label: "Resources",
    to: "/resources",
    active:   { background: "rgba(150,120,220,.30)", border: "1.5px solid rgba(120,90,200,.52)",  color: "#3a2a6e" },
    inactive: { background: "rgba(150,120,220,.12)", border: "1.5px solid rgba(120,90,200,.20)",  color: "#5a4a8a" },
  },
  {
    icon: "bookmark",
    label: "Saved",
    to: "/dashboard",
    active:   { background: "rgba(254,109,115,.30)", border: "1.5px solid rgba(214,59,70,.52)",   color: "#7c2d12" },
    inactive: { background: "rgba(254,109,115,.14)", border: "1.5px solid rgba(214,59,70,.20)",   color: "#8c4d3a" },
  },
];

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [tagSearch, setTagSearch] = useState("");
  const { data: topTags = [] } = useTopTags(20);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const toggleFilter = (f: string) =>
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <div className="flex flex-1 items-start">

        {/* ── Sidebar column ── */}
        <div className="hidden md:block w-[272px] shrink-0">
          <div className="sticky top-[4.5rem] p-3">
            {/* The floating card — rounded on all sides, detached from edges */}
            <aside
              className="flex flex-col rounded-[28px] backdrop-blur-xl"
              style={{
                backgroundColor: 'rgba(255,255,255,0.72)',
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

                {/* Post Event — peacock + rainbow ring */}
                <button
                  onClick={() => navigate("/events/new")}
                  className="mt-5 w-full active:scale-95 transition-all duration-150 fk-press"
                  style={{
                    background: "conic-gradient(from 0deg, #ff0080, #ff6b00, #ffd700, #00e676, #00b4d8, #7c4dff, #ff0080)",
                    padding: "2.5px",
                    borderRadius: 18,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.18), 0 2px 10px rgba(36,229,210,0.28)",
                  }}
                >
                  <div
                    className="w-full flex items-center justify-center gap-2.5 text-white font-bold text-[15px] py-3.5 px-4"
                    style={{
                      background: "linear-gradient(145deg, #0F3D5C 0%, #2A6FC8 28%, #1F8A6E 54%, #24E5D2 78%, #0ea5e9 100%)",
                      borderRadius: 15.5,
                    }}
                  >
                    <span className="material-symbols-outlined text-[20px] leading-none">add_circle</span>
                    Post an Event
                  </div>
                </button>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-6 py-6">
          {/* ── Filter pill bar ── */}
          {/* On mobile: single scrollable row. On desktop: wrapping flex grid */}
          <div className="-mx-6 px-6 md:mx-0 md:px-0 overflow-x-auto md:overflow-x-visible scrollbar-hide mb-4 md:mb-8">
          <div className="flex gap-2 md:gap-2.5 items-center w-max md:w-auto md:flex-wrap">
              {/* Clear — slides in when any filter is active */}
              {activeFilters.size > 0 && (
                <button
                  onClick={() => setActiveFilters(new Set())}
                  className="shrink-0 inline-flex items-center gap-1 rounded-full text-[13px] font-bold transition-all duration-200 hover:-translate-y-px active:scale-95"
                  style={{
                    padding: "7px 14px",
                    background: "#3D2B1F",
                    color: "#fff",
                    boxShadow: "0 3px 10px rgba(61,43,31,.35)",
                  }}
                  aria-label="Clear all filters"
                >
                  ✕ clear
                </button>
              )}

              {/* Pinned time filters */}
              {PINNED_TAGS.map((tag) => {
                const on = activeFilters.has(tag.filter as string);
                return (
                  <button
                    key={tag.label}
                    aria-pressed={on}
                    onClick={() => toggleFilter(tag.filter as string)}
                    className="shrink-0 rounded-full text-[13px] font-bold cursor-pointer transition-all duration-200 hover:-translate-y-px active:scale-95"
                    style={on ? {
                      padding: "7px 14px",
                      background: tag.color,
                      color: "#fff",
                      boxShadow: `0 3px 10px ${tag.color}55`,
                      transform: "translateY(-1px) scale(1.04)",
                    } : {
                      padding: "7px 14px",
                      background: tag.bg,
                      color: tag.color,
                      boxShadow: "0 1px 4px rgba(50,40,35,.10)",
                    }}
                  >
                    {tag.label}
                  </button>
                );
              })}

              {/* Separator */}
              <div className="shrink-0 w-px h-5 rounded-full bg-border/50 mx-0.5" />

              {/* Category filters */}
              {EVENT_CATEGORIES.map((cat) => {
                const filter = `category:${cat}`;
                const on = activeFilters.has(filter);
                const { bg, color } = CATEGORY_COLORS[cat] ?? { bg: "#E4E2DD", color: "#524341" };
                return (
                  <button
                    key={cat}
                    aria-pressed={on}
                    onClick={() => toggleFilter(filter)}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full text-[13px] font-bold cursor-pointer transition-all duration-200 hover:-translate-y-px active:scale-95"
                    style={on ? {
                      padding: "7px 12px",
                      background: color,
                      color: "#fff",
                      boxShadow: `0 3px 10px ${color}55`,
                      transform: "translateY(-1px) scale(1.04)",
                    } : {
                      padding: "7px 12px",
                      background: bg,
                      color,
                      boxShadow: "0 1px 4px rgba(50,40,35,.10)",
                    }}
                  >
                    <span className="material-symbols-outlined text-[14px] leading-none">
                      {CATEGORY_ICONS[cat] ?? "label"}
                    </span>
                    {cat}
                  </button>
                );
              })}

              {/* Trending tags from Firestore — with count badge */}
              {topTags.slice(0, 6).map((tag) => {
                const filter = `tag:${tag.name}`;
                const on = activeFilters.has(filter);
                const { bg, color } = TAG_COLOR_PALETTE[hashTag(tag.name) % TAG_COLOR_PALETTE.length];
                return (
                  <button
                    key={tag.name}
                    aria-pressed={on}
                    onClick={() => toggleFilter(filter)}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full text-[13px] font-bold cursor-pointer transition-all duration-200 hover:-translate-y-px active:scale-95"
                    style={on ? {
                      padding: "7px 14px",
                      background: color,
                      color: "#fff",
                      boxShadow: `0 3px 10px ${color}55`,
                      transform: "translateY(-1px) scale(1.04)",
                    } : {
                      padding: "7px 14px",
                      background: bg,
                      color,
                      boxShadow: "0 1px 4px rgba(50,40,35,.10)",
                    }}
                  >
                    #{tag.name}
                    {tag.count > 0 && (
                      <span
                        style={{
                          padding: "1px 6px",
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 900,
                          lineHeight: 1.3,
                          background: on ? "rgba(255,255,255,.28)" : "rgba(0,0,0,.10)",
                          color: "inherit",
                        }}
                      >
                        {tag.count}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* + More — access remaining trending tags */}
              <Popover onOpenChange={() => setTagSearch("")}>
                <PopoverTrigger asChild>
                  <button
                    className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-px active:scale-95"
                    style={{
                      background: "oklch(94% 0.02 260)",
                      color: "oklch(42% 0.08 260)",
                      border: "1.5px dashed oklch(72% 0.06 260 / 0.7)",
                    }}
                    aria-label="More tag filters"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    More
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3" align="start">
                  <p className="text-[11px] font-black tracking-[0.12em] uppercase text-muted-foreground/50 mb-2.5 px-1">
                    Filter by tag
                  </p>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/40 mb-3">
                    <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <input
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      placeholder="Search tags…"
                      className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                    {topTags
                      .filter((t) => t.name.toLowerCase().includes(tagSearch.toLowerCase()))
                      .map((tag) => {
                        const filter = `tag:${tag.name}`;
                        const on = activeFilters.has(filter);
                        const { bg, color } = TAG_COLOR_PALETTE[hashTag(tag.name) % TAG_COLOR_PALETTE.length];
                        return (
                          <button
                            key={tag.name}
                            onClick={() => toggleFilter(filter)}
                            className="inline-flex items-center gap-1.5 rounded-full text-[12px] font-bold transition-all active:scale-95"
                            style={on ? {
                              padding: "5px 10px",
                              background: color,
                              color: "#fff",
                              boxShadow: `0 2px 8px ${color}44`,
                            } : {
                              padding: "5px 10px",
                              background: bg,
                              color,
                              boxShadow: "0 1px 3px rgba(50,40,35,.08)",
                            }}
                          >
                            #{tag.name}
                            {tag.count > 0 && (
                              <span style={{
                                padding: "1px 5px",
                                borderRadius: 999,
                                fontSize: 9,
                                fontWeight: 900,
                                lineHeight: 1.3,
                                background: on ? "rgba(255,255,255,.28)" : "rgba(0,0,0,.10)",
                                color: "inherit",
                              }}>{tag.count}</span>
                            )}
                          </button>
                        );
                      })}
                    {topTags.filter((t) => t.name.toLowerCase().includes(tagSearch.toLowerCase())).length === 0 && (
                      <p className="text-sm text-muted-foreground px-1">No tags yet — they appear as events get tagged.</p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
          </div>{/* inner flex row */}
          </div>{/* scroll wrapper */}

          <ForYouStrip />

          <Noticeboard filters={activeFilters} />
        </main>
      </div>

    </div>
  );
};

export default Index;
