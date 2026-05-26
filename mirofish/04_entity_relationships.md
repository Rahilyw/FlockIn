# FlockIn!! — Entity Relationships & Knowledge Graph
*MiroFish seed document — University of Victoria deployment*
*Reflects full Phase 1 + Phase 2 + Phase 3 feature set*

---

## Overview

This document describes all meaningful entities in the FlockIn!! world at the University of Victoria and the relationships between them. The goal is to give MiroFish sufficient structured information to construct a knowledge graph that accurately models the people, places, events, organizations, campus infrastructure, concepts, and behavioral dynamics that constitute UVic campus social life as mediated by FlockIn!!.

Every entity and relationship described here is either directly encoded in the product's data model, present in the seeded campus data, or emerges from the documented social dynamics of UVic's specific campus context.

---

## People Entities

### User (Base Entity)

A User is any person who has created a FlockIn!! account. A User has a unique system-generated identifier (uid), a display name, an email address (from Google Sign-In, any domain accepted), an optional profile photo (Google avatar), a bio of up to 200 characters, and a curated list of interests from the 24 named categories. A User maintains six activity lists: joined events (RSVPed), saved events (bookmarked), joined clubs (formal member), saved clubs (bookmarked without joining), subscribed clubs (notification opt-in), and upcoming reminders (events the user will be notified about). The `onboardingComplete` flag gates access to the full app experience.

**User → SELECTS → Interest** (many-to-many, updated any time via Profile page)  
**User → RSVPS_TO → Event** (many-to-many, atomically tracked bidirectionally)  
**User → SAVES → Event** (many-to-many, creates bookmark without commitment)  
**User → JOINS → Club** (many-to-many, atomic member list update)  
**User → SAVES → Club** (many-to-many, lightweight bookmark)  
**User → SUBSCRIBES_TO → Club** (many-to-many, triggers push notifications when club posts events)  
**User → CREATES → Event** (one-to-many, makes user the Organizer)  
**User → REPORTS → Event** (many-to-one flag, sets reported: true)  
**User → SHARES → Event** (generates snapshot image, distributes externally)  
**User → EXPORTS → Event** (calendar export to iCal/Google Calendar)  
**User → RECEIVES → PushNotification** (triggered by subscriptions and RSVPs)

### Organizer (Behavioral Role)

An Organizer is any User who has created at least one event. Not a separate account type — any User becomes an Organizer by posting. An Organizer IS SOLELY RESPONSIBLE for the events they create: only they can edit, delete, or see the approval status. An Organizer SEES their event's RSVP count in real time from My Space. An Organizer SUBMITS events that enter the pending queue. An Organizer RECEIVES admin decisions (approved/rejected) as status changes visible in their Dashboard.

Real UVic examples of the Organizer role: the events coordinator of the Victoria Coding Collective, a UVSS Arts & Events committee member, a member of the UVic Photography Club, a Graduate Students Society officer.

### Admin (Role)

The Admin is a single User whose Firebase UID matches the environment variable VITE_ADMIN_UID. The Admin REVIEWS all pending events in the Admin Queue at `/admin`. The Admin APPROVES or REJECTS pending events. The Admin DESIGNATES one event at a time as Featured (gold pushpin, top-left Noticeboard position). The Admin RESPONDS TO reported events by reviewing and potentially rejecting them. The Admin has no other elevated capabilities in the current implementation.

### Attendee (Role)

An Attendee is a User who has RSVPed to an event. Attendance is tracked atomically in both the event's `rsvpBy` array and the user's `joinedEvents` list. An Attendee RECEIVES a 24-hour reminder push notification before their event and a 1-hour reminder push notification. An Attendee CAN CANCEL their RSVP (leaveEvent), which atomically reverses both references. An Attendee CAN EXPORT the event to their calendar.

### Club Subscriber (Role)

A Club Subscriber is a User who has opted into push notifications from a specific club without necessarily being a formal member. The Subscriber RECEIVES push notifications when the subscribed club posts an event that is approved. The Subscriber IS DISTINCT FROM a club member — subscription is a lightweight, notification-only relationship. A User CAN BE both a member and a subscriber of the same club. A User CAN BE a subscriber without being a member (the typical discovery-first path).

