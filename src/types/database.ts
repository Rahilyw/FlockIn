/**
 * Firestore Database Schema
 * TypeScript interfaces for all core collections
 */

/**
 * User Profile & Preferences
 */
export interface User {
  uid: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  interests: string[]; // Tags like "coding", "sports", "arts"
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Campus Event
 */
export interface Event {
  id: string;
  name: string;
  description: string;
  date: Date; // Event date
  startTime: string; // "18:00" format
  endTime: string; // "20:00" format
  location: string;
  capacity?: number; // Max attendees
  attendees?: number; // Current count
  image?: string; // URL to event image
  category: EventCategory;
  tags: string[]; // ["coding", "networking", "free-food", "beginner-friendly"]
  createdBy: string; // User ID of organizer
  isFeatured?: boolean;
  rsvpLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EventCategory =
  | "Workshop"
  | "Social"
  | "Seminar"
  | "Competition"
  | "Career"
  | "Sports"
  | "Music"
  | "Culture"
  | "Academic"
  | "Networking"
  | "Other";

/**
 * Campus Club
 */
export interface Club {
  id: string;
  name: string;
  description: string;
  image?: string; // Club logo/cover
  category: ClubCategory;
  tags: string[]; // ["tech", "inclusive", "beginners-welcome"]
  memberCount: number;
  president?: string; // User name
  meetingTime?: string; // "Tuesdays 6PM" or similar
  location?: string; // Default meeting location
  contactEmail?: string;
  joinLink?: string;
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ClubCategory =
  | "Technology"
  | "Sports"
  | "Arts"
  | "Academic"
  | "Social"
  | "Professional"
  | "Culture"
  | "Service"
  | "Other";

/**
 * Campus Resource
 */
export interface Resource {
  id: string;
  name: string;
  description: string;
  resourceType: ResourceType;
  tags: string[]; // ["free", "mental-health", "24/7"]
  category: string; // "Health", "Academic", "Career", "Wellness"
  location?: string;
  contactInfo?: string;
  website?: string;
  phone?: string;
  hours?: string; // "Mon-Fri 9AM-5PM"
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ResourceType =
  | "Tutoring"
  | "Career"
  | "Mental Health"
  | "Health"
  | "Housing"
  | "Financial"
  | "Academic Support"
  | "Recreation"
  | "Library"
  | "Tech Support"
  | "Other";

/**
 * User Activity Tracking (for recommendations)
 */
export interface UserActivity {
  userId: string;
  eventId?: string;
  clubId?: string;
  resourceId?: string;
  action: "view" | "save" | "click" | "join";
  timestamp: Date;
  tags?: string[]; // Tags of the item viewed
}

/**
 * User Preferences & Engagement
 */
export interface UserProfile extends User {
  savedEvents: string[]; // Event IDs
  savedClubs: string[]; // Club IDs
  joinedClubs: string[]; // Club IDs user follows
  savedResources: string[]; // Resource IDs
  recommendations?: Recommendation[];
}

/**
 * Recommendation object
 */
export interface Recommendation {
  itemId: string;
  itemType: "event" | "club" | "resource";
  score: number; // 0-100
  reason: string; // "Matches your interest in coding"
  matchedTags: string[];
}

/**
 * Firestore Collection References (for type safety)
 */
export const Collections = {
  USERS: "users",
  EVENTS: "events",
  CLUBS: "clubs",
  RESOURCES: "resources",
  ACTIVITY: "activity",
} as const;
