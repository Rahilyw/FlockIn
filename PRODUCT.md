# FlockIn!! — Product Specification
> **For AI coding agents:** This is the single source of truth. Read it fully before writing any code, making any design decision, or suggesting any architecture. If something isn't here, ask before inventing.

---

## What Is FlockIn!!?

FlockIn!! is a **campus event discovery platform** — a living, digital version of the corkboard in the Student Union Building. It centralizes events, clubs, and resources for university students in one place, surfaced by interest and activity.

**Tagline:** *"Your Campus Connected."*

**Primary job:** A student should find something worth going to in under 30 seconds.

**The emotional hook:** When someone lands on the noticeboard for the first time, the reaction should be *"Whoa, this is actually cool."* That wow-factor is not a nice-to-have. It is the product.

---

## Users

University students discovering and engaging with campus life. They open FlockIn between classes, on mobile, in bright campus environments, with a quick-browse mindset.

**Open to everyone.** No UVic-only restriction. Any Google account can sign up, post, RSVP, and save.

---

## Brand Personality

**Three words: alive, approachable, electric.**

Warm, energetic, inviting. The interface should feel like a well-designed physical noticeboard buzzing with real activity — not a corporate portal, not a social feed.

### Color Palette (Already Set — Do Not Deviate)
- **Terracotta** as a primary warm accent
- **Pastel blobs / soft backgrounds** for depth and warmth
- No cold blues, no stark whites, no grey enterprise palettes

### Typography
- **Montserrat** — already in use, keep it
- Bold weights for headings, medium for body
- Never use Inter, Roboto, Arial, or system font stacks

### Motion
- Animations serve excitement, not distraction
- Always respect `prefers-reduced-motion` — already implemented, do not remove this
- Hover states, pin lifts, and poster straightening are the primary motion moments

---

## Anti-References — Never Build These

> These are explicit rejections. If your implementation looks like any of these, stop and reconsider.

- **Generic SaaS:** bland blue-and-white, Intercom-style feature grids, soulless corporate palette
- **Dark admin dashboards:** heavy sidebar nav, dense data tables, IT-tool vibes
- **Social media feeds:** infinite scroll, engagement counters, algorithmic content pressure, like counts as social pressure
- **Overstuffed student portals:** every feature crammed on one screen, zero visual hierarchy, university intranet energy

---

## Design Principles

1. **Energy without chaos.** The platform is lively but never overwhelming. Motion and color serve excitement, not distraction.
2. **Physical world as metaphor.** The noticeboard, pushpins, and posters are load-bearing identity. Lean into tactile, real-world references at every opportunity.
3. **Fast to value.** A student finds something worth joining in under 30 seconds. Visual hierarchy always serves discovery speed.
4. **Warmth at every touchpoint.** Terracotta, pastel blobs, Montserrat — the brand palette is set. Polish reinforces it, never replaces it.
5. **Consistent without being boring.** Same system, varied rhythm. Spacing, sizing, and weight create variety within coherence.

---

## Accessibility & Inclusion

- **WCAG AA contrast** as a minimum floor — no exceptions
- **`prefers-reduced-motion`** support already in place — preserve it in all new components
- **Semantic HTML** via shadcn/Radix — continue using these primitives
- **Touch targets minimum 44×44px** on mobile — enforce on all interactive elements

---

## Tech Stack

- **Frontend:** React + TypeScript
- **Backend/DB:** Firebase (Firestore, Firebase Storage, Firebase Auth)
- **UI Components:** shadcn/ui + Radix primitives
- **Styling:** TailwindCSS
- **Hosting:** Firebase Hosting or Vercel

**Firebase-first rule:** No custom backend server. All data logic goes through Firestore and Firebase Storage. Keep it simple.

---

## Existing UI — Preserve This

> ⚠️ The noticeboard already exists and looks great. Do not regress it.

The current implementation has:
- **Dark green felt board background** with subtle grid texture — keep exactly
- **Colored pushpins** (red, yellow, teal) at the top of each poster card
- **Slight random rotation** on each poster (`-3deg` to `+3deg`) — feels real and pinned
- **Left sidebar** with: Noticeboard, Trending, Clubs, Resources, Saved, and a "Post an Event" CTA
- **Hashtag pills** above the board for quick filtering
- **Masonry layout** preserving each poster's natural aspect ratio
- **FlockIn!! wordmark** top-left in colorful bold type
- **Dark wooden frame** bordering the green board area

