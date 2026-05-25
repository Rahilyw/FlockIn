# FlockIn — Simulation Scenario
*Seed document for MiroFish simulation engine*

---

## The Setting

The simulation takes place at a mid-size research university in North America — approximately 18,000 undergraduates, a residential campus with multiple dining halls, a prominent student union building, and a dense Greek row adjacent to campus. The university has a strong STEM college, a well-regarded business school, a creative arts faculty, and the full range of social organizations found at a typical American university. There are approximately 200 registered student organizations.

The simulation begins at the start of the fall semester, Week 3 — after Welcome Week and the Club Fair have concluded, when students have settled into their routines but the social and academic rhythm is still being established. This timing is intentional: Welcome Week is chaotic and information-overloaded, making it a poor launch window for a new platform. Week 3 is when students start looking for structure and community.

The current month is September. The fall semester runs through mid-December.

FlockIn has just completed a soft launch. The platform has been tested internally and has a seeded dataset of approximately 30 approved events and 15 clubs already in Firestore. The first wave of users will be early adopters who heard about FlockIn through targeted outreach: a few strategically chosen club presidents, a student newspaper mention, and a social media post from the student government VP.

---

## Week-by-Week Rollout Narrative

### Week 1: The Seed Network

The simulation opens with approximately 25–40 active users. These are the early adopters — primarily drawn from The Club President and The Social Organizer archetypes, plus a handful of Enthusiastic Freshmen who encountered FlockIn through the student newspaper article. The Noticeboard shows 28 approved events across all categories. The most RSVPed events are a Thursday open mic night (Music, 11 going) and a resume workshop from the business school's career center (Career, 23 going — career events always get early traction because they feel urgent).

Behavior in Week 1 is characterized by genuine exploration. Users spend time on the Noticeboard and save events. RSVP-to-save ratio is roughly 1:3 — for every RSVP, three saves are made, suggesting users are treating the platform as a discovery and planning tool. Onboarding completion rate is high (roughly 80%) among the first-wave users because these are motivated early adopters.

Key user behavior to observe: Do early users share event links or tell friends about FlockIn directly? Or do they use it silently? The platform has no built-in sharing mechanism (no "share to Instagram," no copy-link button for events), so early viral spread depends entirely on organic word-of-mouth and link sharing through external apps.

The admin review queue receives its first wave of submitted events. Five to eight events are submitted in Week 1. Three pass review quickly; one is rejected for incomplete information (no end time, vague description). The organizer is frustrated and doesn't resubmit. This is the first instance of moderation friction.

### Week 2: The First Wave of Organic Spread

The tipping point for organic spread occurs when The Enthusiastic Friend archetype discovers the platform. One or two of these users independently finds FlockIn (through a friend, through stumbling on it, or through the student newspaper piece) and immediately begins sharing event links into their group chats. This is the platform's first viral moment — not a post going viral, but a behavior pattern where a small number of high-influence connectors begin distributing FlockIn links through their existing networks.

By end of Week 2, the user count should reach 100–150 active accounts. The category breakdown of active users will likely skew toward Social and Academic interest tags because those represent the broadest appeal.

A significant event occurs mid-Week 2: a photography club posts a well-designed event — a night-photography walk around campus — with a beautiful poster image. The poster card on the Noticeboard is visually striking relative to the text-only or low-resolution image cards around it. This event attracts RSVPs disproportionate to the photography club's existing membership, demonstrating that visual quality on the Noticeboard matters for discovery. This is an early signal of the poster-aesthetics quality loop.

The trending tags section begins to show meaningful data: "photography," "open-mic," "resume," and "networking" are among the top tags. Users start clicking filter pills and noticing that the Noticeboard feels responsive to their interests.

### Week 3: The Crossover Moment

