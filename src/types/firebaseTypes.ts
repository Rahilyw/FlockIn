import type { Timestamp } from "firebase/firestore";

// ── User ──────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  bio: string | null;
  interests: string[];
  joinedEvents: string[];
  joinedClubs: string[];
  savedEvents: string[];
  savedClubs: string[];
  onboardingComplete: boolean;
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
  endTime: Timestamp;
  location: string;
  category: EventCategory;
  creatorId: string;
  creatorName: string;
  creatorPhoto: string;
  rsvpCount: number;
  rsvpBy: string[];
  imagePath: string | null;
  /** @deprecated Legacy field — old events written before schema migration. Use imagePath. */
  posterUrl?: string | null;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
  reported: boolean;
  savedBy: string[];
  savedCount: number;
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