Do not flatten to white. Do not convert to a card grid. Do not remove pins or rotation. Fit all new features into this aesthetic.

---

## The Noticeboard — Core Feature

The virtual noticeboard is the main attraction. Every design and engineering decision should make it more delightful, not more utilitarian.

### Navigation Naming
The main board view is called **"Noticeboard"** everywhere — in the sidebar, top nav, and page title. Do not call it "Your Feed" or "Discover." "Your Feed" implies personalization that doesn't exist yet — calling it that and showing the same unfiltered board to everyone is a trust break. The name is simply **Noticeboard**.

### Visual Behavior
- Posters render with randomized rotation **seeded per event ID** — hash the event's Firestore ID to a rotation value between `-3deg` and `+3deg`. This must be stable and consistent across re-renders. Do not use array index (`ROTATIONS[i % n]`) — this causes rotation shuffling when the event list order changes.
- On hover: poster smoothly straightens to `0deg`, scales to `1.04`, shadow deepens — "lifts off the board"
- Use CSS transitions for smoothness; respect `prefers-reduced-motion`
- Masonry layout — no fixed card heights, preserve poster aspect ratios

### Poster Hover Overlay
On hover (desktop) or tap (mobile), show a semi-transparent dark overlay revealing:
- Event title + date + time + end time
- **Save 🔖** button (toggle — filled state when saved)
- **RSVP ✅** button (toggle — filled state when attending)
- **"View Details"** → event detail modal

### Event Lifecycle on the Board
- Only **future and current** events appear on the noticeboard. An event is "current" if the current time is before its `endTime`.
- Once an event's `endTime` has passed, it is automatically excluded from the noticeboard query (filter `endTime >= now()` in the Firestore query).
- Past events are **not deleted** — they remain in Firestore and are accessible in "My Space → My Events" for the creator. They just don't show on the public board.
- This keeps the board feeling alive and up-to-date without any manual cleanup.

### Hashtag Pills

Displayed above the board in a horizontal scrollable row. This is the first interactive element a student sees — it must feel alive and responsive.

**Ordering — Popularity-Ranked (Dynamic):**
The pill bar shows the top 8 tags ranked by `engagementScore` from the `tags` Firestore collection (see Data Model). As students RSVP and Save events, scores update and the bar shifts. Only tags on **active (future) events** contribute to the score — expired events stop counting automatically.

**Two Auto-Generated System Tags (always shown first, no creator input needed):**
- `#Today` — auto-applied to any event whose date matches today's date
- `#Happening Now` — auto-applied to events currently in progress (current time is between `time` and `endTime`)

These make the board feel live. Implement them as computed client-side filters, not stored tags.

> ⚙️ **Implementation note for `#Happening Now`:** `endTime` is stored as a string (e.g. `"9:00 PM"`) and `date` is a Firestore Timestamp (date portion only). To determine if an event is currently in progress, you must combine both into a full comparable datetime on the client. This is non-trivial — especially for events that cross midnight or involve timezone differences. A dedicated helper function **must** be used. It lives at `src/lib/eventTime.ts` and exports:
> ```ts
> // Combines a Firestore Timestamp (date) + time string (e.g. "9:00 PM") into a JS Date
> export function toDateTime(date: Timestamp, time: string): Date
>
> // Returns true if current time is between the event's start and end datetime
> export function isHappeningNow(event: Event): boolean
>
> // Returns true if the event's date matches today's local date
> export function isToday(event: Event): boolean
> ```
> All `#Happening Now` and `#Today` filtering must go through these helpers — never inline the date logic in components.

**Pill Behaviour:**
- Each pill shows a count badge: `#FreePizza 3` (number of active events with that tag)
- **Active state:** pill fills with terracotta, slight scale-up (`scale(1.05)`), subtle bounce animation on activation
- **Multi-select:** students can stack tags — `#Tonight` + `#Free` narrows results simultaneously. Active pills stay filled; a second click deactivates.
- **Clear all:** an `✕` button appears in the row whenever any tag is active. Clicking it resets the board with a satisfying "pop" transition back to full view.

