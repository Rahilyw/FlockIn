import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { useEvents } from "@/hooks/useEvents";
import { useBookmarks } from "@/hooks/useBookmarks";
import type { EventCategory } from "@/types/firebaseTypes";

const CATEGORIES: EventCategory[] = [
  "Music", "Art", "Workshop", "Social", "Sport", "Academic", "Career", "Food", "Other",
];

export default function EventList() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<EventCategory | "all">("all");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const { data: events = [], isLoading } = useEvents({
    category: category === "all" ? undefined : category,
    limit: 100,
  });

  const { savedEvents, toggleEvent } = useBookmarks();

  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    return (
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.organizerName.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Events
          </h1>
          <p className="text-muted-foreground text-lg">Browse and discover campus events</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, organizers, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={category} onValueChange={(v) => setCategory(v as EventCategory | "all")}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {isLoading ? "Loading..." : `${filtered.length} event${filtered.length !== 1 ? "s" : ""}`}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No events match your search. Try different keywords or a different category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isBookmarked={savedEvents.includes(event.id)}
                onBookmark={toggleEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
