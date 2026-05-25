# FlockIn — Product Overview
*Seed document for MiroFish simulation engine*

---

## What FlockIn Is

FlockIn is a campus event discovery and social coordination platform built for university students. Its central purpose is to solve a problem endemic to every college campus: events happen constantly, but information about them is fragmented across Instagram stories, GroupMe chats, flyers on physical bulletin boards, and word of mouth. Students miss things they would have loved. Organizers post to a void and get disappointing turnout. FlockIn attempts to be the single, living digital noticeboard that replaces all of that — a place where the entire campus social and academic calendar is discoverable in one feed, personalized to what each individual student actually cares about.

The platform lives as a web application optimized for mobile browsers, meaning students access it on their phones without needing to download an app. It is built on top of Google Firebase for authentication and real-time data, making the experience feel fast and reactive. At its core, FlockIn is a discovery engine wrapped in an intentionally playful visual aesthetic — one designed to evoke the feeling of walking past a physical corkboard in a campus hallway and having something catch your eye.

---

## Core Features in Detail

### The Noticeboard

The heart of FlockIn is called the Noticeboard, and it is the first thing a user sees when they open the app. Rather than a conventional list or grid feed, the Noticeboard renders events as poster cards arranged on a simulated cork bulletin board — complete with a dark brown border, a textured board surface, and individual poster cards that each have a slight seeded rotation, pushpin decorations, or washi tape strips holding them in place. Cards are staggered vertically using a masonry-style layout, and each one loads with a staggered fade-in animation. The visual effect is immediate and distinctive: it looks like walking past the bulletin board outside a student union, except it is digital, real-time, and personalized.

Each poster card on the Noticeboard shows the event's cover image (or a generated gradient if none was uploaded), the event title, date, location, and an RSVP count. Cards have contextual action buttons that change label based on category — a Workshop event shows "Sign Up," a Career event shows "Register," a Music event shows "RSVP," a Social event shows "Join Us." Clicking a card opens an in-place modal overlay with full event details, allowing users to RSVP or save the event without navigating away from the board. Users can also report events from this modal.

The Noticeboard only shows approved events that have not yet ended — it is a real-time display of what is coming up on campus right now and in the near future. Events are sorted chronologically so the soonest upcoming events appear first.

### The Filter System

Above the Noticeboard, a horizontal scrolling row of pill-shaped filter tags lets users slice the event feed in multiple ways simultaneously. The filter system has three layers. First, there are four pinned time filters: "happening-now" (events whose start and end time bracket the current moment), "today" (events starting today), "this-week" (events starting within 7 days), and "next-week" (events starting 7–14 days out). Second, there are nine category filters corresponding to the nine event categories in the system: Music, Art, Workshop, Social, Sport, Academic, Career, Food, and Other. Third, there are trending tag filters pulled live from Firestore — these represent the most-used custom tags across all events, shown as colorful pills with usage count badges. A "More" overflow button opens a popover with a searchable list of all tags for power users who want to filter by niche topics.

Filters are additive — selecting multiple filters narrows results to events that match all selected criteria. When filters are active, non-matching poster cards fade out and shrink slightly while matching cards pop forward with a subtle scale and lift animation, making the visual hierarchy of the board instantly clear.

### Event Discovery (Trending Events)

Separate from the Noticeboard, there is a dedicated Events page at `/events` that renders events as a conventional grid of cards, supports free-text search across event title, organizer name, location, and description, and allows category-based dropdown filtering. This page shows all upcoming approved events (up to 100) and is better suited for users who want to search for something specific or browse methodically rather than browse by feel. The two discovery surfaces — the Noticeboard and the Events list — serve different mental models and different user moods.

### The Recommendation Engine

When a user completes onboarding and selects their interests, FlockIn's recommendation layer activates. The system maintains 24 named interest categories: Technology, Music, Art, Sports, Gaming, Film, Literature, Science, Business, Politics, Cooking, Travel, Fashion, Photography, Dance, Fitness, Nature, Volunteering, Coding, Career, Academic, Social, Workshop, and Food. Each event, club, and campus resource can be tagged with any subset of these interests (stored as lowercase strings).

