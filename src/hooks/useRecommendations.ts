import { useMemo } from "react";
import type { Event, Club, Resource } from "@/types/firebaseTypes";

type Taggable = { tags: string[] };

function scoreItem(tags: string[], interests: string[]): number {
  if (!tags.length || !interests.length) return 0;
  const interestSet = new Set(interests.map((i) => i.toLowerCase()));
  const matches = tags.filter((t) => interestSet.has(t.toLowerCase())).length;
  return matches / tags.length; // normalised 0–1
}

interface UseRecommendationsOptions<T extends Taggable> {
  items: T[];
  interests: string[];
  /** Minimum score to include in results. Defaults to 0 (include all, sorted). */
  minScore?: number;
  /** Max results to return. */
  limit?: number;
}

export function useRecommendations<T extends Taggable>({
  items,
  interests,
  minScore = 0,
  limit,
}: UseRecommendationsOptions<T>): T[] {
  return useMemo(() => {
    const scored = items
      .map((item) => ({ item, score: scoreItem(item.tags, interests) }))
      .filter(({ score }) => score > minScore)
      .sort((a, b) => b.score - a.score);

    const results = scored.map(({ item }) => item);
    return limit ? results.slice(0, limit) : results;
  }, [items, interests, minScore, limit]);
}

// Convenience wrappers for typed use
export function useRecommendedEvents(events: Event[], interests: string[], limit = 6) {
  return useRecommendations({ items: events, interests, limit });
}

export function useRecommendedClubs(clubs: Club[], interests: string[], limit = 4) {
  return useRecommendations({ items: clubs, interests, limit });
}

export function useRecommendedResources(resources: Resource[], interests: string[], limit = 4) {
  return useRecommendations({ items: resources, interests, limit });
}