The simulation's most important early milestone: a Greek chapter or a large student organization decides to use FlockIn as their primary promotional channel for an upcoming major event. They post a well-described, visually attractive event (party, social mixer, or talent showcase). The event has a notable name behind it — perhaps a semi-popular student DJ or the chapter's signature annual event.

This event breaks through the barrier between early-adopter communities and the general student population. The Social Organizer archetype promotes it within her chapter and to her broader network. The event accumulates 60–80 RSVPs within 48 hours, making it by far the most-RSVPed event on the platform. This RSVP count is visible on the poster card and creates social proof momentum: students who were previously unaware of FlockIn see peers RSVPing and ask what app they're using.

Three behavioral patterns emerge in Week 3:

**The RSVP cascade**: When one event accumulates many RSVPs quickly, users who hadn't previously engaged begin RSVPing to the same event — social proof converting passive browsers into active attendees.

**The organizer discovery loop**: Several club presidents see that this major event used FlockIn and independently decide to post their own events. The admin queue grows significantly, and the admin approves events faster to avoid bottlenecks.

**The lurker activation**: The Introvert Lurker archetype, previously passive, begins engaging with the Workshop and Academic filter tags because those events are now visible. They save multiple events but RSVP to few. This is normal and healthy lurker behavior.

### Week 4: First Growing Pains

By Week 4, the platform has enough user density (250–400 users) that social proof is functioning at meaningful scale. However, problems begin to emerge.

**Moderation bottleneck**: The single admin is reviewing 15–20 submitted events per week. Events with quick turnaround from submission to approval see better promotion success. Events submitted on Thursday afternoon for a Saturday event frequently sit in the queue until late Friday, cutting prime promotion time in half. Organizers begin to develop trust issues with the platform's responsiveness.

**Quality variance**: As the platform scales, event quality on the Noticeboard becomes inconsistent. Some events have beautiful poster images, carefully written descriptions, and detailed tags. Others have placeholder text in the description ("come join us"), no image, and no tags, resulting in poster cards that are plain gradient backgrounds with minimal information. The most sophisticated users begin to notice and mentally discount unappealing cards. The discovery quality of the Noticeboard is being diluted.

**Category imbalance**: The Social and Music categories have many more events than Academic, Workshop, or Volunteering. Users who selected those interests in onboarding see a rich, relevant feed. Users whose interests are primarily academic or professional see a Noticeboard where many cards are from categories that don't interest them. These users begin reducing their open frequency.

**First churn event**: A small cohort of early adopters (primarily from the career-focused and technical interest clusters) opens the app and finds the Noticeboard dominated by social events that don't match their interests. Without knowing about the category filter pills, they conclude the app "isn't for them" and stop opening it. This is the first churn wave, and it is driven by a UX education failure rather than a product failure — users don't know filters exist.

### Week 5: Mid-Semester Stabilization

The simulation reaches a stable state in Week 5. The core user base is now 300–500 active weekly users. The platform has found its natural audience: the subset of students who are actively managing their campus social/academic calendar and who value cross-community discovery.

A notable feature emerges: groups of friends develop a practice of checking FlockIn together — "let's see what's on the noticeboard this weekend" becomes a recurring social ritual for 3–5 distinct friend clusters. This communal discovery behavior was not designed for but emerges naturally from the group nature of campus events.

The trending tags section has become a meaningful social signal. Tags like "free-food," "campus," and category-specific tags have high counts. Savvy organizers begin including "free-food" as a tag on all events where food is provided, knowing it drives filter engagement.

The Club President archetype is now the primary source of high-quality event submissions. These organizers have learned the platform's norms: good images, detailed descriptions, relevant tags, submitted 5–7 days in advance. They treat FlockIn as a legitimate marketing channel alongside their Instagram and GroupMe.

### Week 6–8: Network Effects Testing

This period tests whether FlockIn has achieved genuine network effects. The question is not whether users use the platform but whether the platform becomes more valuable as more users join. True network effects would mean: seeing a friend's name on the RSVP count of an event is a persuasion signal. However, FlockIn's current implementation does not show individual names in the RSVP display — it shows only a count. This is a design limitation that constrains network effect propagation. The platform has social proof but not social graph visibility.

