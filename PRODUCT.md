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
- **Left sidebar** with: Your Feed, Trending, Clubs, Resources, Saved, and a "Post an Event" CTA
- **Hashtag pills** above the board for quick filtering
- **Masonry layout** preserving each poster's natural aspect ratio
- **FlockIn!! wordmark** top-left in colorful bold type
- **Dark wooden frame** bordering the green board area

Do not flatten to white. Do not convert to a card grid. Do not remove pins or rotation. Fit all new features into this aesthetic.

---

## The Noticeboard — Core Feature

The virtual noticeboard is the main attraction. Every design and engineering decision should make it more delightful, not more utilitarian.

### Visual Behavior
- Posters render with randomized rotation seeded per event ID (consistent across renders, not re-randomizing on re-render)
- On hover: poster smoothly straightens to `0deg`, scales to `1.04`, shadow deepens — "lifts off the board"
- Use CSS transitions for smoothness; respect `prefers-reduced-motion`
- Masonry layout — no fixed card heights, preserve poster aspect ratios

### Poster Hover Overlay
On hover (desktop) or tap (mobile), show a semi-transparent dark overlay revealing:
- Event title + date/time
- **Save 🔖** button (toggle — filled state when saved)
- **RSVP ✅** button (toggle — filled state when attending)
- **"View Details"** → event detail modal

### Hashtag Pills

Displayed above the board in a horizontal scrollable row. This is the first interactive element a student sees — it must feel alive and responsive.

**Ordering — Popularity-Ranked (Dynamic):**
The pill bar shows the top 8 tags ranked by `engagementScore` from the `tags` Firestore collection (see Data Model). As students RSVP and Save events, scores update and the bar shifts. Only tags on **active (future) events** contribute to the score — expired events stop counting automatically.

**Two Auto-Generated System Tags (always shown first, no creator input needed):**
- `#Today` — auto-applied to any event whose date matches today's date
- `#Happening Now` — auto-applied to events currently in progress (current time falls between event start time and +2 hours)

These make the board feel live. Implement them as computed filters, not stored tags.

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

## Engagement Model

> **Save and Like are the same thing.** There is no separate Like button.

Two and only two engagement actions exist:

| Action | Icon | Meaning | Appears in My Space |
|---|---|---|---|
| **Save** | 🔖 | Bookmark for later | Saved tab |
| **RSVP** | ✅ | I'm going | Going tab |

Do not implement a heart/like button. It is redundant with Save. If any existing Like UI exists, remove it and replace with Save.

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
1. Any signed-in user clicks "Post an Event" in the sidebar
2. Uploads a `.png` or `.jpg` poster image (max 5MB) — preview shown immediately
3. Fills in: Title, Date, Time, Location, Description, Tags (optional)
4. Submits → poster appears on the noticeboard in real-time
5. Visits "My Space" to manage their events

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
  creatorPhoto?: string;    // avatar URL
  title: string;            // max 80 chars
  description: string;      // max 500 chars
  date: Timestamp;
  time: string;             // e.g. "6:00 PM"
  location: string;         // e.g. "SUB Vertigo Room"
  tags?: string[];          // e.g. ["Free", "Tonight"]
  imageUrl: string;         // Firebase Storage download URL
  imagePath: string;        // Storage path (for deletion)
  savedBy: string[];        // UIDs of users who saved
  savedCount: number;
  rsvpBy: string[];         // UIDs of users who RSVP'd
  rsvpCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

> ❌ No `likedBy`, no `likesCount`. Save is the like.

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
  eventCount: number;        // number of active (future) events using this tag
  engagementScore: number;   // sum of (savedCount + rsvpCount) across all active events with this tag
  lastUsed: Timestamp;       // when an event with this tag was last posted
}
```

**Write rules for `tags`:**
- When an event is **created**: increment `eventCount` and `lastUsed` for each of its tags. Create the tag document if it doesn't exist.
- When an event is **deleted or expires**: decrement `eventCount` and recalculate `engagementScore` for its tags.
- When a user **Saves or RSVPs** to an event: increment `engagementScore` for each of that event's tags by 1.
- When a user **un-Saves or cancels RSVP**: decrement `engagementScore` accordingly.

The pill bar queries: `tags` ordered by `engagementScore` descending, limit 8.

> `#Today` and `#Happening Now` are **computed client-side** — do not store them in the `tags` collection. They are derived from event `date` and `time` fields at render time.

### Firestore Security Rules
```
- Unauthenticated users: READ events and tags only
- Authenticated users: READ all events/tags, CREATE events, UPDATE savedBy/savedCount/rsvpBy/rsvpCount on any event
- Event owner (auth.uid === creatorId): UPDATE and DELETE their own events only
- tags collection: only writable via backend logic triggered by event/engagement writes (use Firestore transactions to keep counts consistent)
```

---

## "My Space" Dashboard

Personal hub for signed-in users. Three tabs:

**My Events** — events the user created
- Poster thumbnail, title, date, location, save count, RSVP count
- Edit button → pre-filled form
- Delete button → confirmation dialog → removes from Firestore + Storage

**Saved** — events where user UID is in `savedBy`
- Card or list view, Unsave button on each

**Going** — events where user UID is in `rsvpBy`
- Date/time shown prominently, Cancel RSVP option

---

## Event Creation Form

