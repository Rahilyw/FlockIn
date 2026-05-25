# FlockIn — Entity Relationships
*Seed document for MiroFish knowledge graph construction*

---

## Overview

This document describes all meaningful entities in the FlockIn world and the relationships between them. The goal is to provide MiroFish with sufficient structure to build a knowledge graph that accurately models the people, places, events, groups, concepts, and platform behaviors that constitute campus social life as FlockIn mediates it. Every relationship described here is either directly encoded in the product's data model or emerges from the social dynamics the product is designed to facilitate.

---

## People Entities

### User (Base Entity)

Every person in the FlockIn world who has signed up is a User. A User has a unique identifier (uid), a display name, an email address (used for Google Sign-In), an optional profile photo (from Google), an optional bio of up to 200 characters, and a list of interests chosen from the 24 named interest categories. A User maintains four distinct lists that record their activity: their joined events (RSVPed to attend), their saved events (bookmarked), their joined clubs (member of), and their saved clubs (bookmarked but not joined). A User completes onboarding by selecting at minimum three interests, which determines their personalization profile. The onboardingComplete flag is the gate between signup and full access. Users are created at a point in time (createdAt) and updated whenever their profile or activity changes (updatedAt).

The User entity has the following direct relationships to other entities:
- A User SELECTS one or more Interests, which drives all recommendation behavior
- A User JOINS zero or more Events (RSVP), creating an attendance commitment
- A User SAVES zero or more Events, creating a passive bookmark without commitment
- A User JOINS zero or more Clubs, becoming a member
- A User SAVES zero or more Clubs, showing interest without membership
- A User CREATES zero or more Events, making them the Organizer of those events
- A User REPORTS zero or more Events, flagging them for moderation review
- A User IS an Admin (for the single designated administrator user), granting access to the Admin Queue

### Organizer (Role specialization of User)

An Organizer is any User who has created at least one event. The Organizer role is not a separate account type — it is a behavioral role that any User can assume by clicking "Post an Event." An Organizer becomes the sole owner of their events: they alone can edit them, delete them, and observe their moderation status. An Organizer POSTS Events. An Organizer RECEIVES a moderation outcome (approved or rejected) for each event they post. An Organizer MANAGES their Events through the Dashboard (My Events tab). If an Organizer deletes one of their Events, all RSVP Users are automatically removed from that event in a single atomic transaction.

### Admin (Role specialization of User)

The Admin is a single designated User whose UID matches the environment variable VITE_ADMIN_UID. The Admin REVIEWS all pending Event submissions. The Admin APPROVES or REJECTS each pending Event. Approved Events become visible on the public Noticeboard. Rejected Events remain visible only to their creator with a "Not approved" badge. The Admin has no other special capabilities visible in the current implementation — they cannot create clubs, manage resources, or view user profiles. The Admin role is non-transferable in the current architecture.

### Attendee (Role specialization of User)

An Attendee is a User who has RSVPed to one or more events. Attendance is bidirectionally tracked: the User's joinedEvents list contains the event IDs, and the Event's rsvpBy list contains the User's UID. The rsvpCount field on the Event is a denormalized integer count maintained in sync with the rsvpBy array via Firestore transactions. An Attendee can un-attend an event (leaveEvent), which atomically removes them from the event's rsvpBy list and removes the event from their joinedEvents list. There is no concept of attendance confirmation or check-in — RSVP is the final state.

### Lurker (Behavioral role of User)

A Lurker is not a formal entity type but a meaningful behavioral pattern: a User who browses the Noticeboard, saves events, and views event details without RSVPing or creating events. Lurkers contribute to the savedBy count on events (a social signal about interest) but not to rsvpCount. Lurkers may browse club pages and resource listings without joining or bookmarking. From the platform's perspective, Lurkers are active users who never take converting actions. Their behavior is valuable for understanding discovery patterns — the ratio of saves to RSVPs (savedCount vs. rsvpCount) on an event tells you how much unconverted interest exists.

---

## Event Entities

### Event

An Event is the core content unit of FlockIn. Every Event has a unique system-generated ID, a title (minimum 3 characters), a description (minimum 10 characters), a start date/time, an end date/time, a location string, a category (one of: Music, Art, Workshop, Social, Sport, Academic, Career, Food, Other), the UID and display name of the creator, the creator's profile photo, an optional poster image path (stored in Firebase Storage), an array of free-form tags (lowercase strings), and a status of pending, approved, or rejected.

