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
- Displayed above the board in a horizontal scrollable row
- Clicking a tag filters the noticeboard in real-time
- Tags are set by the event creator (optional field)
- Default shown: `#Tonight` `#ThisWeek` `#Free` + popular tags from live events

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

- **Firebase Auth with Google Sign-In only**
- **Any Google account accepted** — no `@uvic.ca` restriction
- Unauthenticated users can browse and view the noticeboard freely (read-only)
- To post, RSVP, or save — user must be signed in; prompt login if they attempt while logged out
- Show user's display name and Google avatar in the nav when signed in

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

### Firestore Security Rules
```
- Unauthenticated users: READ events only
- Authenticated users: READ all events, CREATE events, UPDATE savedBy/savedCount/rsvpBy/rsvpCount on any event
- Event owner (auth.uid === creatorId): UPDATE and DELETE their own events only
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

## Phase Boundaries — Do Not Build These in MVP

> If you find yourself implementing any of the following, stop.

| Feature | Phase |
|---|---|
| Emoji / GIF / comment reactions | Phase 2 |
| Social proof ("X students going") | Phase 2 |
| Club directory and club pages | Phase 2 |
| Event search and advanced filtering | Phase 2 |
| Campus resources directory | Phase 2 |
| Google / Apple Calendar integration | Phase 3 |
| Schedule conflict detection | Phase 3 |
| Push or email notifications | Phase 3 |
| Mobile app (React Native) | Phase 3 |

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

## MVP Done When

1. ✅ Anyone signs in with any Google account
2. ✅ Any signed-in user posts an event with an image
3. ✅ Poster appears on the noticeboard with pushpin and tilt — matching existing aesthetic
4. ✅ Any signed-in user can Save 🔖 or RSVP ✅ (no separate Like button exists)
5. ✅ Saved and RSVP'd events appear in "My Space" correctly
6. ✅ Creators can edit and delete only their own events
7. ✅ Noticeboard is fully browsable without logging in
8. ✅ Green felt board, pushpins, tilted posters, Montserrat, terracotta — all intact
9. ✅ WCAG AA contrast passes, `prefers-reduced-motion` respected, 44px touch targets met

---

*Open to everyone. Built for campus life.*