### Lurker (Behavioral Pattern)

A Lurker is a User who browses the Noticeboard, saves events, and views details without RSVPing or creating events. Lurkers contribute to `savedCount` on events but not `rsvpCount`. Their behavior is visible in the platform's save-to-RSVP ratio analytics. Lurkers represent latent intent — their saves are the platform's best signal of which events have more genuine interest than the RSVP count alone reveals.

### Ghost (Behavioral Pattern)

A Ghost is a User who signed up, completed or partially completed onboarding, and then stopped opening the app. Ghosts are the platform's primary retention problem. A Ghost who subscribed to at least one club is reactivatable via push notification without any additional acquisition cost. A Ghost who subscribed to zero clubs and has no event reminders scheduled is only reactivatable by an external trigger (a friend's mention, an Instagram Story share).

---

## Event Entities

### Event

An Event is the primary content unit. Every Event has: a system-generated ID, title (max 80 characters), description (max 500 characters), start date/time, end date/time (required — used for board expiry and #HappeningNow), location string, one category, the creator's UID and display name, an optional poster image (Firebase Storage URL + path), an array of free-form tags, and a moderation status (pending / approved / rejected). Events also carry: `rsvpCount`, `rsvpBy[]`, `savedCount`, `savedBy[]`, `reported` (boolean), `createdAt`, and `updatedAt`.

Events are only visible on the public Noticeboard when `status === "approved"` AND `endTime >= now()`. Past events remain in Firestore and are accessible in the creator's My Events tab but are invisible to other users.

**Event → HAS_CATEGORY → Category** (many-to-one)  
**Event → HAS_TAG → Tag** (many-to-many)  
**Event → OCCURS_AT → Location** (many-to-one, string-referenced)  
**Event → CREATED_BY → User** (many-to-one, creator/organizer)  
**Event → RSVPED_BY → User[]** (many-to-many, bidirectional)  
**Event → SAVED_BY → User[]** (many-to-many, bidirectional)  
**Event → MODERATED_BY → Admin** (approval/rejection decision)  
**Event → POSTED_BY → StudentOrganization** (organizational authorship, implicit via creatorName)  
**Event → NOTIFIES → ClubSubscriber** (when approved event is from a subscribed club)

Real UVic examples: Jazz & Blues Night at The Vertigo, Battle of the Bands at MacLaurin B-Wing Courtyard, End of Year Art Exhibition at University Centre, Intro to Machine Learning at ECS 108, 5K Fun Run starting at the Recreation Centre, UVic Farmers Market on Ring Road.

### Event Category

A Category is one of nine fixed classifications: Music, Art, Workshop, Social, Sport, Academic, Career, Food, Other. Each category has an associated action label on the Noticeboard poster card overlay (Workshop → "Sign Up," Career → "Register," Sport → "Join," Academic → "Learn More," Music/Art → "RSVP," Social → "Join Us," Food → "Attend"). Categories determine the color palette of filter pills and event detail badges. Categories are fixed — not user-created.

**Category → APPLIES_TO → Event** (one category per event)  
**Category → IS_FILTERABLE_ON → Noticeboard** (via category filter pills)

### Event Tag

A Tag is a free-form lowercase text label used on one or more events. Each tag document in Firestore tracks: `name`, `eventCount` (active approved events using this tag), `engagementScore` (sum of saves + RSVPs on events with this tag), and `lastUsed`. Tag documents are maintained by Firebase Cloud Functions — not the client — ensuring consistency. The tag system drives the trending pill bar.

**Tag → APPEARS_ON → Event** (many-to-many)  
**Tag → SCORE_DERIVES_FROM → Engagement** (saves and RSVPs on tagged events)  
**Tag → RANKED_BY → engagementScore** (determines trending pill order)  
**Tag → OVERLAPS_SEMANTICALLY_WITH → Interest** (matching drives recommendations)  
**Tag → DISPLAYED_AS → FilterPill** (on Noticeboard, up to 8 trending)

Real UVic tags from seed data: Music, Social, Art, Photography, Academic, Workshop, Technology, Coding, Science, Career, Business, Nature, Food, Cooking, Volunteering, Sports, Fitness, Politics, Gaming, Literature, Dance.

### Push Notification

A Push Notification is a message delivered to a User's device outside the app. Notification types:

- **Club event notification:** Sent to all subscribers of a club when that club's event is approved. Contains club name, event title, date, and a deep link to the event.
- **RSVP reminder — 24 hours:** Sent to all Users in `event.rsvpBy[]` 24 hours before the event's start time.
- **RSVP reminder — 1 hour:** Sent to all Users in `event.rsvpBy[]` 1 hour before the event.

**PushNotification → DELIVERED_TO → User** (one user per notification instance)  
**PushNotification → TRIGGERED_BY → ClubEvent OR RSVPReminder**  
**PushNotification → LINKS_TO → Event** (deep link to event detail)  
**PushNotification → MAY_CAUSE → RSVP** (conversion action)  
**PushNotification → MAY_CAUSE → AppOpen** (re-engagement of dormant users)

### Noticeboard Snapshot Share

A Snapshot Share is a visual image generated from a FlockIn!! event using html2canvas. The image shows the poster card (event image or gradient, title, date, time, location) in the corkboard aesthetic (wooden frame, pushpin, slight rotation). The FlockIn!! wordmark is visible. The image is shared via the device native share sheet to Instagram Stories, iMessage, WhatsApp, or saved to camera roll.

**Snapshot → GENERATED_FROM → Event**  
**Snapshot → SHARED_TO → ExternalPlatform** (Instagram, iMessage, WhatsApp)  
**Snapshot → CREATES → ExternalImpression** (views by non-FlockIn!! users)  
**Snapshot → MAY_CAUSE → NewUserSignup** (viewer taps link and signs up)  
**Snapshot → CARRIES → FlockInBranding** (corkboard frame as visual watermark)

---

## Club Entities

### Club

A Club represents a campus organization in FlockIn!!'s database. Clubs are curator-managed (not user-created), representing a stable, verified layer of campus organizations. Each club has: ID, name, description, category, `memberCount`, `memberIds[]`, `subscriberCount`, `subscriberIds[]`, logo URL, contact email, and tags.

**Club → HAS_MEMBER → User** (many-to-many, formal membership)  
**Club → HAS_SUBSCRIBER → User** (many-to-many, notification opt-in only)  
**Club → HAS_CATEGORY → Category**  
**Club → HAS_TAG → Tag** (drives interest-based recommendations)  
**Club → POSTS_EVENTS → Event** (organizational authorship via creatorName)  
**Club → TRIGGERS_NOTIFICATIONS → ClubSubscriber** (on approved event)

Real UVic clubs in the seed dataset: Victoria Coding Collective (Technology), UVic Photography Club (Art), Environmental Society (Nature), Philosophy & Debate Society (Academic), Culinary Arts Club (Food), Salsa & Ballroom Dance Society (Dance), Outdoor Adventures Club (Sports), Film & Media Arts Society (Film), Entrepreneurship Hub (Business), UVic Music Collective (Music), Video Games & Esports Club (Gaming), Creative Writing Circle (Literature).

---

## Resource Entities

### Campus Resource

A Campus Resource is a curated entry in the UVic services directory. Resources are of four types: link, document, room, or service. Each has: ID, title, description, type, optional URL, optional physical location, and interest tags.

**Resource → HAS_TAG → Interest** (drives interest-based surfacing)  
**Resource → HAS_TYPE → ResourceType** (link / document / room / service)  
**Resource → LOCATED_AT → CampusLocation** (optional, for rooms and services)

Real UVic resources in the seed dataset: McPherson Library Study Rooms (room), Campus Counselling Services (service), Career & Co-op Education Centre (service), UVic Recreation Centre (service), Writing Centre (service), UVic IT Help Desk (service), MyUVic Student Portal (link), Interactive Campus Map (link), UVSS Student Society (link), UVic Food Bank (service).

---

## Place Entities

UVic's physical campus creates a rich spatial layer that shapes event attendance patterns, archetype behavior, and community formation. Places are implicit in the event `location` field but carry important social meaning.

### The SUB — Student Union Building (Ring Road)

The SUB is the social nucleus of UVic. It houses The Vertigo (basement live music and events venue), the main concourse (club tables, UVSS services, casual meeting space), The Grad House Pub (north side, graduate student social anchor), the UVSS offices, club meeting rooms, and the UVic Food Bank. Almost every social event on campus has a connection to the SUB — it's where you promote events, where you meet friends between classes, and where the campus community literally gathers.

**SUB → CONTAINS → TheVertigo** (live music/events venue)  
**SUB → CONTAINS → GradHousePub** (graduate student social space)  
**SUB → CONTAINS → ClubMeetingRooms** (formal club activity space)  
**SUB → IS_DESTINATION_FOR → SocialArchetypes** (The Club Crawler, The Enthusiastic Connector)

### The Vertigo (SUB Lower Level)

The Vertigo is UVic's primary on-campus live music and events venue. Capacity of approximately 200–300. Hosts jazz nights, open mic nights, Battle of the Bands, comedy nights, and UVSS-organized social events. An event location of "The Vertigo (SUB Lower Level)" carries strong cultural cachet — it signals a well-organized, experiential event.

**Vertigo → HOSTS → MusicEvents** (high-attendance Music and Social category events)  
**Vertigo → ASSOCIATED_WITH → UVSS** (organizationally)  
**Vertigo → SIGNALS → EventQuality** (a Vertigo location implies legitimacy)

### The Grad House Pub

The Grad House is UVic's on-campus pub, primarily frequented by graduate students and upper-year undergraduates. Campus Trivia Night (Graduate Students Society) is a signature recurring event here. More relaxed and adult-feeling than the SUB main space.

**GradHousePub → ASSOCIATED_WITH → GradStudents**  
**GradHousePub → HOSTS → SocialAndAcademicEvents**

### McPherson Library

The academic heart of campus. Study rooms bookable up to 7 days in advance. The Writing Centre and IT Help Desk are located here. Academic events (Study Skills Bootcamp, department-organized workshops) happen in library event spaces.

**McPhersonLibrary → CONTAINS → StudyRooms** (bookable resource)  
**McPhersonLibrary → CONTAINS → WritingCentre** (service resource)  
**McPhersonLibrary → HOSTS → AcademicEvents**

### Engineering & Computer Science Building (ECS)

The home of UVic's Computer Science and Engineering faculties. ECS 108 and ECS 104 are the primary large classrooms used for tech events. The Intro to Machine Learning workshop and the Tech Recruiting Panel are both held here. The building has a distinct community feel — students in CS and Engineering spend significant time here and treat it as a social as well as academic space.

**ECS → ASSOCIATED_WITH → TechAndCodingCommunity**  
**ECS → HOSTS → WorkshopAndCareerEvents**  
**ECS → ATTRACTS → QuietObserverAndCareerFocusedArchetypes**

### Visual Arts Building

Home of UVic's Fine Arts department, ceramics studios, sculpture workshops, and gallery spaces. Life Drawing Sessions and Ceramics Open Studios happen here. The building has a physical aesthetic that resonates with FlockIn!!'s poster/board metaphor — students in Fine Arts are surrounded by physical bulletin boards, show posters, and flyers.

**VisualArtsBuilding → HOSTS → ArtEvents**  
**VisualArtsBuilding → ASSOCIATED_WITH → ArtsAndCreativeCommunity**

### Cadboro Bay / Campus Perimeter

Cadboro Bay Beach is a 15-minute walk from the center of campus, used for outdoor workshops, photography walks, and social events. The Garry oak meadows on campus perimeter are used for runs and outdoor events. Victoria's proximity to nature is a defining campus characteristic — many events take the campus outside its buildings.

**CadboroBay → ASSOCIATED_WITH → OutdoorAndWellnessArchetype**  
**CadboroBay → HOSTS → PhotographyAndOutdoorEvents**

### Centennial Stadium / Campus Recreation (McKinnon Building)

The primary athletic facilities. Intramural flag football, the 5K Fun Run (starting point), and sports-adjacent social events happen here or in proximity. The UVic Recreation Centre is free for full-time students.

**CentennialStadium → HOSTS → SportEvents**  
**McKinnonBuilding → CONTAINS → RecreationCentre** (free for students)

### Ring Road and Outdoor Campus Spaces

Ring Road is the perimeter road around campus. The weekly UVic Farmers Market happens on Ring Road outside the SUB every Tuesday. Campus community gardens are a social outdoor space. These outdoor locations create a distinct event type — casual, drop-in, weather-dependent.

**RingRoad → HOSTS → OutdoorFoodAndSocialEvents** (Farmers Market)  
**RingRoad → ASSOCIATED_WITH → WeeklyRhythm** (recurring Tuesday market)

---

## Organization Entities

### UVSS (UVic Students' Society)

The UVSS is the primary student government body at UVic. It funds registered clubs, runs The Vertigo and the Grad House, organizes campus-wide social events, and operates the UVSS website and social media channels (8,000+ Instagram followers). An endorsement from the UVSS Instagram account is the highest-reach single-channel promotion available on campus.

**UVSS → OPERATES → TheVertigo**  
**UVSS → OPERATES → GradHousePub**  
**UVSS → FUNDS → RegisteredStudentOrganizations**  
**UVSS → HAS_REACH → AllUVicStudents**  
**UVSS → CAN_AMPLIFY → FlockInAdoption** (through Instagram and official channels)

### Victoria Coding Collective

One of UVic's most active technology clubs. Weekly hack nights in ECS 108, coding challenges, and project showcases. Run by students in Computer Science and Software Engineering. Has an active Discord server. Its membership includes some of the most technically sophisticated students on campus — early adopters of new digital tools.

**VictoriaCodingCollective → HOSTS → TechWorkshopEvents**  
**VictoriaCodingCollective → HAS_COMMUNITY → TechStudents**  
**VictoriaCodingCollective → ASSOCIATED_WITH → ECSBuilding**  
**VictoriaCodingCollective → ATTRACTS → QuietObserverAndCareerFocusedArchetypes**

### UVic Photography Club

Known for monthly photo walks (including to Cadboro Bay), editing workshops, and a warm community across skill levels. Produces high-quality visual content — their FlockIn!! events will have the best poster images of any club on the platform, creating disproportionate engagement from the visual quality of their cards.

**UVicPhotographyClub → PRODUCES → HighQualityEventPosters**  
**UVicPhotographyClub → HOSTS → OutdoorAndArtEvents**  
**UVicPhotographyClub → ATTRACTS → ArtsAndCreativeArchetype**

### Environmental Society

Focuses on campus sustainability activism and community action. Hosts events resonating with The Outdoor and Wellness-Focused Student and The Wellness/Activist archetype. The Sustainable Living on Campus workshop and campus clean-ups are their signature events.

**EnvironmentalSociety → HOSTS → WorkshopAndVolunteerEvents**  
**EnvironmentalSociety → ASSOCIATED_WITH → SustainabilityValues**

### Entrepreneurship Hub

Supports student ventures with pitch nights, startup workshops, and mentorship connections into Victoria's tech scene. Hosts the Tech Recruiting Panel. Attracts The Career-Focused Pre-Professional and The Co-op Returner.

**EntrepreneurshipHub → HOSTS → CareerAndBusinessEvents**  
**EntrepreneurshipHub → CONNECTS → Students AND VictoriaTechCommunity**

### Graduate Students Society (GSS)

Runs Campus Trivia Night at the Grad House and organizes social events for the graduate student population. Represents an important segment that bridges the academic and social dimensions of campus life.

**GSS → HOSTS → TriviaNightAndGradSocials**  
**GSS → ASSOCIATED_WITH → GradHousePub**

### UVSS International Students Association

Hosts the International Student Welcome BBQ and cultural integration events. One of the most important organizations for The International Student archetype's social integration at UVic.

**UVSS_ISA → HOSTS → WelcomeBBQAndCulturalEvents**  
**UVSS_ISA → SERVES → InternationalStudentArchetype**

---

## Concept Entities

### Interest (Personalization Tag)

One of 24 named categories used for personalized content surfacing: Technology, Music, Art, Sports, Gaming, Film, Literature, Science, Business, Politics, Cooking, Travel, Fashion, Photography, Dance, Fitness, Nature, Volunteering, Coding, Career, Academic, Social, Workshop, Food. Selected during onboarding (minimum 3, no maximum). Updated anytime via the Profile page. Used to compute recommendation scores for events, clubs, and resources.

**Interest → SELECTED_BY → User**  
**Interest → MATCHED_AGAINST → EventTags** (recommendation scoring)  
**Interest → ORGANIZES → INTERESTS_PALETTE** (color-grouped in the UI: coral/amber/green/purple/indigo/terracotta)

### Social Proof

The visible evidence of other people's behavior that influences individual decisions. In FlockIn!!, social proof manifests as: (1) rsvpCount on poster cards ("47 going"), (2) savedCount visible to event creators, (3) Noticeboard snapshot shares (seeing a friend post a specific event), and (4) trending tag scores (high count = many events in this category, signaling a lively scene).

**SocialProof → DRIVES → RSVPCascade** (high RSVP count creates momentum)  
**SocialProof → AMPLIFIED_BY → ShareBehavior**  
**SocialProof → CORRELATES_WITH → EventAttendance**  
**SocialProof → HIGHEST_FORM → FriendRSVP** (which FlockIn!! doesn't yet show explicitly)

### Club Subscription Network Effect

The aggregate value created when many users subscribe to many clubs and clubs post events that notify subscribers. As the subscription network grows, each new approved event reaches a pre-qualified audience of interested students without requiring them to be active app users at the time of posting.

**ClubSubscriptionNetwork → GROWS_WITH → MoreSubscribersPerClub**  
**ClubSubscriptionNetwork → CREATES → PassiveEngagement** (notification-mediated without proactive browsing)  
**ClubSubscriptionNetwork → REDUCES → ChurnRisk** (subscribers stay informed without habit formation)  
**ClubSubscriptionNetwork → POWERS → ReactivationOfGhosts**

### Campus Event Calendar Rhythm

UVic's academic year creates predictable peaks and troughs in event activity: high volume in Weeks 1–4 (orientation energy), mid-semester trough (academic pressure), a burst around specific anchors (Research Symposium, cultural weeks, Farmers Market season), pre-Reading Break quiet, a final push in Weeks 11–13. This rhythm shapes the Noticeboard's density and the engagement patterns of every archetype.

**CampusRhythm → SHAPES → EventVolume** (across the semester)  
**CampusRhythm → CREATES → NaturalChurnMoments** (reading break, exam period)  
**CampusRhythm → CREATES → NaturalEngagementPeaks** (start of semester, cultural events)

### FOMO and Victoria-Specific Cultural Context

Fear of Missing Out (FOMO) at UVic is somewhat attenuated compared to a large urban campus — Victoria is small, and the social scene is more community-oriented than status-competitive. However, FOMO still operates as a driver, particularly for The Club Crawler who is still discovering the campus ecosystem. The "Expiring Soon" pulse and the #HappeningNow pill activate FOMO in a very literal, time-bound way: something is happening right now and the board is telling you.

**FOMO → TRIGGERED_BY → HappeningNowFilter**  
**FOMO → TRIGGERED_BY → ExpiringEventPulse**  
**FOMO → TRIGGERED_BY → HighRSVPCount** (social proof of attendance)  
**FOMO → MOTIVATES → ImpulsiveRSVP**

### Noticeboard Aesthetics as Social Currency

The visual distinctiveness of the FlockIn!! corkboard interface creates a form of aesthetic social currency — sharing a FlockIn!! poster card snapshot to Instagram Stories is not just event promotion, it is a small act of identity expression. "I go to cool events. I use a visually interesting app." This aesthetic dimension is unique to FlockIn!! and has no equivalent in generic event platforms.

**NoticeboardAesthetics → DRIVES → ShareBehavior**  
**ShareBehavior → PRODUCES → ExternalImpressions**  
**ExternalImpressions → MAY_CAUSE → NewUserAcquisition**  
**NoticeboardAesthetics → CREATES → PlatformIdentity** (distinguishable from generic apps)

---

## Full Relationship Summary (Graph Edge List)

For MiroFish knowledge graph construction, the following relationships should be encoded as typed edges:

**User–Content Relationships:**
- `User → [RSVPS_TO] → Event`
- `User → [SAVES] → Event`
- `User → [SAVES] → Club`
- `User → [JOINS] → Club`
- `User → [SUBSCRIBES_TO] → Club`
- `User → [CREATES] → Event`
- `User → [REPORTS] → Event`
- `User → [SHARES] → Event` (generates snapshot)
- `User → [EXPORTS_CALENDAR] → Event`
- `User → [SELECTS] → Interest`
- `User → [RECEIVES] → PushNotification`

**Platform–Content Relationships:**
- `Admin → [APPROVES] → Event`
- `Admin → [REJECTS] → Event`
- `Admin → [FEATURES] → Event` (gold pushpin designation)
- `Event → [HAS_CATEGORY] → Category`
- `Event → [HAS_TAG] → Tag`
- `Event → [OCCURS_AT] → Location`
- `Club → [HAS_TAG] → Interest`
- `Club → [POSTS] → Event` (organizational authorship)
- `Resource → [HAS_TAG] → Interest`

**Notification Relationships:**
- `ClubSubscription → [TRIGGERS] → PushNotification` (when club's event approved)
- `RSVP → [TRIGGERS] → ReminderNotification` (24h and 1h before event)
- `PushNotification → [DELIVERED_TO] → User`
- `PushNotification → [MAY_CAUSE] → AppOpen`
- `PushNotification → [MAY_CAUSE] → RSVP`

**Social Dynamics Relationships:**
- `HighRSVPCount → [DRIVES] → RSVPCascade`
- `ShareBehavior → [CREATES] → ExternalImpression`
- `ExternalImpression → [MAY_CAUSE] → NewUserSignup`
- `ClubSubscription → [REDUCES] → ChurnRisk`
- `InterestMatch → [INCREASES] → RetentionProbability`
- `AdminApprovalLatency → [AFFECTS] → OrganizerRetention`
- `FeaturedEvent → [AMPLIFIES] → RSVPCount`

**Campus Geography Relationships:**
- `TheVertigo → [HOSTS] → MusicSocialEvents`
- `GradHousePub → [HOSTS] → GradStudentEvents`
- `ECSBuilding → [HOSTS] → TechWorkshopCareerEvents`
- `VisualArtsBuilding → [HOSTS] → ArtCreativeEvents`
- `McPhersonLibrary → [HOSTS] → AcademicStudyEvents`
- `CadboroBay → [HOSTS] → OutdoorPhotographyEvents`
- `RingRoad → [HOSTS] → FarmersMarketOutdoorEvents`

**Organization–Community Relationships:**
- `UVSS → [FUNDS] → RegisteredClubs`
- `UVSS → [OPERATES] → TheVertigo AND GradHousePub`
- `VictoriaCodingCollective → [ATTRACTS] → TechStudents`
- `EnvironmentalSociety → [ATTRACTS] → OutdoorWellnessStudents`
- `EntrepreneurshipHub → [ATTRACTS] → CareerFocusedStudents`
- `UVSS_ISA → [SERVES] → InternationalStudents`
- `GSS → [SERVES] → GraduateStudents`
