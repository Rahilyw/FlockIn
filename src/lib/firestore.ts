import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  runTransaction,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  type QueryConstraint,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { UserProfile, Event, EventCategory, Club, Resource } from "@/types/firebaseTypes";

// ── Collection helpers ────────────────────────────────────────────────────

const db = () => getFirebaseDb();
const usersCol = () => collection(db(), "users");
const eventsCol = () => collection(db(), "events");
const clubsCol = () => collection(db(), "clubs");
const resourcesCol = () => collection(db(), "resources");

// ── User operations ───────────────────────────────────────────────────────

/**
 * Creates a Firestore profile document for a newly authenticated user.
 * Safe to call multiple times — uses setDoc so duplicate calls are idempotent
 * only if you pass `merge: true`. Here we use it without merge so the caller
 * controls when to create vs. update.
 */
export async function createUserProfile(
  uid: string,
  email: string,
  displayName: string | null = null,
  photoURL: string | null = null,
): Promise<void> {
  await setDoc(doc(usersCol(), uid), {
    uid,
    email,
    displayName,
    photoURL,
    bio: null,
    interests: [],
    joinedEvents: [],
    joinedClubs: [],
    onboardingComplete: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(usersCol(), uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, "displayName" | "photoURL" | "bio" | "interests">>,
): Promise<void> {
  await updateDoc(doc(usersCol(), uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function completeOnboarding(
  uid: string,
  displayName: string,
  interests: string[],
): Promise<void> {
  await updateDoc(doc(usersCol(), uid), {
    displayName,
    interests,
    onboardingComplete: true,
    updatedAt: serverTimestamp(),
  });
}

// ── Event operations ──────────────────────────────────────────────────────

export async function createEvent(
  data: Omit<Event, "id" | "attendeeCount" | "attendeeIds" | "createdAt" | "updatedAt">,
): Promise<string> {
  const ref = doc(eventsCol());
  await setDoc(ref, {
    ...data,
    id: ref.id,
    attendeeCount: 0,
    attendeeIds: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getEvent(id: string): Promise<Event | null> {
  const snap = await getDoc(doc(eventsCol(), id));
  return snap.exists() ? (snap.data() as Event) : null;
}

export interface GetEventsOptions {
  category?: EventCategory;
  limitCount?: number;
}

export async function getEvents(options: GetEventsOptions = {}): Promise<Event[]> {
  const constraints: QueryConstraint[] = [orderBy("date", "asc")];
  if (options.category) constraints.push(where("category", "==", options.category));
  if (options.limitCount) constraints.push(limit(options.limitCount));
  const snap = await getDocs(query(eventsCol(), ...constraints));
  return snap.docs.map((d) => d.data() as Event);
}

/**
 * Atomically adds userId to event.attendeeIds, increments attendeeCount,
 * and adds eventId to user.joinedEvents. No-ops if already joined.
 */
export async function joinEvent(eventId: string, userId: string): Promise<void> {
  const eventRef = doc(eventsCol(), eventId);
  const userRef = doc(usersCol(), userId);

  await runTransaction(db(), async (tx) => {
    const eventSnap = await tx.get(eventRef);
    if (!eventSnap.exists()) throw new Error("Event not found.");
    if ((eventSnap.data() as Event).attendeeIds.includes(userId)) return;

    tx.update(eventRef, {
      attendeeIds: arrayUnion(userId),
      attendeeCount: increment(1),
      updatedAt: serverTimestamp(),
    });
    tx.update(userRef, {
      joinedEvents: arrayUnion(eventId),
      updatedAt: serverTimestamp(),
    });
  });
}

/**
 * Atomically removes userId from event.attendeeIds and decrements attendeeCount.
 * No-ops if not currently attending.
 */
export async function leaveEvent(eventId: string, userId: string): Promise<void> {
  const eventRef = doc(eventsCol(), eventId);
  const userRef = doc(usersCol(), userId);

  await runTransaction(db(), async (tx) => {
    const eventSnap = await tx.get(eventRef);
    if (!eventSnap.exists()) throw new Error("Event not found.");
    if (!(eventSnap.data() as Event).attendeeIds.includes(userId)) return;

    tx.update(eventRef, {
      attendeeIds: arrayRemove(userId),
      attendeeCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
    tx.update(userRef, {
      joinedEvents: arrayRemove(eventId),
      updatedAt: serverTimestamp(),
    });
  });
}

/**
 * Updates event fields. Only the organizer can update their event.
 * Throws if event doesn't exist or user is not the organizer.
 */
export async function updateEvent(
  eventId: string,
  userId: string,
  updates: Partial<Omit<Event, "id" | "organizerId" | "attendeeCount" | "attendeeIds" | "createdAt" | "updatedAt">>,
): Promise<void> {
  const eventRef = doc(eventsCol(), eventId);

  await runTransaction(db(), async (tx) => {
    const eventSnap = await tx.get(eventRef);
    if (!eventSnap.exists()) throw new Error("Event not found.");
    const event = eventSnap.data() as Event;
    if (event.organizerId !== userId) throw new Error("Only the organizer can update this event.");

    tx.update(eventRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  });
}

/**
 * Deletes an event and atomically removes it from all attendees' joinedEvents.
 * Only the organizer can delete their event.
 * Throws if event doesn't exist or user is not the organizer.
 */
export async function deleteEvent(eventId: string, userId: string): Promise<void> {
  const eventRef = doc(eventsCol(), eventId);

  await runTransaction(db(), async (tx) => {
    const eventSnap = await tx.get(eventRef);
    if (!eventSnap.exists()) throw new Error("Event not found.");
    const event = eventSnap.data() as Event;
    if (event.organizerId !== userId) throw new Error("Only the organizer can delete this event.");

    // Remove event from all attendees' joinedEvents
    for (const attendeeId of event.attendeeIds) {
      const userRef = doc(usersCol(), attendeeId);
      tx.update(userRef, {
        joinedEvents: arrayRemove(eventId),
        updatedAt: serverTimestamp(),
      });
    }

    // Delete the event
    tx.delete(eventRef);
  });
}

// ── Club operations ───────────────────────────────────────────────────────

export async function getClub(id: string): Promise<Club | null> {
  const snap = await getDoc(doc(clubsCol(), id));
  return snap.exists() ? (snap.data() as Club) : null;
}

export async function getClubs(limitCount = 20): Promise<Club[]> {
  const snap = await getDocs(query(clubsCol(), orderBy("name"), limit(limitCount)));
  return snap.docs.map((d) => d.data() as Club);
}

/**
 * Atomically adds userId to club.memberIds, increments memberCount,
 * and adds clubId to user.joinedClubs. No-ops if already a member.
 */
export async function joinClub(clubId: string, userId: string): Promise<void> {
  const clubRef = doc(clubsCol(), clubId);
  const userRef = doc(usersCol(), userId);

  await runTransaction(db(), async (tx) => {
    const clubSnap = await tx.get(clubRef);
    if (!clubSnap.exists()) throw new Error("Club not found.");
    if ((clubSnap.data() as Club).memberIds.includes(userId)) return;

    tx.update(clubRef, {
      memberIds: arrayUnion(userId),
      memberCount: increment(1),
      updatedAt: serverTimestamp(),
    });
    tx.update(userRef, {
      joinedClubs: arrayUnion(clubId),
      updatedAt: serverTimestamp(),
    });
  });
}

/**
 * Atomically removes userId from club.memberIds and decrements memberCount.
 * No-ops if not currently a member.
 */
export async function leaveClub(clubId: string, userId: string): Promise<void> {
  const clubRef = doc(clubsCol(), clubId);
  const userRef = doc(usersCol(), userId);

  await runTransaction(db(), async (tx) => {
    const clubSnap = await tx.get(clubRef);
    if (!clubSnap.exists()) throw new Error("Club not found.");
    if (!(clubSnap.data() as Club).memberIds.includes(userId)) return;

    tx.update(clubRef, {
      memberIds: arrayRemove(userId),
      memberCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
    tx.update(userRef, {
      joinedClubs: arrayRemove(clubId),
      updatedAt: serverTimestamp(),
    });
  });
}

// ── Bookmark operations ───────────────────────────────────────────────────

export async function toggleSavedEvent(userId: string, eventId: string, save: boolean): Promise<void> {
  await updateDoc(doc(usersCol(), userId), {
    savedEvents: save ? arrayUnion(eventId) : arrayRemove(eventId),
    updatedAt: serverTimestamp(),
  });
}

export async function toggleSavedClub(userId: string, clubId: string, save: boolean): Promise<void> {
  await updateDoc(doc(usersCol(), userId), {
    savedClubs: save ? arrayUnion(clubId) : arrayRemove(clubId),
    updatedAt: serverTimestamp(),
  });
}

// ── Resource operations ───────────────────────────────────────────────────

export async function getResources(limitCount = 20): Promise<Resource[]> {
  const snap = await getDocs(
    query(resourcesCol(), orderBy("title"), limit(limitCount)),
  );
  return snap.docs.map((d) => d.data() as Resource);
}

export async function getResource(id: string): Promise<Resource | null> {
  const snap = await getDoc(doc(resourcesCol(), id));
  return snap.exists() ? (snap.data() as Resource) : null;
}

// ── Batch-by-ID operations ────────────────────────────────────────────────

export async function getEventsByIds(ids: string[]): Promise<Event[]> {
  if (ids.length === 0) return [];
  const snap = await getDocs(query(eventsCol(), where("id", "in", ids.slice(0, 30))));
  return snap.docs.map((d) => d.data() as Event);
}

export async function getClubsByIds(ids: string[]): Promise<Club[]> {
  if (ids.length === 0) return [];
  const snap = await getDocs(query(clubsCol(), where("id", "in", ids.slice(0, 30))));
  return snap.docs.map((d) => d.data() as Club);
}

