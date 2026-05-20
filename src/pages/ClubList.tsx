import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { ClubCard } from "@/components/ClubCard";
import { useClubs } from "@/hooks/useClubs";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function ClubList() {
  const [search, setSearch] = useState("");

  const { data: clubs = [], isLoading } = useClubs(100);
  const { savedClubs, toggleClub } = useBookmarks();

  const filtered = clubs.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary">
            Clubs
          </h1>
          <p className="text-muted-foreground text-lg">Find clubs and organizations on campus</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clubs, categories, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {isLoading ? "Loading..." : `${filtered.length} club${filtered.length !== 1 ? "s" : ""}`}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-muted-foreground">No clubs match your search. Try different keywords.</p>
            <button
              className="text-sm text-primary font-medium hover:underline"
              onClick={() => setSearch("")}
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((club, index) => (
              <ClubCard
                key={club.id}
                club={club}
                isBookmarked={savedClubs.includes(club.id)}
                onBookmark={toggleClub}
                style={{ animationDelay: `${Math.min(index * 40, 480)}ms` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