A competing dynamic emerges: some organizers begin relying exclusively on FlockIn for event promotion and abandoning their Instagram posts. For large events, this works because FlockIn has enough reach. For smaller, niche events (a film theory discussion, a political philosophy reading group), this is premature — FlockIn doesn't yet have the niche user density to replace specialized Instagram audiences.

### Week 9: The Trigger Event — Campus-Wide Catalyst

A major campus event (Homecoming Week, Greek Week, or an annual cultural festival) generates a burst of event activity. Dozens of organizations post events to FlockIn in a 5-day window. The Noticeboard becomes dense and rich — every category is represented, there are events happening simultaneously on multiple days.

This is FlockIn's most powerful moment of the semester. The Noticeboard looks genuinely alive, and the filter system becomes useful in a new way: students use the "this-week" filter to plan out their Homecoming schedule. RSVPs spike. User re-activation (Ghost archetype returning) is highest during this week.

The admin queue is overwhelmed. If there are 40+ pending events and one admin, approval latency increases to 24–48 hours, and some events are approved after they've already happened. This is a critical failure mode.

### Weeks 10–12: Decay Curve and Retention Differential

As the semester moves into its second half and academic pressure increases, event frequency naturally decreases. Midterm season suppresses attendance even for events that are posted. The Noticeboard becomes sparser.

The retention differential becomes visible: users who had FlockIn embedded in a social behavior loop (checking it with friends, using it to plan weekly schedules) maintain their habit. Users who used it opportunistically in the early weeks let the habit lapse. By Week 12, the active weekly user count has likely dropped to 60–70% of its peak.

---

## Key Trigger Events to Inject Mid-Simulation

The following are events that can be injected into the simulation to test specific dynamics:

1. **Popular Organization Adoption**: A sorority or fraternity with 200+ members posts their biggest annual event to FlockIn. Tests whether organizational network reach translates into platform user growth.

2. **Negative Experience Goes Viral**: An attendee reports that an approved event had a misleading description (the event was different than advertised). They mention this in a group chat. Tests whether negative word-of-mouth can reverse adoption and whether the reporting feature has visible community value.

3. **Admin Delay Crisis**: The admin goes 72 hours without checking the queue (simulating a weekend when the admin is offline). 15 events pile up. Tests organizer frustration thresholds and whether delayed approval causes them to stop posting.

4. **Interest Matching Breakthrough**: For one week, the simulation increases the density of niche Academic and Workshop events, ensuring that technically-oriented users (Introvert Lurker, Career-Focused Pre-Professional) see a highly relevant Noticeboard. Tests whether interest matching drives retention in underserved segments.

5. **External Social Media Mention**: A popular campus Instagram page (e.g., "spotted at [University]" account) posts about FlockIn with a positive description. Tests conversion rate from a single high-reach external mention.

6. **Greek Week / Cultural Week**: A burst of events from a single organizing body. Tests the platform's ability to handle event volume and whether high-density periods drive user re-activation.

7. **Event Fraud Attempt**: A user submits three events per day for a week (they will hit the 3-events/day limit each day and be blocked from submitting more). Tests whether rate limiting effectively prevents spam while allowing legitimate high-volume organizers to function.

---

## Simulation Questions

The simulation should attempt to answer the following:

**Adoption Dynamics**
- Which student segments adopt FlockIn first, second, and third? Is adoption driven by organizer supply (events being posted) or attendee demand (users seeking discovery)?
- What is the minimum number of events needed on the Noticeboard before new users find it worth exploring?
- At what user count does social proof (visible RSVP counts) become a meaningful persuasion factor?

