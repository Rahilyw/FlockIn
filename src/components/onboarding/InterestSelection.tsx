import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

/** Single selectable interest (id is what we persist on UserProfile.interests). */
export type InterestOption = {
  id: string;
  label: string;
  category: string;
};

const INTEREST_CATALOG: InterestOption[] = [
  { id: "coding", label: "Coding", category: "Technology" },
  { id: "web-dev", label: "Web dev", category: "Technology" },
  { id: "ai-ml", label: "AI / ML", category: "Technology" },
  { id: "design", label: "Design", category: "Creative" },
  { id: "ui-ux", label: "UI / UX", category: "Creative" },
  { id: "photography", label: "Photography", category: "Creative" },
  { id: "music", label: "Music", category: "Creative" },
  { id: "career", label: "Career", category: "Professional" },
  { id: "networking", label: "Networking", category: "Professional" },
  { id: "entrepreneurship", label: "Startups", category: "Professional" },
  { id: "social", label: "Social events", category: "Campus life" },
  { id: "volunteering", label: "Volunteering", category: "Campus life" },
  { id: "sports", label: "Sports", category: "Wellness" },
  { id: "fitness", label: "Fitness", category: "Wellness" },
  { id: "mental-health", label: "Mental health", category: "Wellness" },
  { id: "research", label: "Research", category: "Academic" },
  { id: "writing", label: "Writing", category: "Academic" },
  { id: "outdoors", label: "Outdoors", category: "Recreation" },
  { id: "gaming", label: "Gaming", category: "Recreation" },
  { id: "food", label: "Food events", category: "Campus life" },
];

type InterestSelectionProps = {
  /** Currently selected interest ids (controlled). */
  selectedIds: string[];
  /** Called whenever the selection set changes (toggle on/off). */
  onSelectedIdsChange: (ids: string[]) => void;
  /** Hard cap on selections (Firebase-friendly small arrays). Default 10. */
  maxSelections?: number;
  className?: string;
};

/**
 * Multi-select grid of interest tags, grouped by category with optional search.
 * Parents own state (`selectedIds`) so the same values can be saved to Firestore on “Complete”.
 */
export function InterestSelection({
  selectedIds,
  onSelectedIdsChange,
  maxSelections = 10,
  className,
}: InterestSelectionProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INTEREST_CATALOG;
    return INTEREST_CATALOG.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.id.includes(q),
    );
  }, [query]);

  const byCategory = useMemo(() => {
    const map = new Map<string, InterestOption[]>();
    for (const item of filtered) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const toggle = (id: string) => {
    const isOn = selectedIds.includes(id);
    if (isOn) {
      onSelectedIdsChange(selectedIds.filter((x) => x !== id));
      return;
    }
    if (selectedIds.length >= maxSelections) return;
    onSelectedIdsChange([...selectedIds, id]);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Label htmlFor="interest-search" className="text-base font-semibold">
            What are you into?
          </Label>
          <p className="text-sm text-muted-foreground">
            {selectedIds.length} / {maxSelections} selected
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="interest-search"
            placeholder="Search interests…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            autoComplete="off"
          />
        </div>
      </div>

      <ScrollArea className="h-[min(420px,55vh)] sm:h-[min(480px,50vh)] rounded-lg border border-border bg-card/30 p-4">
        <div className="space-y-8 pr-3">
          {byCategory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No interests match that search.</p>
          ) : (
            byCategory.map(([category, items]) => (
              <section key={category} aria-labelledby={`cat-${category}`}>
                <h3 id={`cat-${category}`} className="mb-3 text-sm font-semibold text-foreground">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => {
                    const selected = selectedIds.includes(item.id);
                    const atCap = selectedIds.length >= maxSelections;
                    const disabled = !selected && atCap;
                    return (
                      <Button
                        key={item.id}
                        type="button"
                        variant={selected ? "default" : "outline"}
                        size="sm"
                        disabled={disabled}
                        onClick={() => toggle(item.id)}
                        className={cn(
                          "rounded-full transition-colors",
                          selected && "bg-gradient-primary hover:opacity-90",
                          disabled && "opacity-50",
                        )}
                        aria-pressed={selected}
                        aria-label={`${selected ? "Remove" : "Add"} interest ${item.label}`}
                      >
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </ScrollArea>

      {selectedIds.length >= maxSelections && (
        <p className="text-xs text-muted-foreground" role="status">
          Maximum {maxSelections} interests — remove one to add another.
        </p>
      )}
    </div>
  );
}