Every Event maintains live counters: rsvpCount (integer, always in sync with rsvpBy array), savedCount (integer, always in sync with savedBy array), and a reported boolean flag. Events with reported: true should be flagged for admin review, though there is no automated moderation action for reported events in the current implementation.

An Event BELONGS TO a single Category. An Event HAS zero or more Tags. An Event IS CREATED BY one User (Organizer). An Event IS RSVPed BY zero or more Users (Attendees). An Event IS SAVED BY zero or more Users (Lurkers or Attendees). An Event IS APPROVED or REJECTED by the Admin. An Event BELONGS TO a specific time window which enables the time-based filter system (happening-now, today, this-week, next-week).

Events are only visible on the public Noticeboard when their status is "approved" AND their endTime is in the future. This means the Noticeboard is always showing only currently-relevant, human-reviewed content.

### Event Category

A Category is a named classification for events. The nine categories are: Music, Art, Workshop, Social, Sport, Academic, Career, Food, Other. Categories are fixed — they cannot be created or deleted by users or admins. Each Category has an associated color palette used throughout the interface (for filter pills and event detail badges) and an associated action label used on Noticeboard poster cards (Workshop → "Sign Up," Career → "Register," Sport → "Join," Academic → "Learn More," Music/Art → "RSVP," Social → "Join Us," Food → "Attend," Other → "Learn More"). A Category groups Events of the same type. A Category IS FILTERABLE on the Noticeboard via the filter pill system.

### Event Tag

A Tag is a free-form text label attached to one or more events. Tags are stored as lowercase strings. Each tag has a corresponding document in the Firestore "tags" collection that tracks the tag's name, total usage count (incremented each time the tag is used on a new event), and the timestamp it was last used. Tags with the highest usage counts become "trending tags" and are displayed as filter pills on the Noticeboard. The trending tag system creates a live vocabulary of what topics are currently prominent on campus. A Tag APPEARS ON zero or more Events. A Tag HAS a usage count that determines its trending status. A Tag IS FILTERABLE on the Noticeboard.

---

## Club Entities

### Club

A Club represents a campus organization in FlockIn's database. A Club has a unique ID, a name, a description, a category string, a member count, an array of member UIDs, an optional logo URL, a contact email, and an array of tags. Clubs are curator-managed (not user-created) — they represent the stable, verified layer of campus organizations on the platform. A Club HAS zero or more Members (Users). A Club HAS one Category. A Club HAS zero or more Tags. Users JOIN or LEAVE Clubs, which atomically updates both the club's memberIds array and the user's joinedClubs array. Users also SAVE Clubs without joining, creating a bookmarked interest without formal membership.

---

## Resource Entities

### Campus Resource

A Campus Resource represents a service, space, document, or link available to students on campus. Resources are of four types: "link" (external URL), "document" (downloadable file), "room" (reservable physical space), and "service" (campus support service). A Resource has a title, description, optional URL, optional physical location, and tags. Resources are curator-managed and browsable by all users, including unauthenticated visitors. A Resource IS TAGGED with interest tags, enabling interest-based recommendations. A Resource HAS a type that determines how it is displayed and linked to.

---

## Place Entities

While FlockIn does not have a formal Place entity type in its database, location strings on Events and Resources create an implicit spatial layer that MiroFish should model. The following place types appear as event locations:

**Campus Buildings** include lecture halls, student union buildings, laboratory buildings, arts centers, sports facilities, and administrative offices. Events tagged Academic or Workshop frequently occur in lecture halls and seminar rooms. Events tagged Career frequently occur in the business school building or a hotel-style conference center attached to campus.

**Outdoor Campus Spaces** include the campus quad, courtyards, athletic fields, and plazas. Social, Sport, and Food events frequently use these spaces.

**Greek Row** is a distinct spatial zone adjacent to campus where fraternities and sororities host Social events. Events in this zone tend to have high RSVP counts and strong word-of-mouth spread.

**Residence Halls** are where freshmen and some upperclassmen live. Events in residence halls (floor socials, hall-sponsored events) serve the residential student population.

**Off-Campus Locations** (local bars, coffee shops, community centers) appear infrequently but signal events that bridge campus and city community.

The location string on an Event IS WHERE the Event takes place. Location proximity IS A FACTOR in whether certain user archetypes attend — a freshman living in a residence hall will more likely attend an event in their hall than an identical event across campus.

---

## Group Entities

### Friend Group