**Filtering Animation (do not just hide/show):**
- Non-matching posters: fade to 20% opacity + shrink slightly (`scale(0.96)`)
- Matching posters: remain full opacity, may subtly lift (`scale(1.02)`) to "come forward" off the board
- Use CSS transitions; respect `prefers-reduced-motion` (instant show/hide with no animation if motion is reduced)
- Filter is applied in real-time as tags are toggled — no submit button

---

## Mobile Layout

> Users open FlockIn between classes, on mobile, in bright campus environments. Mobile is a first-class experience, not an afterthought.

### Layout Changes on Mobile (≤768px)
- **Bottom tab bar replaces the left sidebar** — four tabs: Noticeboard, Saved, Post (+), My Space
- The "Post an Event" action lives as the center tab (large `+` button, terracotta) — always one tap away
- Left sidebar is hidden on mobile entirely — do not show a hamburger that reveals it
- Top nav simplifies to: FlockIn!! logo (left) + Avatar/Sign In (right) only

### Noticeboard on Mobile
- **Single-column masonry** — one poster per row, full width, natural aspect ratio preserved
- Hashtag pills scroll horizontally above the board — same behaviour as desktop, touch-scrollable
- Poster tap = show overlay (same Save/RSVP/View Details as desktop hover)
- Pushpins and rotation stay — they are identity, not decoration

### Touch Interactions
- All tap targets minimum 44×44px — enforced on every interactive element
- Save and RSVP buttons on the overlay must be large enough to tap confidently with a thumb
- Swipe gestures: not required for MVP, do not add unless explicitly requested

---

## Engagement Model

> **Save and Like are the same thing.** There is no separate Like button.

Two and only two engagement actions exist:

| Action | Icon | Meaning | Appears in My Space |
|---|---|---|---|
| **Save** | 🔖 | Bookmark for later | Saved tab |
| **RSVP** | ✅ | I'm going | Going tab |

Do not implement a heart/like button. It is redundant with Save. If any existing Like UI exists, remove it and replace with Save.

---

## Moderation & Safety

> Open posting is right for growth, but zero moderation is a gamble. This section defines the minimum safety layer for MVP.

### Admin Approval Flow
- There is **one administrator account** — the product owner (Rahil). Admin UID is stored in a `config/admin` Firestore document or hardcoded as an environment variable.
- All newly posted events have a status of `"pending"` by default and **do not appear on the public noticeboard** until approved.
- The admin sees a private **Admin Review Queue** — a list of all `pending` events with poster image, details, and two actions: **Approve** ✅ or **Reject** ❌.
- On approval: event `status` changes to `"approved"` → appears on the noticeboard immediately.
- On rejection: event `status` changes to `"rejected"` → creator sees a notice in "My Space → My Events" that their event was not approved (no reason required for MVP).
- Admin queue is accessible at a private route e.g. `/admin` — only renders if the signed-in UID matches the admin UID. Anyone else gets redirected.

### Rate Limiting
- Each user may post a maximum of **3 events per day**.
- Enforce client-side: on "Post an Event" submit, query Firestore for events where `creatorId === uid` and `createdAt >= start of today`. If count ≥ 3, block submission and show a friendly message: *"You've posted 3 events today — come back tomorrow!"*
- This is a soft limit (client-enforced). Firestore security rules should mirror this with a server-side check where possible.

### Report / Flag Button
- Every event card and event detail view has a **"Report" option** (accessible via a `···` menu or small flag icon — unobtrusive, not a primary action).
- Reporting an event sets a `reported: true` flag on the event document in Firestore.
- Reported events are surfaced in the Admin Review Queue for the admin to review and remove if needed.
- No automated hiding on report — the admin decides. One report does not remove an event.

### `events` Status Field
```
status: "pending" | "approved" | "rejected"
```
- Noticeboard query: `WHERE status == "approved" AND endTime >= now()`
- Admin queue query: `WHERE status == "pending"` ordered by `createdAt` ascending (oldest first)

---

## Authentication

- **Firebase Auth with Google Sign-In only** — the target state
- **Any Google account accepted** — no `@uvic.ca` restriction
- Unauthenticated users can browse and view the noticeboard freely (read-only)
- To post, RSVP, or save — user must be signed in; prompt login if they attempt while logged out
- Show user's display name and Google avatar in the nav when signed in