**Feature Usage**
- Which filter pills are used most — time-based (happening-now, today) or category-based? Are trending tags used heavily or ignored?
- What is the RSVP-to-save ratio across different user archetypes? (A high save/low RSVP ratio suggests intent without commitment; a high RSVP/low save ratio suggests users who act fast without bookmarking)
- Do users primarily discover events through Noticeboard browsing, the Events list search, or direct links shared in other apps?
- Is the Dashboard (My Space) used actively, or is it a feature that sounds useful but isn't opened regularly?

**Drop-Off Points**
- What percentage of new users complete onboarding without dropping off? At which step (name or interests) do they abandon?
- How long after signup does the first session of passive browsing without any action (RSVP, save, create) lead to permanent churn?
- What is the relationship between interest selection breadth (number of interests selected) and 30-day retention?

**Network Effects**
- Does RSVP count on a poster card produce measurable conversion lift (more RSVPs per view)?
- Does the platform achieve cross-community discovery — do users RSVP to events from organizations they were previously unaware of?
- What is the social multiplier of The Enthusiastic Friend archetype? How many additional RSVPs does each "Enthusiastic Friend" user generate through their sharing behavior?

**Organic Behaviors**
- Do users develop regular checking habits, and if so, at what cadence (daily, several times per week)?
- Does the "Post an Event" call-to-action on the Dashboard convert passive attendees into event organizers? What is the attendee-to-organizer conversion rate?
- Do organizers who had events rejected try again with improved submissions, or do they churn?
- Does the trending tag system create a feedback loop where popular tags attract more events tagged with the same term?

**Churn Causes**
- What are the primary reasons users stop opening FlockIn? (Noticeboard feels irrelevant to their interests, administrative delays, no friends using the platform, insufficient events in their interest categories, moved their planning to another tool)
- Is there a specific week-in-semester effect on churn (midterms, finals)?
- Does the absence of a social graph (no ability to see which friends are going) create a structural ceiling on engagement?

---

## Variables to Test (A/B Scenarios)

The following variables can be toggled to test different product configurations:

1. **Onboarding friction**: Test requiring 3 vs. 5 vs. 1 minimum interests during onboarding. More interests = better personalization but higher drop-off in sign-up flow.

2. **Moderation speed**: Test 1-hour average approval time vs. 24-hour average. Measures impact on organizer retention and event promotion effectiveness.

3. **No moderation (instant publish)**: Remove the review step entirely and make all events immediately live. Tests quality degradation rate vs. organizer adoption rate.

4. **Interest-filtered Noticeboard**: Show only events matching the user's interests by default, rather than all approved events. Tests whether personalization improves engagement or reduces serendipitous discovery.

5. **Friend activity visibility**: Add a small "3 of your friends are going" badge to poster cards (requires a social graph, not currently implemented). Tests whether social graph signals significantly improve RSVP conversion.

6. **Event capacity visibility**: Show remaining capacity on poster cards (some events have a capacity field). Tests whether scarcity signals drive RSVP urgency.

7. **Push notifications**: Add a notification when a new event matching a user's interests is approved. Tests re-activation rate and whether notifications create more persistent engagement or more churn from notification fatigue.

---

## Expected Outcome Hypotheses

Based on the product design and campus social dynamics, the following outcomes are predicted (to be validated or refuted by the simulation):

The early majority of users will come from The Enthusiastic Freshman and The Club President archetypes, not from The Social Organizer, who is already well-served by existing channels and will be a late adopter. The platform will achieve a natural ceiling at 15–25% campus penetration without additional growth features (social graph visibility, friend activity, push notifications), because the remaining 75–85% of students are adequately served by their existing social channels. Network effects will be present but weak — the platform creates social proof (visible RSVP counts) but not social graph utility (seeing specific friends attending), which limits the viral coefficient. The strongest retention signal will be interest match quality: users whose Noticeboard is dominated by events in their stated interest categories will have 2–3x higher 30-day retention than users whose Noticeboard feels irrelevant.
