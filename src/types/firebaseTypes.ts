import type { Timestamp } from "firebase/firestore";

// ── User ──────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  joinedEvents: string[];
  joinedClubs: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ── Events ────────────────────────────────────────────────────────────────

export type EventCategory =
  | "Music"
  | "Art"
  | "Workshop"
  | "Social"
  | "Sport"
  | "Academic"
  | "Career"
  | "Food"
  | "Other";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
  location: string;
  category: EventCategory;
  organizerId: string;
  organizerName: string;
  attendeeCount: number;
  attendeeIds: string[];
  posterUrl: string | null;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ── Clubs ─────────────────────────────────────────────────────────────────

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  memberIds: string[];
  logoUrl: string | null;
  contactEmail: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ── Resources ─────────────────────────────────────────────────────────────

export type ResourceType = "link" | "document" | "room" | "service";

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string | null;
  location: string | null;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