> **Current state:** Email/password `Login.tsx` and `Signup.tsx` forms exist. Do not remove them mid-development — they are useful for testing. Remove/replace with Google-only screens before public launch. Do not invest further work in the email/password flows.

---

## User Flows

### Creator Flow (Posting an Event)
1. Any signed-in user clicks "Post an Event"
2. Uploads a `.png` or `.jpg` poster image (max 5MB) — preview shown immediately
3. Fills in: Title, Date, Start Time, End Time, Location, Description, Tags (optional)
4. Submits → event saved to Firestore with `status: "pending"`
5. Creator sees a confirmation: *"Your event is under review and will appear on the board once approved."*
6. Admin approves → poster appears on the noticeboard in real-time
7. Creator visits "My Space" to manage their events

**Rule:** Users can only edit or delete events they created. Enforced in UI and Firestore security rules.

### Explorer Flow (Discovering Events)
1. Lands on the noticeboard — no login needed to browse
2. Hovers over a poster → overlay appears
3. Clicks Save or RSVP → prompted to log in if not signed in
4. Visits "My Space → Saved" or "My Space → Going" to track events

---

## Data Model

### `events` collection
```typescript
{
  id: string;               // Firestore auto-ID
  creatorId: string;        // auth.uid of poster
  creatorName: string;      // display name
  creatorPhoto?: string;    // Google avatar URL, stored at creation
  title: string;            // max 80 chars
  description: string;      // max 500 chars
  date: Timestamp;          // event date (date portion)
  time: string;             // start time, e.g. "6:00 PM"
  endTime: string;          // end time, e.g. "9:00 PM" — required, used for #Happening Now and board expiry
  location: string;         // e.g. "SUB Vertigo Room"
  tags?: string[];          // e.g. ["Free", "Tonight"]
  imageUrl: string | null;  // Firebase Storage download URL — null if no image uploaded (use fallback gradient)
  imagePath: string | null; // Storage path (for deletion on edit/delete) — null if no image
  status: "pending" | "approved" | "rejected";  // moderation state
  reported: boolean;        // true if user has flagged this event
  savedBy: string[];        // UIDs of users who saved — ⚠️ see scalability note below
  savedCount: number;
  rsvpBy: string[];         // UIDs of users who RSVP'd — ⚠️ see scalability note below
  rsvpCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

> ❌ No `likedBy`, no `likesCount`. Save is the like.

> ⚠️ **Scalability note on `savedBy` / `rsvpBy` arrays:** Firestore document size limit is ~1MB. Arrays of UIDs work fine at campus scale (hundreds of users) but would hit limits if an event goes viral at a much larger scale (tens of thousands of RSVPs). At that point, the correct pattern is a subcollection (`events/{id}/rsvps/{uid}`) or a separate junction collection. This is not a concern for MVP — acknowledge it and revisit if needed when usage grows.

### `users` collection
```typescript
{
  uid: string;
  displayName: string;
  email: string;            // any domain
  photoURL?: string;
  createdAt: Timestamp;
}
```

### `tags` collection
```typescript
{
  name: string;              // e.g. "FreePizza" — no # symbol, no spaces
  eventCount: number;        // number of active approved events using this tag
  engagementScore: number;   // sum of (savedCount + rsvpCount) across all active approved events with this tag
  lastUsed: Timestamp;       // when an event with this tag was last approved
}
```

**Write rules for `tags`:**
- When an event is **approved**: increment `eventCount` and update `lastUsed` for each of its tags. Create the tag document if it doesn't exist.
- When an event is **deleted, rejected, or expires**: decrement `eventCount` and recalculate `engagementScore` for its tags.
- When a user **Saves or RSVPs** to an event: increment `engagementScore` for each of that event's tags by 1.
- When a user **un-Saves or cancels RSVP**: decrement `engagementScore` accordingly.

> ⚙️ **Implementation: Tag aggregation writes are handled by Firebase Cloud Functions triggered on event document writes** — not by the client. Clients cannot be trusted to update aggregate `tags` documents reliably (race conditions, offline state, malicious writes). Two Cloud Functions are required:
> - `onEventStatusChange` — triggered on `events/{id}` write: handles `eventCount` and `engagementScore` updates when an event is approved, rejected, or deleted.
> - `onEngagementChange` — triggered on `events/{id}` write: handles `engagementScore` increments/decrements when `savedBy` or `rsvpBy` arrays change.
>
> Both functions use Firestore transactions to ensure atomic updates. The `tags` collection is **read-only from the client** — clients may only read it to render the pill bar.

The pill bar queries: `tags` ordered by `engagementScore` descending, limit 8.

> `#Today` and `#Happening Now` are **computed client-side** — do not store them in the `tags` collection.

