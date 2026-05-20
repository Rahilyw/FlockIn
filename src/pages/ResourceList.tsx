import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { ResourceCard } from "@/components/ResourceCard";
import { useResources } from "@/hooks/useResources";



/// ── Resource List Page ─────────────────────────────────────────────
/** * ResourceList component displays a searchable list of campus resources.
 * It uses the useResources hook to fetch resource data and allows users to filter resources by title, description, type, and tags.
 * Each resource is displayed as a card, and clicking on a card navigates to the resource detail page.
 */
export default function ResourceList() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    // Fetch resources using the custom hook
    const { data: resources = [], isLoading } = useResources(100);

    // Filter resources based on the search query (case-insensitive)
    const filtered = resources.filter((r) => {
        const q = search.toLowerCase();
        return (
            !q ||
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.type.toLowerCase().includes(q) ||
            r.tags.some((t) => t.toLowerCase().includes(q))
        );
    });


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Resources
          </h1>
          <p className="text-muted-foreground text-lg">
            Find campus resources, rooms, and services
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources, types, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {isLoading
            ? "Loading..."
            : `${filtered.length} resource${filtered.length !== 1 ? "s" : ""}`}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No resources match your search. Try different keywords.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onClick={(id) => navigate(`/resources/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
