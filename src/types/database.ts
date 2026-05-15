/**
 * Data shapes for FlockIn content and user profiles stored in Firestore.
 *
 * ## Auth user vs profile document (important)
 *
 * - **Firebase Auth `User`** (`import type { User } from "firebase/auth"`): created when someone
 *   signs up or signs in. Holds `uid`, `email`, `emailVerified`, etc. It lives only in Firebase Auth,
 *   not in your Firestore `users` collection by default.
 * - **`UserProfile`** (this file): the document you store at **`users/{uid}`** in Firestore.
 *   The `uid` field must match the Auth user’s `uid` so you can load the right profile after login.
 *
 * Flow: after signup, Auth gives you a `uid` → you create/update `users/{uid}` with `UserProfile`
 * (e.g. `displayName`, `interests`).
 */

/** App-owned profile stored at Firestore `users/{uid}` (uid === Firebase Auth uid). */
export interface UserProfile {
  uid: string;
  displayName: string;
  /** Optional copy of sign-in email for queries; Auth remains source of truth for auth. */
  email?: string;
  /** Interest tag ids or slugs, aligned with onboarding / recommendations. */
  interests: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  /** Calendar date label, e.g. "March 15, 2026" */
  date: string;
  time: string;
  location: string;
  category: string;
  tags: string[];
  attendees?: number;
  capacity?: number;
  imageUrl?: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  members?: number;
  meetingTime?: string;
  location?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  location?: string;
  contact?: string;
}
