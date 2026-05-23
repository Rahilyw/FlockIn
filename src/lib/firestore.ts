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
  writeBatch,
  Timestamp,
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
const tagsCol = () => collection(db(), "tags");

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
  data: Omit<Event, "id" | "rsvpCount" | "rsvpBy" | "status" | "reported" | "savedBy" | "savedCount" | "createdAt" | "updatedAt">,
): Promise<string> {
  const ref = doc(eventsCol());
  await setDoc(ref, {
    ...data,
    id: ref.id,
    status: "pending",
    reported: false,
    savedBy: [],
    savedCount: 0,
    rsvpBy: [],
    rsvpCount: 0,
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
  approvedOnly?: boolean;
  activeOnly?: boolean;
}

export async function getEvents(options: GetEventsOptions = {}): Promise<Event[]> {
  const constraints: QueryConstraint[] = [];
  if (options.category) constraints.push(where("category", "==", options.category));
  if (options.approvedOnly) constraints.push(where("status", "==", "approved"));
  if (options.activeOnly) constraints.push(where("endTime", ">=", Timestamp.now()));
  constraints.push(orderBy(options.activeOnly ? "endTime" : "date", "asc"));
  if (options.limitCount) constraints.push(limit(options.limitCount));
  const snap = await getDocs(query(eventsCol(), ...constraints));
  return snap.docs.map((d) => d.data() as Event);
}

export async function getPendingEvents(): Promise<Event[]> {
  const snap = await getDocs(
    query(eventsCol(), where("status", "==", "pending"), orderBy("createdAt", "asc")),
  );
  return snap.docs.map((d) => d.data() as Event);
}

export async function approveEvent(id: string): Promise<void> {
  await updateDoc(doc(eventsCol(), id), {
    status: "approved",
    updatedAt: serverTimestamp(),
  });
}

export async function rejectEvent(id: string): Promise<void> {
  await updateDoc(doc(eventsCol(), id), {
    status: "rejected",
    updatedAt: serverTimestamp(),
  });
}

/**
 * Atomically adds userId to event.rsvpBy, increments rsvpCount,
 * and adds eventId to user.joinedEvents. No-ops if already joined.
 */
export async function joinEvent(eventId: string, userId: string): Promise<void> {
  const eventRef = doc(eventsCol(), eventId);
  const userRef = doc(usersCol(), userId);

  await runTransaction(db(), async (tx) => {
    const eventSnap = await tx.get(eventRef);
    if (!eventSnap.exists()) throw new Error("Event not found.");
    if ((eventSnap.data() as Event).rsvpBy.includes(userId)) return;

    tx.update(eventRef, {
      rsvpBy: arrayUnion(userId),
      rsvpCount: increment(1),
      updatedAt: serverTimestamp(),
    });
    tx.update(userRef, {
      joinedEvents: arrayUnion(eventId),
      updatedAt: serverTimestamp(),
    });
  });
}

/**
 * Atomically removes userId from event.rsvpBy and decrements rsvpCount.
 * No-ops if not currently attending.
 */
export async function leaveEvent(eventId: string, userId: string): Promise<void> {
  const eventRef = doc(eventsCol(), eventId);
  const userRef = doc(usersCol(), userId);

  await runTransaction(db(), async (tx) => {
    const eventSnap = await tx.get(eventRef);
    if (!eventSnap.exists()) throw new Error("Event not found.");
    if (!(eventSnap.data() as Event).rsvpBy.includes(userId)) return;

    tx.update(eventRef, {
      rsvpBy: arrayRemove(userId),
      rsvpCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
    tx.update(userRef, {
      joinedEvents: arrayRemove(eventId),
      updatedAt: serverTimestamp(),
    });
  });
}

/**
 * Updates event fields. Only the creator can update their event.
 * Throws if event doesn't exist or user is not the creator.
 */
export async function updateEvent(
  eventId: string,
  userId: string,
  updates: Partial<Omit<Event, "id" | "creatorId" | "rsvpCount" | "rsvpBy" | "createdAt" | "updatedAt">>,
): Promise<void> {
  const eventRef = doc(eventsCol(), eventId);

  await runTransaction(db(), async (tx) => {
    const eventSnap = await tx.get(eventRef);
    if (!eventSnap.exists()) throw new Error("Event not found.");
    const event = eventSnap.data() as Event;
    if (event.creatorId !== userId) throw new Error("Only the creator can update this event.");

    tx.update(eventRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  });
}

/**
 * Deletes an event and atomically removes it from all RSVP users' joinedEvents.
 * Only the creator can delete their event.
 * Throws if event doesn't exist or user is not the creator.
 */
export async function deleteEvent(eventId: string, userId: string): Promise<void> {
  const eventRef = doc(eventsCol(), eventId);

  await runTransaction(db(), async (tx) => {
    const eventSnap = await tx.get(eventRef);
    if (!eventSnap.exists()) throw new Error("Event not found.");
    const event = eventSnap.data() as Event;
    if (event.creatorId !== userId) throw new Error("Only the creator can delete this event.");

    // Remove event from all RSVP users' joinedEvents
    for (const rsvpUserId of event.rsvpBy) {
      const userRef = doc(usersCol(), rsvpUserId);
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
  const userRef = doc(usersCol(), userId);
  const eventRef = doc(eventsCol(), eventId);

  await runTransaction(db(), async (tx) => {
    const eventSnap = await tx.get(eventRef);
    if (!eventSnap.exists()) throw new Error("Event not found.");

    tx.update(userRef, {
      savedEvents: save ? arrayUnion(eventId) : arrayRemove(eventId),
      updatedAt: serverTimestamp(),
    });
    tx.update(eventRef, {
      savedBy: save ? arrayUnion(userId) : arrayRemove(userId),
      savedCount: increment(save ? 1 : -1),
      updatedAt: serverTimestamp(),
    });
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

// ── Rate-limit & moderation ───────────────────────────────────────────────

/**
 * Returns the number of events the user has created since midnight local time.
 * Used to enforce the 3-events-per-day limit.
 */
export async function getUserEventCountToday(userId: string): Promise<number> {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const snap = await getDocs(
    query(
      eventsCol(),
      where("creatorId", "==", userId),
      where("createdAt", ">=", Timestamp.fromDate(startOfToday)),
    ),
  );
  return snap.size;
}

/**
 * Flags an event as reported. Idempotent — safe to call multiple times.
 */
export async function reportEvent(eventId: string): Promise<void> {
  await updateDoc(doc(eventsCol(), eventId), {
    reported: true,
    updatedAt: serverTimestamp(),
  });
}

// ── Tag operations ────────────────────────────────────────────────────────

export interface TagDoc {
  name: string;
  count: number;
  lastUsed: Timestamp;
}

/**
 * Returns the top N tags ordered by usage count descending.
 */
export async function getTopTags(limitCount = 8): Promise<TagDoc[]> {
  const snap = await getDocs(
    query(tagsCol(), orderBy("count", "desc"), limit(limitCount)),
  );
  return snap.docs.map((d) => d.data() as TagDoc);
}

/**
 * Increments the usage count for each tag (upserts the tag doc).
 * Safe to call with an empty array — resolves immediately.
 */
export async function incrementTagCounts(tags: string[]): Promise<void> {
  if (tags.length === 0) return;
  const batch = writeBatch(db());
  for (const tag of tags) {
    const docId = tag.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const ref = doc(tagsCol(), docId);
    batch.set(ref, { name: tag, count: increment(1), lastUsed: serverTimestamp() }, { merge: true });
  }
  await batch.commit();
}

