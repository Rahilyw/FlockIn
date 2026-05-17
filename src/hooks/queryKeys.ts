import type { EventCategory } from "@/types/firebaseTypes";

export const queryKeys = {
  events: {
    all: ["events"] as const,
    list: (category?: EventCategory, limit?: number) =>
      ["events", "list", { category, limit }] as const,
  },
  clubs: {
    all: ["clubs"] as const,
    list: (limit?: number) => ["clubs", "list", { limit }] as const,
  },
  resources: {
    all: ["resources"] as const,
    list: (limit?: number) => ["resources", "list", { limit }] as const,
  },
} as const;