The recommendation algorithm scores each item by computing the ratio of the user's interests that match the item's tags, normalized to a 0–1 scale. Items are sorted by this score so that a student who marked "Music" and "Art" as interests will see music and art events rising to the top of their view. This same logic is used across events, clubs, and resources, creating a consistent personalization layer throughout the app. The algorithm is deliberately simple — tag intersection scoring rather than collaborative filtering — which means it works well at small scale without needing historical behavior data, appropriate for a new campus deployment.

### Event Creation

Any authenticated user can create and post an event to the Noticeboard. The Create Event screen is designed to be expressive while remaining structured. It features a large free-text title input at the top (styled like a big, bold headline), followed by category selector chips (one category must be selected), an optional image upload zone (drag-and-drop or click, max 5 MB, supports PNG/JPG/WEBP), and a grouped form card containing start time, end time, location, organizer name, free-form tags, and a description textarea.

Critically, the desktop layout shows a live poster preview alongside the form that updates in real-time as the user types — users can see exactly how their event poster will look on the Noticeboard before submitting. This feature reinforces the poster metaphor and encourages organizers to think visually about their events.

When submitted, the event is created with a `status: "pending"` flag and is invisible to all other users until an admin approves it. The submitting user can see their pending event in their Dashboard, where it shows a "Pending review" status badge. This moderation layer is what keeps the Noticeboard high-quality and prevents spam. A rate limit of 3 events per day per user provides additional protection.

Tags entered during event creation are automatically incremented in a global tag frequency counter, which powers the trending tag pills on the Noticeboard. This creates a flywheel: popular events with popular tags make those tags trend, which makes them easier to filter for, which drives more RSVPs to those events.

### Event Detail Page

Each event has a full detail page reachable from the Noticeboard modal or directly via URL at `/events/:id`. The detail page shows the event poster image (or a deterministically generated gradient fallback), event title, category badge, full date and time range, location, the organizer's avatar and name, a full description, and all associated tags. The primary action button on this page is the RSVP button, labeled "I'm going! 🎉" when the user has not yet RSVPed or "✓ You're going" when they have. The RSVP action is atomic — it simultaneously adds the user to the event's attendee list and adds the event to the user's joined-events list in a single Firestore transaction, preventing double-counting.

Users can also bookmark/favorite events from the detail page, and organizers see edit and delete controls that regular attendees do not. The delete action includes a confirmation dialog that warns the organizer that all attendees will be removed. On mobile, the RSVP and action buttons appear in a fixed sticky bar at the bottom of the screen so they are always reachable without scrolling.

### Clubs

FlockIn includes a directory of campus clubs and student organizations at `/clubs`. Each club has a name, description, category, member count, logo, contact email, and tags. Users can browse and search clubs, view individual club pages, and join or leave clubs. Joining a club is tracked bidirectionally — the club's member list grows and the user's joined-clubs list grows simultaneously in a transaction. Users can also bookmark clubs they're interested in but not ready to commit to joining.

Clubs are not currently user-created (there is no club creation form in the codebase) — they are seeded into Firestore by administrators. This makes clubs a more curated, stable layer compared to events, which anyone can post.

### Campus Resources

FlockIn includes a campus resources directory at `/resources`. Resources can be of four types: links (URLs to external services), documents (downloadable materials), rooms (reservable campus spaces), and services (campus support services). Each resource has a title, description, type, optional URL, optional location, and tags. Resources are browsable and searchable, and clicking one opens a detail page. Like clubs, resources are curator-managed rather than user-generated.

The resources feature is particularly interesting from a behavioral simulation standpoint: it represents the non-social, utilitarian side of FlockIn's value proposition — a student who has never been to a single campus event might still find value in knowing where to book a study room or access mental health support.

### User Profiles and Onboarding

Every new user goes through a mandatory two-step onboarding process. Step one captures the user's display name. Step two presents the full palette of 24 interest categories as colorful pill-shaped toggle buttons, and the user must select at least three before they can proceed. This onboarding gate is enforced by a `onboardingComplete` flag on the user's Firestore profile — the app routes new users to onboarding before they can reach the dashboard.

After onboarding, users have a profile page where they can update their display name, write a bio (up to 200 characters), and toggle their interest selections at any time. The profile page also shows aggregate stats: how many events they have saved and how many they are attending. Interests are grouped visually by color family — arts and creative interests in coral, food and social interests in amber, physical and outdoor interests in green, creative digital interests in purple, technical interests in indigo, and professional interests in terracotta.

### The Dashboard ("My Space")