### Firestore Security Rules
```
- Unauthenticated users: READ approved events and tags only
- Authenticated users: READ all events/tags, CREATE events (status auto-set to "pending"),
  UPDATE savedBy/savedCount/rsvpBy/rsvpCount/reported on approved events
- Event owner (auth.uid === creatorId): UPDATE and DELETE their own events only
- Admin UID only: UPDATE event status (approve/reject)
- tags collection: writable via Firestore transactions triggered by event/engagement writes only
```

---

## "My Space" Dashboard

Personal hub for signed-in users. Three tabs:

**My Events** — events the user created
- Poster thumbnail, title, date, location, save count, RSVP count
- Status badge: `Pending Review` / `Approved` / `Rejected`
- Edit button → pre-filled form (only available on pending/approved events)
- Delete button → confirmation dialog → removes from Firestore + Storage

**Saved** — events where user UID is in `savedBy`
- Card or list view, Unsave button on each

**Going** — events where user UID is in `rsvpBy`
- Date/time + end time shown prominently, Cancel RSVP option

---

## Event Creation Form

Fields:
1. **Poster Image** — drag-and-drop or click. `.png`/`.jpg`, max 5MB. Immediate preview. **Optional** — if no image is uploaded, a fallback gradient is auto-assigned from the event's category or a deterministic gradient seeded by the event ID. The noticeboard must look visually rich whether or not a custom image is provided. Never show a blank or broken poster slot.
2. **Title** — required, max 80 chars
3. **Date** — date picker, required, today or future
4. **Start Time** — time picker, required (e.g. "6:00 PM")
5. **End Time** — time picker, required (e.g. "9:00 PM"), must be after Start Time
6. **Location** — required
7. **Description** — required, max 500 chars
8. **Tags** — optional, e.g. `FreePizza, Tonight, ArtsWeek`

> **Fallback gradient palette** (already defined in `Noticeboard.tsx` — reuse exactly):
> ```ts
> const FALLBACK_GRADIENTS = [
>   "linear-gradient(160deg, #f97316 0%, #a855f7 50%, #3b82f6 100%)",
>   "linear-gradient(160deg, #134e4a 0%, #0ea5e9 60%, #67e8f9 100%)",
>   "linear-gradient(160deg, #166534 0%, #84cc16 60%, #fde68a 100%)",
>   "linear-gradient(160deg, #1e1b4b 0%, #7c3aed 55%, #ec4899 100%)",
>   "linear-gradient(160deg, #7f1d1d 0%, #f97316 55%, #fde68a 100%)",
>   "linear-gradient(160deg, #0c4a6e 0%, #0ea5e9 55%, #a7f3d0 100%)",
> ];
> ```
> Assign by hashing `event.id` to a stable index — same event always gets the same gradient.

On submit: if image provided, upload to Storage → get `imageUrl` + `imagePath`. If no image, set `imageUrl: null` and `imagePath: null`. Write Firestore doc with `status: "pending"` → show confirmation message.

Edit flow: same form pre-populated. New image upload replaces old (delete old from Storage first using `imagePath`). If image removed on edit, set both to `null`. Edited events reset to `status: "pending"` and re-enter the approval queue.

**Rate limit enforcement:** Before submitting, query `events` where `creatorId === uid AND createdAt >= today`. If count ≥ 3, block form submission with message: *"You've posted 3 events today — come back tomorrow!"*

---

## Navigation

**Top nav (desktop):**
```
[FlockIn!! logo]  [Noticeboard] [Events] [Clubs] [Resources] [My Space]  [Avatar / Sign In]
```

**Left sidebar (desktop, Noticeboard page):**
- Noticeboard
- Clubs
- Resources
- Saved
- **[Post an Event]** — primary CTA, always visible