Fields:
1. **Poster Image** — drag-and-drop or click. `.png`/`.jpg`, max 5MB. Immediate preview.
2. **Title** — required, max 80 chars
3. **Date** — date picker, required, today or future
4. **Time** — time picker, required
5. **Location** — required
6. **Description** — required, max 500 chars
7. **Tags** — optional, e.g. `FreePizza, Tonight, ArtsWeek`

On submit: upload image to Storage → get URL → write Firestore doc → redirect to noticeboard.

Edit flow: same form pre-populated. New image upload replaces old (delete old from Storage first).

---

## Navigation

**Top nav:**
```
[FlockIn!! logo]  [Discover] [Events] [Clubs] [Resources] [My Space]  [Avatar / Sign In]
```

**Left sidebar (Discover page):**
- Your Feed
- Trending
- Clubs *(Phase 2)*
- Resources *(Phase 2)*
- Saved
- **[Post an Event]** — primary CTA, always visible

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

**What "Phase 2/3" means in practice:**
- If it's already built → keep it, don't touch it unless fixing a bug or explicitly asked to improve it
- If it's not yet built → don't start building it until all P0 and P1 items are done
- Never delete working code to "clean up" scope

---

## File Structure

```
src/
  components/
    Noticeboard/
      Noticeboard.tsx         # Board wall
      PosterCard.tsx          # Poster: pin + tilt + hover overlay
      PosterOverlay.tsx       # Save + RSVP buttons
    Dashboard/
      MySpace.tsx             # Tab shell
      MyEvents.tsx
      SavedEvents.tsx
      GoingEvents.tsx
    EventForm/
      EventForm.tsx           # Shared create/edit form
      ImageUploader.tsx
    Layout/
      Navbar.tsx
      Sidebar.tsx
  pages/
    Home.tsx                  # Noticeboard
    Dashboard.tsx             # My Space
    EventDetail.tsx           # Single event modal or page
  firebase/
    config.ts
    auth.ts
    events.ts                 # Firestore CRUD
    storage.ts                # Upload/delete helpers
  hooks/
    useAuth.ts
    useEvents.ts
  types/
    index.ts                  # Event, User TypeScript types
```

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
| *(missing)* | `time: string` | Add: separate time field e.g. "6:00 PM" — do not rely on date Timestamp alone |

When migrating: update `firebaseTypes.ts`, all Firestore read/write helpers, and any component that references the old field names.

---

## Known Gaps — Current State vs. Spec

> This section tracks identified gaps between what's built and what the spec requires. Check here before starting work to avoid duplicating effort. Mark items done as they ship.

### 🔴 P0 — Blockers (nothing ships until these are done)

1. **Image upload not implemented** — `CreateEvent` and `EditEvent` accept a URL string only. Must be replaced with Firebase Storage upload: drag-drop or click, `.png`/`.jpg`, max 5MB, live preview, stores both `imageUrl` (download URL) and `imagePath` (storage path).
2. **Data model field renames** — see migration table above. `organizerId` → `creatorId` etc. across `firebaseTypes.ts` and all consumers.
3. **Hashtag pills are hardcoded and non-functional** — currently a static array. Must pull from live `tags` collection, filter noticeboard in real-time on click, support multi-select.
4. **"My Space" has wrong tabs** — current tabs are Joined Events / Joined Clubs / Saved Events / Saved Clubs. Spec requires: My Events (created by user) / Saved / Going. "My Events" tab doesn't exist yet.

### 🟠 P1 — Polish (needed to pass MVP done checklist)

5. **Poster rotation is index-based, not event-ID-seeded** — `ROTATIONS[i % ROTATIONS.length]` means order changes re-shuffle rotations. Must hash `event.id` to get a stable, consistent rotation per poster.
6. **`time` field not shown** — `EventCard` and `EventDetail` show date but never time of day. Must show e.g. "6:00 PM" prominently — critical for students checking if they can attend between classes.
7. **`creatorPhoto` not stored or displayed** — event creation must capture the poster's Google avatar URL and store it on the event document. Show it in event detail view.
8. **Old Storage image not deleted on edit** — when a creator uploads a new poster image during edit, the old file must be deleted from Firebase Storage using `imagePath` before uploading the new one.
9. **Save/RSVP prompt on logged-out click** — currently may silently fail. Must prompt login flow when an unauthenticated user tries to Save or RSVP.

---



1. ✅ Anyone signs in with any Google account
2. ✅ Any signed-in user posts an event with an image
3. ✅ Poster appears on the noticeboard with pushpin and tilt — matching existing aesthetic
4. ✅ Any signed-in user can Save 🔖 or RSVP ✅ (no separate Like button exists)
5. ✅ Saved and RSVP'd events appear in "My Space" correctly
6. ✅ Creators can edit and delete only their own events
7. ✅ Noticeboard is fully browsable without logging in
8. ✅ Green felt board, pushpins, tilted posters, Montserrat, terracotta — all intact
9. ✅ WCAG AA contrast passes, `prefers-reduced-motion` respected, 44px touch targets met
10. ✅ Hashtag pills show popularity-ranked tags with live count badges
11. ✅ `#Today` and `#Happening Now` auto-appear when relevant — no creator input needed
12. ✅ Multi-tag filtering works — non-matching posters dim, matching ones come forward
13. ✅ Saving/RSVPing an event updates that event's tag engagement scores in Firestore

---

*Open to everyone. Built for campus life.*