The Dashboard is a user's personal activity hub, reachable at `/dashboard`. It has three tabs. "My Events" shows all events the current user has created, each displayed as a compact row with a thumbnail, status badge (Approved, Pending review, or Not approved), RSVP count, date, and an Edit button. "Saved" shows a grid of events the user has bookmarked. "Going" shows a grid of events the user has RSVPed to attend. The page header includes a prominent "Post an Event" button that shortcuts directly to the Create Event form.

### The Admin Queue

FlockIn has a single designated administrator, identified by a specific Firebase user ID set in an environment variable. The admin accesses a queue at `/admin` that shows all pending events sorted oldest-first. Each pending event displays its title, creator name, category, date/time, tags, and a truncated description, along with "Approve" and "Reject" buttons. Approving moves the event to `status: "approved"` (making it visible on the Noticeboard), and rejecting moves it to `status: "rejected"`. Both actions trigger optimistic UI updates so the admin queue updates instantly. The admin has no other special powers visible in the current implementation — no user management, no club or resource creation UI.

### Authentication

FlockIn uses Google Sign-In as the sole authentication method. When a user signs in for the first time, a Firestore profile document is automatically created. The app persists auth state in local storage (browserLocalPersistence) so users stay logged in across sessions. Unauthenticated users can browse the Noticeboard, view event details, and browse clubs and resources, but any action requiring state (RSVP, save, report, create event) redirects them to the login page with a return-to URL.

---

## The Full User Journey

A student's first encounter with FlockIn likely happens through a friend's share or a campus announcement. They land on the Noticeboard and see the visual bulletin board — immediately different from any app they've used before. They can browse events, click to open a modal and read details, all without signing in. The curiosity hook is visual and immediate.

When the student decides to RSVP to something, they're redirected to login. They tap "Sign in with Google," which completes in a few seconds using their university Google account. If it's their first time, they're taken to onboarding: they type their name, then pick their interests from the colorful pill grid. With interests selected and saved, they land on the Dashboard.

From this point, the student becomes an active user. They return to the Noticeboard, which now feels more relevant because filter pills for their interest categories are available. They browse, save some events to look at later, and RSVP to one or two. They check out the Clubs page and join a club they recognize from campus. They might check Resources and bookmark a study room booking link.

After a few weeks, a student who runs a club or event series discovers the "Post an Event" button. They fill out the create form, upload a poster image, and submit. They see their event listed on their Dashboard with a "Pending review" badge, then get the satisfaction of seeing it appear on the Noticeboard after admin approval. They tell their club members to find it on FlockIn.

This organizer behavior is the critical loop: students who create events bring their entire audience with them to the platform, growing the user base organically. Each new event is a reason for new people to sign up.

---

## Platform Details

FlockIn is a progressive web application (React + Vite + TypeScript) that runs in any modern mobile or desktop browser. There is no native iOS or Android app — the web app is designed to be mobile-first, with a bottom tab bar navigation visible only on mobile screens and a left sidebar navigation visible on desktop screens. The visual design uses Tailwind CSS with a custom design token system using OKLCH color notation for perceptually uniform palette generation.

The backend is entirely Firebase: Firestore for the database (NoSQL document store), Firebase Authentication for sign-in, and Firebase Storage for event poster image uploads. The frontend uses TanStack Query (React Query) for all data fetching, caching, and optimistic updates. Real-time sync is not used — data is fetched on demand and invalidated when mutations occur.

---

## Unique and Differentiating Aspects

The most distinctive aspect of FlockIn is the Noticeboard metaphor. Where other event platforms (Eventbrite, Facebook Events, even campus portals) use conventional list or grid views, FlockIn's corkboard aesthetic is immediately memorable and creates a strong association with the physical experience of campus discovery. The slight card rotations, pushpins, and washi tape decorations are not just decorative — they create the sensation of browsing, of something catching your eye, of a serendipitous discovery rather than a deliberate search.

The content moderation model — where all events go through admin review before going live — is a deliberate choice to maintain signal-to-noise quality. On platforms where anyone can post freely, quality degrades quickly and users stop trusting the feed. FlockIn treats the Noticeboard like a curated physical board, not an open social feed.

The seamless dual-role design, where the same platform serves both event attendees and event organizers without requiring separate products or dashboards, lowers the barrier for organizers to adopt the platform. A student can RSVP to five events on Monday and post their own event on Tuesday from the same app.