A Friend Group is an informal social cluster — typically 4–15 students who regularly spend time together, share group chats, and coordinate event attendance. Friend Groups are not represented in FlockIn's data model but are a critical real-world entity because they drive attendance decisions. When one member of a Friend Group RSVPs to an event, the probability that other members RSVP increases significantly. Friend Groups create RSVP cascade dynamics. A Friend Group HAS a central connector (The Enthusiastic Friend archetype) who is most responsible for sharing event information within the group.

### Student Organization

A Student Organization is a formal registered campus group — a club, society, chapter, or team. Student Organizations appear in FlockIn as Club entities. They also appear as event creators (when a club's officer posts an event on behalf of the organization). A Student Organization HAS a membership list. A Student Organization CREATES Events. A Student Organization RECRUITS members through events.

### Greek Chapter

A Greek Chapter is a specific, high-status type of Student Organization — a fraternity or sorority. Greek Chapters are particularly important to model because they have large, dense, well-connected membership networks that can rapidly amplify events. A Greek Chapter HAS 30–150 active members. A Greek Chapter HOSTS high-visibility Social events. A Greek Chapter IS EMBEDDED in a peer network of other Greek Chapters (through inter-Greek events, IFC/Panhellenic councils, and shared social spaces).

### Academic Department / College

An Academic Department is an institutional group that creates events for its students — career fairs, research talks, orientation events, networking dinners. These events skew toward the Academic and Career categories and attract the Career-Focused Pre-Professional and Involved Senior archetypes. A Department CREATES events that are relevant to students in that major. A Department's events often have implicit credentialing value (attending a department networking event signals seriousness to faculty and recruiters).

### Cultural Student Association

A Cultural Student Association is a student organization organized around national, ethnic, or regional identity (e.g., the Chinese Students Association, the South Asian Students Collective, the Black Student Union). These organizations are particularly important for The International Student and The Wellness/Activist archetype. They host Social, Food, and Workshop events with strong in-community reach and growing cross-community visibility. A Cultural Association CREATES events that celebrate and share cultural identity. A Cultural Association IS A BRIDGE between international/underrepresented students and the broader campus.

---

## Concept Entities

### Interest

An Interest is one of 24 named categories used to personalize the FlockIn experience: Technology, Music, Art, Sports, Gaming, Film, Literature, Science, Business, Politics, Cooking, Travel, Fashion, Photography, Dance, Fitness, Nature, Volunteering, Coding, Career, Academic, Social, Workshop, Food. An Interest IS SELECTED by a User during onboarding or on the Profile page. An Interest IS MATCHED against Event and Club tags to produce a relevance score. An Interest BELONGS TO a loose semantic family (creative/performing arts, food/social, athletic/outdoor, digital/technical, professional).

### Social Proof

Social Proof is the mechanism by which visible evidence of other people's behavior influences individual behavior. In FlockIn, social proof manifests primarily as the rsvpCount displayed on each poster card on the Noticeboard. A higher RSVP count creates stronger conversion pressure on new viewers. Social Proof INFLUENCES attendance decisions. Social Proof IS STRONGER when the viewer believes the attendees are from their peer group. Social Proof CREATES momentum: events that accumulate early RSVPs accumulate more RSVPs than identical events that don't.

### FOMO (Fear of Missing Out)

FOMO is the anxiety that an interesting or enjoyable event is occurring without the individual. FOMO IS TRIGGERED when a user sees a high-RSVP event that aligns with their interests. FOMO IS AMPLIFIED when users see peers discussing an event they didn't know about. FOMO IS A DRIVER of both RSVP behavior and of downloading and signing up for FlockIn in the first place. On campus, FOMO is one of the most powerful psychological forces driving social event attendance. FlockIn's Noticeboard is a FOMO machine — it makes visible the full scope of what's happening and creates awareness of events that would otherwise pass by unnoticed.

### Virality

Virality describes the property of an event that makes people want to share it with others. In FlockIn's context, viral events are those shared in group chats, mentioned in conversation, and referenced by multiple social circles simultaneously. Virality IS TRIGGERED by visual distinctiveness (a striking poster card image), social relevance (the event is from a high-status organization), topic resonance (the event speaks to a current campus conversation), or scarcity (limited capacity, one-time occurrence). Virality on FlockIn propagates primarily through external channels (iMessage, GroupMe, Instagram DMs) because FlockIn lacks native sharing tools. Virality CREATES cross-community spread — it is how users from one social cluster learn about events that originated in another cluster.

### Personalization

Personalization is the mechanism by which FlockIn tailors its content display to individual users based on their stated interests. FlockIn's personalization uses tag-intersection scoring: events whose tags overlap more with a user's interests receive higher relevance scores and appear more prominently. Personalization IS DETERMINED by Interest selection. Personalization IMPROVES over time if users update their interests on the Profile page (though the current implementation does not automatically update interests based on behavioral signals). Personalization CREATES a feedback loop: users who see relevant events RSVP more often, which may reinforce their sense that their interests were correctly identified, which may lead to more consistent use.

### Campus Reputation

Campus Reputation is the social status of a person, organization, or event in the campus social hierarchy. High-reputation organizations can count on higher attendance and more word-of-mouth spread for their events. High-reputation individuals (popular students, well-known athletes, influential student leaders) can drive significant RSVP activity by simply posting or sharing an event. Campus Reputation IS EARNED through consistent high-quality events, large membership, social media presence, and time. Campus Reputation INFLUENCES how quickly an event's RSVP count grows. Campus Reputation IS FRAGILE: one poorly executed event or a negative incident can significantly damage it.

### Event Quality Signal

Event Quality Signal is the composite impression a viewer forms of an event from the information visible on its poster card. High-quality signals include: a compelling cover image, a clear and interesting title, a recognizable or trusted organizer name, a specific and descriptive location, a reasonable date and time, and visible social proof (RSVP count). Low-quality signals include: no image (plain gradient only), vague title ("Social Event"), generic location ("TBD"), and very few RSVPs. Event Quality Signal DETERMINES whether a viewer clicks to learn more or scrolls past. Event Quality Signal IS PARTIALLY within the organizer's control (through image quality, writing quality, and tag specificity) and partially outside it (through social proof and organizational reputation).

### Network Density

Network Density describes how many members of a user's social network are also on FlockIn. A user whose entire friend group is on FlockIn will experience the platform very differently — and more valuably — than a user whose social network has no presence there. Network Density IS THE CORE DRIVER of social network adoption patterns (the classic S-curve). Network Density REACHES A TIPPING POINT when a sufficient percentage of a social cluster is on the platform that abstaining from it means missing meaningful social coordination. Network Density IS LOWER initially in cross-community segments (e.g., a student whose social network spans multiple clubs and organizations) and higher within homogeneous communities (e.g., a student whose entire social world is their 80-person Greek chapter, most of whom signed up together).

---

## Key Relationships Summary

For graph construction, the following relationships should be encoded as edges:

- `User → [SELECTS] → Interest` (many-to-many)
- `User → [RSVPS_TO] → Event` (many-to-many, tracked bidirectionally)
- `User → [SAVES] → Event` (many-to-many, tracked bidirectionally)
- `User → [CREATES] → Event` (one-to-many)
- `User → [JOINS] → Club` (many-to-many, tracked bidirectionally)
- `User → [SAVES] → Club` (many-to-many)
- `User → [REPORTS] → Event` (many-to-one flag)
- `Admin → [APPROVES] → Event` (one-to-many)
- `Admin → [REJECTS] → Event` (one-to-many)
- `Event → [HAS_CATEGORY] → Category` (many-to-one)
- `Event → [HAS_TAG] → Tag` (many-to-many)
- `Event → [OCCURS_AT] → Location` (many-to-one)
- `Club → [HAS_TAG] → Tag` (many-to-many)
- `Club → [HAS_MEMBER] → User` (many-to-many, tracked bidirectionally)
- `Resource → [HAS_TAG] → Tag` (many-to-many)
- `Tag → [ASSOCIATED_WITH] → Interest` (implicit, by lowercase string matching)
- `Interest → [INFLUENCES] → EventRelevanceScore` (scoring mechanism)
- `FriendGroup → [AMPLIFIES] → Event` (social proof propagation)
- `StudentOrganization → [CREATES] → Event` (organizational authorship)
- `GreekChapter → [IS_A] → StudentOrganization`
- `CulturalAssociation → [IS_A] → StudentOrganization`
- `RSVPCount → [SIGNALS] → SocialProof` (conversion influence)
- `SocialProof → [DRIVES] → RSVP_CASCADE` (network effect)
- `User → [EXPERIENCES] → FOMO` (triggered by high-RSVP events in interest areas)
- `FOMO → [MOTIVATES] → RSVP` (psychological driver)
- `Interest → [MATCHED_BY] → EventTag` (recommendation mechanism)
- `NetworkDensity → [ENABLES] → NetworkEffect` (platform growth mechanism)
