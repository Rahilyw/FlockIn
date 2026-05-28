import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import type { Timestamp } from "firebase-admin/firestore";
import { onDocumentWritten } from "firebase-functions/v2/firestore";

initializeApp();
const db = getFirestore();

// ── Types ─────────────────────────────────────────────────────────────────────

interface EventDoc {
  status?: "pending" | "approved" | "rejected";
  tags?: string[];
  savedCount?: number;
  rsvpCount?: number;
  updatedAt?: Timestamp;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function cleanTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/^#+/, "");
}

function getEngagement(event: EventDoc): number {
  return (event.savedCount ?? 0) + (event.rsvpCount ?? 0);
}

/**
 * Atomically adjusts eventCount and engagementScore on the given tag documents.
 * Creates tag documents if they don't exist (merge: true).
 * count is kept in sync with eventCount for backward compat with the UI.
 */
async function adjustTags(
  tags: string[],
  eventCountDelta: number,
  engagementDelta: number,
  lastUsed?: Timestamp,
): Promise<void> {
  if (!tags.length || (eventCountDelta === 0 && engagementDelta === 0)) return;

  const batch = db.batch();
  for (const tag of tags) {
    const ref = db.collection("tags").doc(tag);
    const patch: Record<string, unknown> = { name: tag };
    if (eventCountDelta !== 0) {
      patch.eventCount = FieldValue.increment(eventCountDelta);
      patch.count = FieldValue.increment(eventCountDelta);
    }
    if (engagementDelta !== 0) {
      patch.engagementScore = FieldValue.increment(engagementDelta);
    }
    if (lastUsed) {
      patch.lastUsed = lastUsed;
    }
    batch.set(ref, patch, { merge: true });
  }

  await batch.commit();
}

// ── onEventStatusChange ───────────────────────────────────────────────────────
// Triggered on every events/{eventId} write. Handles eventCount and
// engagementScore updates when an event transitions between statuses.
//
//   pending/rejected → approved  : +1 eventCount, +engagement for each tag
//   approved         → rejected  : -1 eventCount, -engagement for each tag
//   approved         → deleted   : -1 eventCount, -engagement for each tag
//
// Engagement-only writes (RSVP / Save on an already-approved event) have the
// same status before and after, so this function skips them — those are handled
// by onEngagementChange.

export const onEventStatusChange = onDocumentWritten(
  "events/{eventId}",
  async (event) => {
    if (!event.data) return;

    const before = event.data.before.exists
      ? (event.data.before.data() as EventDoc)
      : undefined;
    const after = event.data.after.exists
      ? (event.data.after.data() as EventDoc)
      : undefined;

    const prevStatus = before?.status;
    const nextStatus = after?.status;

    // Skip if status is unchanged — engagement changes are handled separately.
    if (prevStatus === nextStatus) return;

    const wasApproved = prevStatus === "approved";
    const nowApproved = nextStatus === "approved";

    if (wasApproved && !nowApproved) {
      // approved → rejected or deleted: remove contribution from tags
      const tags = (before!.tags ?? []).map(cleanTag).filter(Boolean);
      await adjustTags(tags, -1, -getEngagement(before!));
    } else if (!wasApproved && nowApproved && after) {
      // pending/rejected → approved: add contribution to tags
      const tags = (after.tags ?? []).map(cleanTag).filter(Boolean);
      await adjustTags(tags, +1, +getEngagement(after), after.updatedAt);
    }
  },
);

// ── onEngagementChange ────────────────────────────────────────────────────────
// Triggered on every events/{eventId} write. Handles engagementScore
// increments/decrements when savedBy or rsvpBy change on an approved event.
//
// Writes that also change status are left to onEventStatusChange — this
// function skips any write where the status itself changes.

export const onEngagementChange = onDocumentWritten(
  "events/{eventId}",
  async (event) => {
    if (!event.data) return;

    const before = event.data.before.exists
      ? (event.data.before.data() as EventDoc)
      : undefined;
    const after = event.data.after.exists
      ? (event.data.after.data() as EventDoc)
      : undefined;

    // Only act on approved events where status hasn't changed.
    if (after?.status !== "approved" || before?.status !== "approved") return;

    const delta = getEngagement(after) - getEngagement(before ?? {});
    if (delta === 0) return;

    const tags = (after.tags ?? []).map(cleanTag).filter(Boolean);
    await adjustTags(tags, 0, delta);
  },
);