> **Note on "Trending":** Removed from MVP. A "Trending" view (sorted by `rsvpCount + savedCount` desc) is a natural Phase 2 addition once there is enough engagement data to make it meaningful. Do not add it until explicitly requested.

**Bottom tab bar (mobile ≤768px) — replaces sidebar:**
```
[Noticeboard]  [Saved]  [+ Post]  [My Space]  [Sign In/Avatar]
```
- `+` Post button is center, terracotta, larger than other tabs
- Left sidebar is hidden on mobile

---

## Feature Phases — Roadmap & Policy

> **Policy: Never delete or hide features that have already been built, regardless of phase.** FlockIn!! is expanding continuously. If a Phase 2 or Phase 3 feature exists in the codebase, keep it visible and working. Only remove or hide a feature if explicitly instructed to do so.

The phase labels below indicate **when to prioritise building** something from scratch — not whether to keep it if it already exists.

| Feature | Phase | Current State |
|---|---|---|
| Emoji / GIF / comment reactions on events | Phase 2 | Not built |
| Social proof ("X students going") | Phase 2 | `attendeeCount` partially built — keep it |
| Club directory and club pages | Phase 2 | Already built (`/clubs`, `/clubs/:id`) — keep live |
| Event search and advanced filtering | Phase 2 | Already built in `EventList` — keep live |
| Campus resources directory | Phase 2 | Already built (`/resources`, `/resources/:id`) — keep live |
| Google / Apple Calendar integration | Phase 3 | Not built |
| Schedule conflict detection | Phase 3 | Not built |
| Push or email notifications | Phase 3 | Not built |
| Mobile app (React Native) | Phase 3 | Not built |
| "Expiring Soon" pulse on same-day events | Phase 2 | Not built |
| Noticeboard "snapshot" share (html2canvas) | Phase 2 | Not built |
| Pinned / Featured event slot (gold pushpin, admin-only) | Phase 2 | Not built |
| Anonymous engagement analytics (Firebase Analytics) | Phase 2 | Not built |
| Dark mode toggle | Phase 3 | Not built |
| Event creation templates (Workshop, Social, Film Screening) | Phase 3 | Not built |
| Duplicate event detection before admin approval | Phase 3 | Not built |

**What "Phase 2/3" means in practice:**
- If it's already built → keep it, don't touch it unless fixing a bug or explicitly asked to improve it
- If it's not yet built → don't start building it until all P0 and P1 items are done
- Never delete working code to "clean up" scope

---

## Data Model Migration — Required Field Renames

> The existing codebase uses different field names than this spec. These must be migrated for consistency. Any agent reading this spec should use the spec field names and update existing references.

| Old field name | New field name | Notes |
|---|---|---|
| `organizerId` | `creatorId` | |
| `organizerName` | `creatorName` | |
| *(missing)* | `creatorPhoto` | Add: creator's Google avatar URL, stored at event creation |
| `attendeeIds` | `rsvpBy` | |
| `attendeeCount` | `rsvpCount` | |
| *(missing)* | `savedBy` | Add: array of UIDs |
| *(missing)* | `savedCount` | Add: number |
| *(missing)* | `imagePath` | Add: Firebase Storage path for deletion on edit/delete |
| *(missing)* | `time: string` | Add: start time e.g. "6:00 PM" |
| *(missing)* | `endTime: string` | Add: end time e.g. "9:00 PM" — required for board expiry and #Happening Now |
| *(missing)* | `status` | Add: `"pending" \| "approved" \| "rejected"` |
| *(missing)* | `reported` | Add: `boolean`, default `false` |

When migrating: update `firebaseTypes.ts`, all Firestore read/write helpers, and any component that references the old field names.

---

## File Structure

