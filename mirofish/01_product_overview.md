# FlockIn!! — Product Overview (End-Goal Vision)
*MiroFish seed document — University of Victoria deployment*
*Reflects full Phase 1 + Phase 2 + Phase 3 feature set*

---

## What FlockIn!! Is

FlockIn!! is a campus event discovery and social coordination platform built for university students, launching first at the University of Victoria (UVic) in Victoria, British Columbia, Canada. Its tagline is *"Your Campus Connected."* Its primary job, stated simply in the product spec, is this: **a student should find something worth going to in under 30 seconds.**

The product exists because the information infrastructure of campus life is broken by design. At UVic, as on every university campus, events are promoted through a patchwork of siloed channels — the UVSS Instagram account, dozens of individual club Instagram pages, iMessage group chats, a faculty email newsletter, a physical flyer on the wall of the SUB (Student Union Building), a paper sign taped to the Clearihue building elevator. A student sitting in the McPherson Library between lectures has no single place to look and say: *what's happening on campus right now, this week, that I'd actually care about?*

FlockIn!! is that place. It is a living, digital version of the corkboard in the Student Union Building — the one every student walks past but rarely stops to read. The platform centralizes events, clubs, and campus resources in one application, surfaces them by personal interest, and wraps them in a visual identity that is immediately and distinctly *not* a corporate portal.

The emotional hook is the Noticeboard: when a student opens FlockIn!! for the first time, their reaction should be *"Whoa, this is actually cool"* — not because of the feature set, but because it looks alive. That wow-factor is not a nice-to-have. It is the product.

It's a web-app made for students by students! 
---

## Platform and Access

FlockIn!! is a progressive web application (PWA) accessible from any modern mobile or desktop browser at uvic.flockin.ca (or the equivalent deployment URL). No app download is required — a student can save it to their home screen from Safari or Chrome and it behaves like a native app, including receiving push notifications (Phase 3).

A React Native mobile app for iOS and Android is planned for Phase 3, but the web app is the primary surface for the UVic deployment. The experience is mobile-first: the interface is designed around thumb-reachability, bright outdoor lighting conditions, and the brief windows of attention students have between classes.

But the desktop experience is not an afterthought. The Noticeboard's masonry layout and hover interactions are optimized for desktop browsing, and the full feature set is available on both platforms. The desktop version is ideal for in-depth exploration of events, clubs, and resources, while the mobile version excels at quick discovery and on-the-go engagement.

The backend runs entirely on Firebase (Firestore for the database, Firebase Storage for event images, Firebase Authentication for sign-in, Firebase Cloud Functions for server-side logic). No custom backend server exists — all data logic flows through Firebase services.

---

## The Noticeboard — The Core Experience

