import { useMemo } from "react";
import type { Event, Club, Resource } from "@/types/firebaseTypes";

type Taggable = { tags: string[] };

interface EngagementFields {
  rsvpCount?: number;
  savedCount?: number;
}

// Maps interest names (lowercased) to equivalent category tag spellings
const INTEREST_ALIASES: Record<string, string[]> = {
  sports:     ["sport"],
  technology: ["tech"],
  coding:     ["code", "programming"],
  fitness:    ["gym"],
};

function scoreItem(
  tags: string[],
  interests: string[],
  engagement?: EngagementFields,
): number {
  if (!tags.length || !interests.length) return 0;

  // Build expanded interest set including aliases
  const expanded = new Set<string>();
  for (const i of interests) {
    const lower = i.toLowerCase();
    expanded.add(lower);
    for (const alias of INTEREST_ALIASES[lower] ?? []) expanded.add(alias);
  }

  const matches = tags.filter((t) => expanded.has(t.toLowerCase())).length;
  if (matches === 0) return 0;

  // Primary: fraction of user's interests satisfied (not penalised by tag count)
  const primary = matches / interests.length;
  // Tiebreaker: log-scaled engagement — capped well below 0.01 so it can never
  // flip a better-matched event above a weaker one
  const engagementBonus =
    Math.log1p((engagement?.rsvpCount ?? 0) + (engagement?.savedCount ?? 0)) * 0.001;

  return primary + engagementBonus;
}

interface UseRecommendationsOptions<T extends Taggable> {
  items: T[];
  interests: string[];
  minScore?: number;
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
      .map((item) => ({
        item,
        score: scoreItem(
          item.tags,
          interests,
          "rsvpCount" in item ? (item as unknown as EngagementFields) : undefined,
        ),
      }))
      .filter(({ score }) => score > 0 && score >= minScore)
      .sort((a, b) => b.score - a.score);

    const results = scored.map(({ item }) => item);
    return limit ? results.slice(0, limit) : results;
  }, [items, interests, minScore, limit]);
}

// Typed wrappers

export function useRecommendedEvents(
  events: Event[],
  interests: string[],
  limit = 6,
): { events: Event[]; matchedInterests: string[] } {
  return useMemo(() => {
    if (!interests.length || !events.length) return { events: [], matchedInterests: [] };

    const expanded = new Map<string, string>(); // expanded → original-cased interest
    for (const i of interests) {
      const lower = i.toLowerCase();
      expanded.set(lower, i);
      for (const alias of INTEREST_ALIASES[lower] ?? []) expanded.set(alias, i);
    }

    const scored = events
      .map((event) => ({ event, score: scoreItem(event.tags, interests, event) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);

    const topEvents = scored.slice(0, limit).map(({ event }) => event);

    // Collect which original interests actually contributed a match
    const matched = new Set<string>();
    for (const event of topEvents) {
      for (const tag of event.tags) {
        const original = expanded.get(tag.toLowerCase());
        if (original) matched.add(original);
      }
    }

    return { events: topEvents, matchedInterests: [...matched] };
  }, [events, interests, limit]);
}

export function useRecommendedClubs(clubs: Club[], interests: string[], limit = 4) {
  return useRecommendations({ items: clubs, interests, limit });
}

export function useRecommendedResources(resources: Resource[], interests: string[], limit = 4) {
  return useRecommendations({ items: resources, interests, limit });
}