```
src/
  components/
    Noticeboard/
      Noticeboard.tsx         # Board wall — queries status=="approved" && endTime>=now
      PosterCard.tsx          # Poster: pin + ID-seeded tilt + hover overlay
      PosterOverlay.tsx       # Save + RSVP + Report buttons
    Dashboard/
      MySpace.tsx             # Tab shell
      MyEvents.tsx            # Shows status badge (Pending/Approved/Rejected)
      SavedEvents.tsx
      GoingEvents.tsx
    Admin/
      AdminQueue.tsx          # Pending event review — admin UID gated
    EventForm/
      EventForm.tsx           # Shared create/edit form (start + end time fields)
      ImageUploader.tsx
    Layout/
      Navbar.tsx
      Sidebar.tsx             # Desktop only
      BottomTabBar.tsx        # Mobile only (≤768px)
  pages/
    Home.tsx                  # Noticeboard
    Dashboard.tsx             # My Space
    EventDetail.tsx           # Single event modal or page
    Admin.tsx                 # Admin review queue (protected by UID check)
  firebase/
    config.ts
    auth.ts
    events.ts                 # Firestore CRUD
    storage.ts                # Upload/delete helpers
  hooks/
    useAuth.ts
    useEvents.ts
    useAdmin.ts               # Admin-specific queries
  types/
    index.ts                  # Event, User TypeScript types
```

---

## Known Gaps — Current State vs. Spec

> This section tracks identified gaps between what's built and what the spec requires. Check here before starting work to avoid duplicating effort. Remove items as they ship.

### 🔴 P0 — Blockers (nothing ships until these are done)

1. **Image upload not implemented** — `CreateEvent` and `EditEvent` accept a URL string only. Must be replaced with Firebase Storage upload: drag-drop or click, `.png`/`.jpg`, max 5MB, live preview, stores both `imageUrl` and `imagePath`. **Image is optional** — if skipped, `imageUrl` and `imagePath` are `null` and a fallback gradient (seeded by event ID) is shown on the noticeboard.
2. **Data model field renames** — see migration table above. `organizerId` → `creatorId` etc. across `firebaseTypes.ts` and all consumers. Also add `endTime`, `status`, `reported`.
3. **Hashtag pills are hardcoded and non-functional** — must pull from live `tags` collection, filter noticeboard in real-time, support multi-select.
4. **"My Space" has wrong tabs** — needs: My Events (created by user, with status badge) / Saved / Going.
5. **Admin approval flow not built** — new events must default to `status: "pending"`, not appear on the board. Admin queue at `/admin` must exist and be UID-gated.

### 🟠 P1 — Polish (needed to pass MVP done checklist)

6. **Poster rotation is index-based, not event-ID-seeded** — hash `event.id` to a stable rotation value. Do not use `ROTATIONS[i % n]`.
7. **`endTime` not shown** — `EventCard`, overlay, and `EventDetail` must show both start and end time prominently.
8. **`creatorPhoto` not stored or displayed** — capture Google avatar URL at event creation, show in event detail.
9. **Old Storage image not deleted on edit** — use `imagePath` to delete old image from Storage before uploading new one.
10. **Save/RSVP prompt on logged-out click** — must prompt login flow, not silently fail.
11. **Rate limiter not implemented** — check `createdAt >= today` count before allowing form submission.
12. **Report button not implemented** — `···` menu on every event card/detail with a Report option that sets `reported: true`.
13. **Mobile bottom tab bar not implemented** — sidebar hidden on mobile, replaced by bottom tabs.

---

## MVP Done When

1. ✅ Anyone signs in with any Google account
2. ✅ Any signed-in user posts an event with an image (with real Firebase Storage upload)
3. ✅ New events enter `pending` state, confirmed to creator, not visible on board until approved
4. ✅ Admin can approve or reject events from the `/admin` queue
5. ✅ Approved posters appear on the noticeboard with pushpin and ID-seeded tilt
6. ✅ Any signed-in user can Save 🔖 or RSVP ✅ (no separate Like button)
7. ✅ Saved and RSVP'd events appear in "My Space" correctly
8. ✅ Creators can edit and delete only their own events; edits re-enter pending queue
9. ✅ Noticeboard is fully browsable without logging in
10. ✅ Past events (endTime passed) auto-disappear from the board
11. ✅ Green felt board, pushpins, tilted posters, Montserrat, terracotta — all intact
12. ✅ WCAG AA contrast passes, `prefers-reduced-motion` respected, 44px touch targets met
13. ✅ Hashtag pills show popularity-ranked tags with live count badges and multi-select filtering
14. ✅ `#Today` and `#Happening Now` auto-appear when relevant
15. ✅ Rate limit blocks more than 3 event posts per user per day
16. ✅ Report button exists on every event; sets `reported: true` in Firestore
17. ✅ Mobile bottom tab bar works; noticeboard is single-column on mobile

---

*Open to everyone. Built for campus life.*