The heart of FlockIn!! is the Noticeboard, and it is the first thing every user sees. Rather than a conventional list feed or grid of cards, the Noticeboard renders each event as a poster card arranged on a simulated cork bulletin board. The board has a dark brown wooden frame border, a felt-green textured surface, and individual poster cards that each have a slight randomized rotation (between −3° and +3°, deterministically seeded by the event's Firestore ID so it is stable across re-renders). Cards are attached to the board with colored pushpins — red, yellow, teal — and some cards have washi tape strips across their top corners.

This is not decoration. The corkboard metaphor is load-bearing identity. It evokes the physical experience of walking past the bulletin board in the SUB hallway — a place of serendipitous discovery where something catches your eye. That feeling of genuine discovery, of something you weren't looking for, is exactly what FlockIn!! is trying to digitize.

Poster cards use a masonry layout (no fixed card height; each card's natural aspect ratio is preserved), and each loads with a staggered fade-in animation to make the board feel like it's filling up in real time. On mobile, cards are single-column and full-width. On desktop, the board fills the main content area with a left sidebar navigation.

Each poster card shows the event's cover image. If the organizer didn't upload an image, a fallback gradient is generated deterministically from the event ID — guaranteeing that every poster looks intentional and visual, never blank. The fallback palette includes vivid gradients: warm oranges into purples, deep teals into sky blues, rich greens into gold. No poster card ever looks like a placeholder.

### Hover Overlay and Quick Actions

On desktop, hovering a poster card triggers a smooth lift animation: the card straightens to 0°, scales to 1.04×, and its shadow deepens — it physically "lifts off the board." A semi-transparent dark overlay appears showing the event title, date, time, end time, and three quick-action buttons: Save 🔖 (bookmark), RSVP ✅ (mark as going), and "View Details." On mobile, a tap on the card triggers the same overlay. This design means users can save or RSVP without ever leaving the Noticeboard — the discovery and commitment happen in one gesture.

### What Appears on the Noticeboard

The Noticeboard shows only events that are:
1. **Status: approved** — reviewed and approved by the admin
2. **End time in the future** — events whose end time has not yet passed

This creates a board that is always live, always relevant. Past events vanish automatically without any manual cleanup. Pending and rejected events are invisible to other users. The board is never stale.

---

## The Filter System — Hashtag Pills

Above the Noticeboard, a horizontal scrollable row of pill-shaped filter tags provides instant board filtering. This is the first interactive element a student encounters — it must feel alive and responsive.

**Two system-generated time pills** appear automatically and are always shown first:
- **#HappeningNow** — auto-applied to any event currently in progress (current time is between the event's start and end time). This makes the board feel like a live ticker of what's happening on campus at this exact moment.
- **#Today** — auto-applied to any event happening today. Computed client-side; not stored in Firestore.

**Dynamic trending tag pills** follow, pulled live from Firestore's `tags` collection. Tags are ranked by `engagementScore` — the sum of all saves and RSVPs on active approved events that use that tag. As students engage with events, tag scores shift and the pill bar updates. Only tags associated with future events contribute to scores (expired events stop counting automatically). Up to 8 trending tags are shown. Each pill shows a count badge indicating how many active events carry that tag.

**Category pills** for the nine event categories (Music, Art, Workshop, Social, Sport, Academic, Career, Food, Other) round out the filter bar.

Filters are multi-select and additive. Selecting **#Today** + **Workshop** narrows the board to today's workshops only. Non-matching poster cards fade to 20% opacity and shrink slightly; matching cards remain full opacity and may subtly lift forward. A ✕ "clear all" button appears in the pill row whenever any filter is active. All filtering is real-time with no submit button.

---

## The Full Feature Set (All Phases)

### Event Discovery — Events List

Separate from the Noticeboard, a dedicated Events page at `/events` provides a conventional grid-of-cards view with free-text search and category dropdown filtering. Users can search across event title, organizer name, location, and description. This surface serves users in a deliberate "search for something specific" mode rather than the browse-and-discover mode of the Noticeboard. Both surfaces coexist and serve different attention states.

### Event Creation

Any authenticated user can post an event. The Create Event form features a large inline title input, category selector chips (Music, Art, Workshop, Social, Sport, Academic, Career, Food, Other), a drag-and-drop image upload zone (PNG/JPG/WEBP, max 5MB, optional), and a grouped form card for start time, end time, location, organizer name, free-form tags, and a description. A live poster preview on desktop updates in real time as the user types, showing exactly how the poster will appear on the Noticeboard before submission.

Events are submitted with `status: "pending"` and are invisible to all other users until admin-approved. The creator sees a "Pending review — visible to you only" badge on their event in My Space. Rate limiting prevents more than 3 event submissions per user per day. Editing an event resets it to pending status and re-enters the approval queue. Deleting an event atomically removes all associated RSVPs.

### Event Sharing — Noticeboard Snapshot (Phase 2)

From any event's detail page or from the Noticeboard overlay, a "Share" button generates a visual snapshot of the poster card using html2canvas. This renders the event's poster image (or gradient fallback), title, date, time, and location as a single shareable image in the exact aesthetic of the FlockIn!! Noticeboard — pushpin, slight rotation, wooden frame border and all. The student can save this image to their camera roll or share it directly via the native device share sheet (to Instagram Stories, iMessage, WhatsApp, etc.).

This is a deliberately viral mechanism. When a UVic student shares a FlockIn!! poster card to their Instagram Story, every viewer sees both the event information and the distinctive FlockIn!! visual identity — the corkboard frame is the watermark. Discovery of FlockIn!! through event shares is expected to be one of the top acquisition channels once critical event volume is reached.

### Push Notifications (Phase 3)

FlockIn!! delivers push notifications via the Web Push API (or native push in the React Native app). Notifications are triggered by three specific behaviors:

**Club Subscription Notifications:** When a student subscribes to a club (see below), they receive a push notification whenever that club posts a new event that is approved by the admin. The notification reads: *"[Club Name] just posted: [Event Title] — [Date]"* with a deep link directly to the event. This makes club subscription the most powerful discovery mechanism on the platform — students don't need to remember to check FlockIn!! if their favourite clubs notify them.

**Upcoming Event Reminders:** Users who have RSVPed to an event receive a push notification 24 hours before the event and again 1 hour before. The notification reads: *"Tomorrow: [Event Title] at [Location], [Time]"* or *"Starts in 1 hour: [Event Title]."* This increases actual attendance rates for users who RSVPed in advance and then forgot.

**Expiring Event Pulse (Phase 2):** Events happening the same day appear with a visible "Expiring Soon" pulse animation on their poster card — a subtle heartbeat glow effect indicating the clock is ticking. This creates urgency without resorting to aggressive notifications.

### Club Directory and Club Subscriptions

The Clubs page at `/clubs` is a searchable directory of campus clubs and student organizations. At UVic, this includes organizations like the Victoria Coding Collective, UVic Photography Club, Environmental Society, Philosophy & Debate Society, Culinary Arts Club, Salsa & Ballroom Dance Society, Outdoor Adventures Club, Film & Media Arts Society, Entrepreneurship Hub, UVic Music Collective, Video Games & Esports Club, and Creative Writing Circle — among many others.

Each club has a detail page with name, category, description, member count, contact email, and interest tags. From a club page, a user has two distinct interaction options:

**Join Club** — the user becomes a formal member of the club. This is tracked bidirectionally: the club's `memberIds` array and the user's `joinedClubs` list are updated atomically.

**Subscribe to Club** (Phase 2/3) — distinct from joining, subscription is a lightweight notification opt-in. A subscribed user receives push notifications when the club posts approved events, but is not counted as a formal member. This lowers the social commitment barrier: a student can stay informed about the Photography Club's events without claiming to be a member. The subscription system is what gives push notifications their precision — only content from clubs the student explicitly opted into reaches their notification tray.

A student can be both a member and a subscriber. They can also subscribe without joining if they want event alerts but aren't ready to commit to membership. Clubs can see their subscriber count alongside their member count, giving organizers a signal of how many people are interested in them beyond their formal membership.

### Campus Resources Directory

The Resources page at `/resources` is a directory of campus services, spaces, links, and documents curated for UVic students. Resources include: McPherson Library Study Rooms (with booking link), Campus Counselling Services (same-day appointments), the Career & Co-op Education Centre, UVic Recreation Centre (free for full-time students), the Writing Centre (free one-on-one consultations), UVic IT Help Desk, the MyUVic Student Portal, the Interactive Campus Map, the UVSS Student Society, and the UVic Food Bank.

Resources are of four types: **link** (URL to external service), **document** (downloadable file), **room** (reservable physical space), and **service** (campus support service). Resources are curator-managed, not user-created, ensuring consistent quality. Like events and clubs, resources are tagged with interest categories to enable interest-based discovery. A student who selected "Academic" and "Career" as interests will see study rooms, the writing centre, and career services rise to the top of their resource view.

### Personalized Recommendations

The recommendation engine runs throughout the app. During onboarding, users select at least 3 interests from 24 named categories: Technology, Music, Art, Sports, Gaming, Film, Literature, Science, Business, Politics, Cooking, Travel, Fashion, Photography, Dance, Fitness, Nature, Volunteering, Coding, Career, Academic, Social, Workshop, Food. These interests are stored on the user's profile and updated anytime from the Profile page.

The scoring algorithm is a normalized tag-intersection score: `score = (matching tags) / (total tags on item)`. Items are sorted by this score so higher-relevance content rises to the top. The algorithm applies identically to events, clubs, and resources. A student who selected "Photography" and "Art" sees the UVic Photography Club near the top of the Clubs list, the Life Drawing Session and End of Year Art Exhibition near the top of the Events list, and arts-related resources highlighted.

The Noticeboard itself is not filtered by interests by default — the full board of approved events is always visible — but the trending tag pills reflect the actual tag popularity of the content on the board, so interests and trending content naturally intersect.

### My Space — Personal Dashboard

The Dashboard at `/dashboard` is the personal activity hub for signed-in users. It has three tabs: **My Events** (events the user created, showing approval status badges for Pending, Approved, and Rejected, plus RSVP counts and edit/delete controls), **Saved** (bookmarked events, shown as a card grid with one-tap un-save), and **Going** (RSVPed events with date/time prominently shown and a cancel-RSVP option).

The My Events tab is particularly important for organizers: they can see in real time how many people have RSVPed to their events, the current approval status, and whether any events have been reported. This visibility turns organizers into invested platform participants rather than one-way publishers.

### Admin Queue and Content Moderation

All newly submitted events enter a `status: "pending"` state and appear in the admin's review queue at `/admin`. This route is gated to a single designated administrator (Rahil) identified by Firebase UID. The admin sees all pending events sorted oldest-first, with full event details and two action buttons: Approve ✅ or Reject ❌. Approved events immediately appear on the Noticeboard. Rejected events show a "Not approved" badge to the creator only.

Users can report any event via a `···` context menu — available on both the poster card overlay and the event detail page. Reporting sets a `reported: true` flag that surfaces the event in the admin queue for review. One report does not auto-hide the event — the admin decides. This prevents coordinated mass-reporting abuse.

### Authentication

FlockIn!! uses Google Sign-In as the sole authentication method, accepting any Google account (no `@uvic.ca` restriction). Auth state persists in local storage. Unauthenticated users can browse the Noticeboard, view event details, and browse clubs and resources freely. Any action requiring identity (RSVP, save, create event, join club, subscribe to club) redirects unauthenticated users to the login screen with a return URL, so they land back where they were after signing in.

### Google / Apple Calendar Integration (Phase 3)

From any event the user has RSVPed or saved, a "Add to Calendar" action exports the event as an `.ics` file compatible with Google Calendar, Apple Calendar, and Outlook. The export includes event title, start/end time, location, description, and a link back to the FlockIn!! event detail page. Schedule conflict detection (Phase 3) will warn users at RSVP time if the event overlaps with an event already in their calendar.

### Pinned / Featured Event Slot (Phase 2)

The admin can designate one event as "Featured" — displayed with a gold pushpin (vs. the standard red/yellow/teal) and pinned to the top-left position on the Noticeboard. The featured event is typically the week's highest-profile happening: a major university event, a well-attended annual tradition, or a time-sensitive opportunity. The gold pushpin creates immediate visual hierarchy that draws the eye without disrupting the overall board aesthetic.

---

## The Full User Journey

### The First Visit (Unauthenticated Discovery)

A UVic student encounters FlockIn!! through a shared poster card on someone's Instagram Story — it shows an event in the distinctive FlockIn!! corkboard frame, with a pushpin and slight rotation. They tap the link, land on the Noticeboard, and immediately see 20+ poster cards arranged like a physical bulletin board. The "#HappeningNow" pill shows 2 events currently running. They tap a card for the upcoming Jazz & Blues Night at The Vertigo — a modal opens with full details, date, time, location, and an RSVP button. They tap RSVP. They're redirected to Google Sign-In.

### Signup and Onboarding

Sign-in takes under 10 seconds with a Google account. Immediately after, they're routed to the two-step onboarding: Step 1 asks for a display name. Step 2 shows 24 interest pills in colored families (Music, Art, Film in coral; Food, Cooking, Social in amber; Sports, Fitness, Nature in green; Technology, Coding in indigo; etc.) and asks them to pick at least three. They pick Music, Photography, and Technology. They finish. They land on their Dashboard — they're already Going to Jazz & Blues Night because their RSVP from before the signup was queued.

### Regular Use (Weeks 1–4)

The student checks the Noticeboard two or three times a week — usually between classes or before lunch. They use the filter pills habitually: tapping **#Today** first to see what's happening today, then **Music** or **Photography** for upcoming events in their interests. They save events they want to attend later (Ceramics Open Studio, Photography Basics Walk at Cadboro Bay) and RSVP to confirmed plans (Jazz & Blues Night, Intro to Machine Learning workshop). Their Saved and Going tabs in My Space fill up. Push reminders fire 24 hours and 1 hour before each event they RSVPed.

### Club Discovery and Subscription

Browsing the Clubs page, the student finds the UVic Photography Club. They subscribe (not join yet — they want to see an event first). Three days later, they get a push notification: *"UVic Photography Club just posted: Night Photography Walk — this Friday at 8pm."* They open FlockIn!!, RSVP, and attend. At the event they enjoy themselves, meet the club organizer, and join as a member. The subscription-to-membership funnel has converted.

### Becoming an Organizer

By Week 6, the student's friend asks if they can post their small film screening to FlockIn!!. The student, now familiar with the platform, fills out the Create Event form, uploads a poster image they designed, tags it with #Film #Photography #Art. The form shows a live preview of how the poster will look on the Noticeboard. They submit. The event enters pending review — they see "Pending review — visible to you only" on their Dashboard. The admin approves it within a few hours. The poster appears on the Noticeboard. Within two days, 18 people have RSVPed — several of them strangers the student has never met. They've become an organizer.

### Sharing and Viral Spread

After the film screening, the organizer taps the Share button on the event detail page. FlockIn!! generates a shareable image: their poster card in the corkboard frame, with the FlockIn!! wordmark visible at the corner. They post it to their Instagram Story. Three of their followers tap the link, land on FlockIn!!, and sign up. The corkboard aesthetic is the watermark. The share is the acquisition.

---

## What Makes FlockIn!! Different at UVic Specifically

UVic has no Greek system — the fraternities and sororities that dominate American campus social dynamics simply don't exist at Canadian universities. This means the campus social ecosystem is more distributed and arguably healthier: events aren't gated behind chapter membership, and every student organization competes equally for attention. The SUB (Student Union Building), its basement venue The Vertigo, and The Grad House Pub are the equivalent social anchors that Greek row would be at an American school.

UVic's strong co-op culture means a large percentage of students spend alternating semesters in full-time work terms across Canada and internationally. This creates a semi-transient user base — students may be on or off campus in any given semester — and makes event discovery especially valuable at the start of each new school term when returning co-op students need to re-plug into campus life.

Victoria itself — a small city of roughly 400,000 people on Vancouver Island, with mild Pacific weather, accessible ocean and forest — shapes the event culture. Outdoor events (5K runs through Garry oak meadows, photography walks to Cadboro Bay, farmers markets on Ring Road) are common and well-attended. The city's cycling culture bleeds into campus life. The Outdoor Adventures Club takes students kayaking and hiking on Vancouver Island regularly.

UVic also has a strong international student presence and a prominent Indigenous student community (the university sits on unceded WSÁNEĆ and Lekwungen territory, acknowledged formally in all official communications). Cultural events — Diwali, Lunar New Year, and Indigenous cultural gatherings — are significant in the campus calendar and represent a discovery segment that is currently poorly served by existing channels.

All of this specificity is baked into FlockIn!!'s launch dataset: 22 real UVic events across all categories at real campus locations — The Vertigo, Phillip T. Young Recital Hall, ECS 108, the Visual Arts Building ceramics studio, Centennial Stadium Fields, the Grad House Pub. The platform doesn't feel like a generic tool dropped onto campus. It feels like it was built here.
