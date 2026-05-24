import type { EventCategory } from "@/types/firebaseTypes";

export const queryKeys = {
  events: {
    all: ["events"] as const,
    list: (
      category?: EventCategory,
      limit?: number,
      approvedOnly?: boolean,
      activeOnly?: boolean,
    ) => ["events", "list", { category, limit, approvedOnly, activeOnly }] as const,
    detail: (id: string) => ["events", "detail", id] as const,
    byCreator: (uid: string) => ["events", "byCreator", uid] as const,
  },
  clubs: {
    all: ["clubs"] as const,
    list: (limit?: number) => ["clubs", "list", { limit }] as const,
    detail: (id: string) => ["clubs", "detail", id] as const,
  },
  resources: {
    all: ["resources"] as const,
    list: (limit?: number) => ["resources", "list", { limit }] as const,
    detail: (id: string) => ["resources", "detail", id] as const,
  },
} as const;
