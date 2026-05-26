# MiroFish Simulation Prompt — FlockIn!! at UVic
*Standalone simulation prompt. Paste this into MiroFish alongside the four seed documents.*
*Seed documents: 01_product_overview.md, 02_user_segments.md, 03_simulation_scenario.md, 04_entity_relationships.md*

---

## The Question

Simulate the survival and adoption dynamics of **FlockIn!!** — a campus event discovery PWA built by students for students — at the University of Victoria (UVic), Victoria BC, Canada, across a **12-week fall semester beginning September 4**.

The question this simulation must answer honestly:

> **Will UVic students actually use FlockIn!!, or will they open it once, think "cool," and never come back?**

Do not model for optimism. Model for truth. Campus apps fail constantly — 300 signups in two weeks, then 40 active users by week 6, then nothing. Find whether FlockIn!! is different, and if so, why. If not, why not.

---

## Knowledge Graph Seed Documents

Before running the simulation, process all four attached documents into your knowledge graph. They are the authoritative source of truth for everything in this simulation.

| Document | Contents |
|---|---|
| `01_product_overview.md` | Full product description — Noticeboard corkboard interface, filter system (hashtag pills, #HappeningNow, #Today, trending tags, categories), all Phase 1/2/3 features (push notifications, club subscriptions, event snapshot sharing, calendar export, featured event gold pin), complete user journey, UVic-specific context |
| `02_user_segments.md` | UVic campus social ecosystem (no Greek life, UVSS as power center, co-op culture, Victoria outdoor character, international student community) + 12 student archetypes with behavioral profiles |
| `03_simulation_scenario.md` | Survival analysis framework — "Look and Leave" failure problem, 4 outcome thresholds, adoption funnel with drop-off rates, supply-demand balance model, notification dependency tests, 5 failure paths, 3 success paths, 7 trigger events, 7 hard questions, realistic base case estimate |
| `04_entity_relationships.md` | Knowledge graph entity definitions and typed relationship edges — all user roles, event/club/resource entities, UVic place entities, organization entities, behavioral concept entities (social proof, FOMO, club subscription network effect, campus calendar rhythm) |

---

## World State at Simulation Start (Week 0)

### Platform Contents — Already Live in Firestore

**22 approved events across all 9 categories at real UVic locations:**

| Category | Events |
|---|---|
| Music | Jazz & Blues Night (The Vertigo), Battle of the Bands (MacLaurin B-Wing Courtyard), Open Mic Night (The Vertigo), Spring Classical Recital (Phillip T. Young Recital Hall), UVic Music Collective Open Rehearsal |
| Art | Ceramics Open Studio (Visual Arts Building), End of Year Art Exhibition (University Centre), Life Drawing Session (Visual Arts Building) |
| Workshop | Intro to Machine Learning (ECS 108), Photography Basics: Shoot in Manual (Visual Arts Building), Sustainable Living on Campus (SUB B-Wing), Resume & LinkedIn Workshop (Career Centre) |
| Social | International Student Welcome BBQ (Campus Community Gardens), Campus Trivia Night (Grad House Pub), UVic Farmers Market (Ring Road) |
| Sport | 5K Fun Run (Recreation Centre), Intramural Flag Football Sign-Up (Centennial Stadium) |
| Academic | Undergraduate Research Symposium (University Centre), Philosophy Debate Night (Clearihue A001), Study Skills Bootcamp (McPherson Library) |
| Career | Tech Recruiting Panel (ECS 104), Health Sciences Career Fair (Petch Building) |

**12 clubs in directory:** Victoria Coding Collective, UVic Photography Club, Environmental Society, Philosophy & Debate Society, Culinary Arts Club, Salsa & Ballroom Dance Society, Outdoor Adventures Club, Film & Media Arts Society, Entrepreneurship Hub, UVic Music Collective, Video Games & Esports Club, Creative Writing Circle

**10 campus resources:** McPherson Library Study Rooms, Campus Counselling Services, Career & Co-op Education Centre, UVic Recreation Centre, Writing Centre, IT Help Desk, MyUVic Student Portal, Interactive Campus Map, UVSS Student Society, UVic Food Bank

**Registered users: 0.** Clean launch. No existing user base. No imported social graph.

### The Admin

There is one administrator — a student named Rahil — who personally reviews and approves or rejects every event submitted. This is not a paid content moderation role. Approval latency is the single most operationally fragile variable in the system. Vary this per track as specified below.

### UVic Campus Reality

- ~15,000 active undergrads enrolled fall semester
- No Greek life — social ecosystem distributed across hundreds of clubs, no status hierarchy via letters
- UVSS (UVic Students' Society) is the student power center: runs The Vertigo venue, the Grad House Pub, club funding, and has 8,000+ Instagram followers — the largest student-run UVic account
- Strong co-op culture: ~30% of students in co-op programs, returning from work terms each fall
- Victoria is a small Pacific coastal city — outdoor events, cycling culture, mild rainy weather; not a dense nightlife city. Students create their own social world on campus.
- Current event discovery is broken: Instagram (algorithmic suppression), iMessage groups (closed networks), UVSS website (nobody checks it), physical flyers (no cross-community reach)

---

## Agent Population — 500 Agents

| Archetype | Agents | % | Starting Condition |
|---|---|---|---|
| The Club Crawler (First-Year) | 90 | 18% | Off-platform. Discovers via word-of-mouth or Instagram Story |
| The Org Executive | 25 | 5% | Off-platform. Primary supply-side. Discovers via peer or UVSS |
| The Enthusiastic Connector | 40 | 8% | Off-platform. Organic growth engine. Discovers via friend |
| The Quiet Observer | 70 | 14% | Off-platform. Discovers via specific event mention |
| The International Student | 65 | 13% | Off-platform. Discovers via orientation channels or peer |
| The Co-op Returner | 45 | 9% | Off-platform. Split: 25 arrive Week 1, 20 return Week 9 |
| The Outdoor & Wellness Student | 40 | 8% | Off-platform. Discovers via Environmental Society or peer |
| The Arts & Creative Student | 35 | 7% | Off-platform. Discovers via Instagram Story poster share |
| The Career-Focused Pre-Professional | 35 | 7% | Off-platform. Discovers via Entrepreneurship Hub or Career Centre |
| The Graduate Student | 25 | 5% | Off-platform. Discovers via department or Grad House |
| The Indigenous Student | 15 | 3% | Off-platform. Discovers via First Peoples House community |
| The Ghost (latent drop-off) | 15 | 3% | Initialize as Club Crawlers. Will be behaviorally flagged as Ghosts when they abandon post-onboarding |
| **Total** | **500** | **100%** | |

---

## Behavioral Rules Per Archetype

### The Club Crawler
- **Discovery:** iMessage word-of-mouth (35% conversion to visit), Instagram Story (8-12%)
- **Onboarding:** Completes fully. Selects 6-8 interests.
- **Activity pattern:** Daily Noticeboard browsing, weeks 1-2. Drops to 3-4x/week by week 4.
- **RSVP-to-attendance:** ~60% (over-commits)
- **Subscriptions:** Subscribes to 3-4 clubs within first week of discovering the feature.
- **Retention driver:** Push notifications from subscribed clubs. Loses the app in memory without them.
- **Churn trigger:** If Noticeboard has no relevant events for their interests in any 10-day window, they stop checking.
- **Reactivation:** A friend directly mentioning a specific event. Or a push notification from a club they subscribed to.

### The Org Executive
- **Discovery:** Peer recommendation from another Org Exec, or UVSS announcement.
- **Primary behavior:** Event creation. Posts 2-4 events/month if satisfied with the platform.
- **Approval latency sensitivity:**
  - Under 3 hours on weekday → high commitment, likely becomes evangelist
  - 3-8 hours → acceptable, continues posting
  - 8-24 hours on a weekday → 40% chance they deprioritize FlockIn!! as primary channel
  - 24+ hours → 70% chance they stop using FlockIn!! as primary promotion tool
- **Success signal:** RSVPs from faces outside their existing club network. This is the hook that makes them committed.
- **Secondary behavior:** Monitors RSVP count in real time via My Space. Subscribes to 2-3 peer org clubs.
- **Platform evangelist condition:** Under 3-hour approval average + at least one event with 10+ RSVPs from people outside their network.

### The Enthusiastic Connector
- **Discovery:** Organic word-of-mouth. Already has friends on the platform.
- **High-value behavior:** Shares poster card snapshots to Instagram Stories (2-4 times over first 6 weeks if engaged). Sends event links into 3-5 different group chats. Each share generates 8-15 new first-time visits.
- **RSVP pattern:** 55% of saves become RSVPs. 70% of RSVPs result in attendance.
- **Subscription:** Subscribes to 2-3 clubs, primarily to be the first to know.
- **Snapshot share trigger:** Any event they find genuinely exciting. Generates share within first week if such an event exists on the board.
- **Churn risk:** Low if engaged. Will stay active as long as FlockIn!! gives them things to share.

### The Quiet Observer
- **Discovery:** A friend directly messages them about a specific event they'll like.
- **Activity pattern:** Opens app 3-4x/week but primarily saves, rarely RSVPs.
- **Save-to-RSVP ratio:** ~25% (saves many, commits to few)
- **Filter usage:** Workshop, Technology, Academic, Coding pills are primary navigation.
- **Subscription:** Subscribes to Victoria Coding Collective and 1-2 other niche clubs. Push notifications meaningfully increase their attendance rate.
- **Churn trigger:** Noticeboard becomes dominated by social/party events. No Workshop or Academic content for 2+ weeks.
- **Note:** Their engagement is invisible to aggregate RSVP metrics. They are a large part of actual event attendance for niche events. Do not undercount them as inactive.

### The International Student
- **Discovery:** Orientation week mention (20% visit), other international students (35%), UVSS social channels (3-5%).
- **First-visit behavior:** If seed content includes cultural, academic, or social integration events (International Welcome BBQ, Research Symposium, Study Skills Bootcamp), high first-session action rate (40-50%). If board is tech-heavy or music-heavy with no cultural content, exits without acting.
- **Event description depth:** Reads event descriptions in full before RSVPing. Low-information events (vague title, no description detail) generate higher abandonment.
- **Subscription:** Subscribes to their cultural student association if it exists in the directory.
- **Bridging behavior:** Tends to bring 3-5 peers from their home-country network once they're engaged. Word-of-mouth within this archetype is highly efficient.

### The Co-op Returner
- **Two cohorts:** Wave 1 (25 agents) arrives Week 1 as regular fall returnees. Wave 2 (20 agents) arrives Week 9 as mid-semester returners.
- **First action:** Re-subscribes to clubs they were members of before their work term. Subscriptions happen within 24 hours of signup.
- **Instant value:** Push notifications from clubs they subscribe to start arriving before they've browsed the Noticeboard. This is the highest-speed value delivery of any archetype.
- **Platform quality sensitivity:** Higher aesthetic expectations post-work term. A clean, well-designed platform generates strong positive impression.
- **Feature usage:** Calendar export (exports every RSVPed event), dashboard for managing saved events.
- **Retention:** If subscription pipeline works within 48 hours of signup, Week 9 cohort has significantly higher 6-week retention than Week 1 organic signups.

### The Arts & Creative Student
- **Discovery:** Instagram Story featuring a high-quality FlockIn!! poster card. The visual is the hook.
- **First impression:** Judges platform aesthetics within 10 seconds. If Noticeboard corkboard aesthetic lands well, they become advocates. If board looks sparse or visually weak (low-image events), they leave.
- **Content creation:** Uploads the highest-quality custom poster images of any archetype. Their event submissions elevate overall Noticeboard quality.
- **Subscription:** Subscribes to UVic Photography Club, Film & Media Arts Society, UVic Music Collective.
- **Snapshot share behavior:** Organic sharers. Will share events with beautiful poster images to Instagram Stories without prompting.
- **Churn resistance:** High, if content quality is maintained. Low, if the board fills with gradient-fallback low-effort events.

### The Career-Focused Pre-Professional
- **Discovery:** Entrepreneurship Hub mention, career centre recommendation, peer in their program.
- **Primary filter usage:** Career and Academic pills. Nearly exclusively uses these.
- **Calendar export:** Uses it for every RSVPed career event. Exports immediately.
- **Subscription:** Entrepreneurship Hub, any professional development club.
- **RSVP behavior:** RSVPs only to events they intend to attend. High RSVP-to-attendance ratio (80%+).
- **Cross-community exposure:** Almost no overlap with Arts or Social content. Operates in a parallel social world.
- **Retention:** High if Career/Academic events are consistently represented. Churns if the board has weeks with no events in their category.

### The Graduate Student
- **Discovery:** Department email, Grad House notice board, peer recommendation from labmate.
- **Activity pattern:** 1-2 app opens per week. Consistent but not frequent.
- **Primary engagement:** Academic and Career filter pills. Graduate Students Society events (Trivia Night).
- **Resource directory:** Heavy use. Study rooms, Writing Centre, Counselling Services are valuable resources they'll use.
- **Recommendation behavior:** Will mention FlockIn!! to their lab group if they find it genuinely useful. Precise and credible word-of-mouth within their cohort.
- **Churn trigger:** If the Noticeboard feels like it's purely an undergraduate social platform with no academic depth.

### The Indigenous Student
- **Discovery:** First Peoples House community word-of-mouth. One engaged Indigenous student recruits 3-5 peers.
- **Engagement trigger:** Indigenous-organized events visible and prominent on the platform. First Peoples House events, Talking Circles, Indigenous Awareness Week content.
- **Platform signal:** If FlockIn!!'s visual and content language feels inclusive and representative, deep engagement. If it feels culturally coded as a mainstream-only platform, exits without acting.
- **Strong community network effect:** This archetype's word-of-mouth is extremely efficient within their community. Their presence compounds quickly once the first engagement occurs.

### The Ghost
- **Behavioral outcome, not starting condition.** These 15 agents begin as Club Crawlers or Quiet Observers.
- **Ghost trigger:** Completes or partially completes onboarding → browses Noticeboard 1-2 times → no first action within 48 hours → app fades from memory.
- **Reactivation triggers:**
  - A push notification from a subscribed club (only if they subscribed during their brief active period)
  - A friend directly sharing a specific event link in iMessage
  - Seeing a FlockIn!! poster card on Instagram Stories and recognizing the app
- **Key variable:** Ghosts who subscribed to even one club during their active period are reactivatable at zero additional acquisition cost. Ghosts who subscribed to nothing require an external social trigger to return.

---

## The Adoption Funnel

Apply these conversion rates to every agent path through the simulation:

```
Awareness → Visit → Sign Up → Complete Onboarding → First Action → Habit → Retained User
```

| Stage | Conversion Rate | Notes |
|---|---|---|
| Awareness → Visit | Varies by channel | See channel rates below |
| Visit → Sign Up | 35-45% | Many browse the Noticeboard without signing in on first visit |
| Sign Up → Complete Onboarding | 70-80% | Two-step onboarding is relatively low friction |
| Onboarding → First Action within 48hr | 45-55% | RSVP or save at least one event |
| First Action → Habit (3+ opens in Week 2) | 30-40% | Requires finding enough relevant content to return |
| Habit → Retained at Week 6 | 55-65% | Strong habit = strong retention |

**Awareness channel conversion rates to first visit:**

| Channel | Visit Conversion |
|---|---|
| Direct iMessage from friend | 35% |
| FlockIn!! poster card on Instagram Story | 8-12% |
| UVSS Instagram post or Story | 3-5% |
| Org Executive mention at club meeting | 20% within 24 hours |
| Physical flyer / QR code | 1-2% |

**Net math:** Approximately 8-12% of people who first encounter FlockIn!! become retained 6-week active users. To reach 500 retained users by Week 6, the platform needs 4,000-6,000 total first visits in the first 5 weeks. Model whether this is achievable given UVic's seed network size and each track's conditions.

---

## Supply-Demand Health Model

The Noticeboard is only as good as the events on it. Track event supply alongside user demand at all times.

**Minimum viable Noticeboard health:**
- 15+ approved, future-dated events visible at any moment
- Representation across at least 5 of the 9 event categories
- At least 1 event happening within the next 3 days
- At least 1 event today or in progress (#Today / #HappeningNow have content)

**What happens below threshold:**
- Below 10 live events: new visitors see a sparse board and leave without acting. First-session action rate drops by ~15-20 percentage points.
- Below 5 live events: board feels abandoned. Word-of-mouth about FlockIn!! turns negative ("it's dead").

**Required event submission rate:** To maintain 15-20 live events with events naturally expiring as time passes, the platform needs approximately 5-8 new event approvals per week.

**Organizer retention is the supply valve.** If the top 5 active Org Executives collectively reduce or stop posting, the supply side collapses within 2-3 weeks regardless of demand-side user numbers. Model organizer retention as a parallel metric, not an afterthought.

---

## Three Parallel Simulation Tracks

Run all three tracks simultaneously with identical agent populations and initial conditions. Vary only the environmental parameters below.

### Track A — Base Case (Organic Growth)
*This is the honest answer track. No lucky breaks.*

- Admin approval latency: 4-8 hours average on weekdays, 12-24 hours on weekends
- Growth source: organic word-of-mouth only
- No institutional endorsement (UVSS does not post about FlockIn!!)
- Victoria Coding Collective does not run a coordinated subscription push
- Event submission rate: grows organically as Org Executives discover and trust the platform
- Notification quality: standard — notification body includes event title, date, and time (e.g., "Victoria Coding Collective: Hack Night — Wed Sept 18, 6pm, ECS 108")
- No coordinated viral events

### Track B — Favorable (Everything Goes Right)
*The ceiling scenario. What's the best realistic outcome?*

- Admin approval latency: 1-2 hours average on weekdays, 4-6 hours on weekends
- UVSS Instagram posts a Story about FlockIn!! in Week 2 → 300-500 link taps in 48 hours
- One poster card (Photography Basics: Shoot in Manual at Cadboro Bay) goes viral in Week 3 → 1,800 Instagram Story views across 3 accounts, 7% tap-through (126 visits)
- Victoria Coding Collective runs a "subscribe to us on FlockIn!!" push in their Discord in Week 3 → 60 members receive the message, 65% subscribe
- Event submission rate: high from Week 2 onward, driven by Org Executive enthusiasm for fast turnaround
- Notification quality: rich — includes emoji, specific date, time, location in body

### Track C — Adverse (Things Go Wrong)
*The floor scenario. What kills it?*

- Admin approval latency: starts at 4-6 hours (Weeks 1-2), climbs to 12-18 hours (Weeks 3-4), reaches 24-36 hours by Week 5
- No institutional endorsement
- Top 2 Org Executives (Coding Collective, Photography Club) both observe 24+ hour delays on a weekend submission in Week 4 and begin posting to Instagram instead
- No viral poster shares (no single event generates significant external reach)
- Event submission rate: drops sharply after Week 4 supply bottleneck becomes visible
- Several Org Executives are skeptical of the "pending approval" requirement and stop using FlockIn!! as their primary channel

---

## The Seven Trigger Events

Inject these at the specified weeks. Unless otherwise noted, all tracks experience the trigger — but its effect will vary dramatically by track.

### Week 1 — UVSS Instagram Story
**Track B only.** UVSS posts: *"Find everything happening at UVic in one place — FlockIn!! 🔗 bio."*
- Generates 300-500 link taps in a 48-hour window
- **Measure:** Visit spike volume, sign-up conversion from institutional endorsement, demographic diversity of new signups vs. organic seed network, whether this cohort has higher or lower 6-week retention than Week 1 organic signups

### Week 2 — Photography Walk Poster Share
**All tracks.** A Photography Club member with 750 Instagram followers shares the "Photography Basics: Shoot in Manual at Cadboro Bay" poster card to their Story.
- The image shows the FlockIn!! corkboard frame, pushpin, and card aesthetic
- **Measure:** Tap-through rate on the Story link, sign-up conversion from visual platform visit, which archetypes arrive through this channel (expected: Arts & Creative, Outdoor & Wellness)

### Week 3 — Coding Collective Subscription Push
**Tracks A and B only.** The Coding Collective president posts in their Discord (80 members): *"Subscribe to us on FlockIn!! — we'll push you notifications when we post events."*
- **Measure:** What % of Discord members subscribe to the club on FlockIn!!; notification-to-RSVP conversion rate from their next approved event; whether the organizer's behavior changes when they see how many subscribers they have (incentive to post more)

### Week 4 — Admin Offline Weekend
**All tracks.** Admin is unavailable Friday 6pm through Monday 9am. No events are approved for ~63 hours.
- 12 events accumulate in the pending queue over the weekend
- **Measure:** How many Org Executives submitted events over the weekend and received no approval until Monday; what % of those Org Executives reduce or halt submissions in Weeks 5-6; does the Noticeboard event count drop below 10 visible events during this window; does any ghost reactivation fail because new events didn't appear during their potential re-engagement window

### Week 5 — Reported Promotional Event
**All tracks.** A borderline event (an off-campus business posting a "student discount workshop" that reads as a marketing pitch) is submitted and approved (admin approves it without catching the promotional nature). Three users report it. Admin reviews on Monday morning and rejects it, removing it from the Noticeboard.
- **Measure:** Whether visible moderation action (a reported event actually disappearing) increases reporting behavior among active users in subsequent weeks; whether trust in the platform increases among users who noticed the event was removed; whether any Org Executives interpret this as a negative signal about approval standards

### Week 7 — Undergraduate Research Symposium Featured Event
**All tracks.** Admin designates the Undergraduate Research Symposium as the Featured Event — gold pushpin, locked to top-left Noticeboard position.
- **Measure:** RSVP premium for featured vs. non-featured events; whether the gold pushpin drives cross-faculty discovery (students in Social Sciences, Health Sciences, Humanities who were not previously engaged); whether the academic credibility of a featured event draws Graduate Students and Career-Focused Pre-Professionals who hadn't signed up yet

### Week 9 — Co-op Returner Wave
**All tracks.** 20 students returning from 4-month work terms sign up simultaneously, having heard about FlockIn!! from a friend still on campus.
- They attempt to re-subscribe to clubs they were in before their work term (Coding Collective, Entrepreneurship Hub, Photography Club)
- **Measure:** Speed of value realization — how quickly do they receive their first push notification after subscribing; does the subscription-to-notification pipeline work within 24 hours of signup; compare 12-week retention rate for this Wave 2 cohort vs. the Week 1 original signups; does the co-op returner wave drive a mid-semester WAU spike that extends platform momentum into the semester's second half

---

## Output Format

### Weekly Metrics Table (Weeks 1-12)

For each week, output a table with the following variables, one column per track:

| Metric | Track A | Track B | Track C |
|---|---|---|---|
| New signups this week | | | |
| Total registered users (cumulative) | | | |
| Weekly Active Users (WAU) | | | |
| WAU / Registered ratio | | | |
| First-session action rate for new signups | | | |
| Active Org Executives (posted 1+ event this month) | | | |
| New events submitted this week | | | |
| New events approved this week | | | |
| Live events on Noticeboard (end of week) | | | |
| Avg admin approval latency (hours) | | | |
| Push notifications sent this week | | | |
| Notification open rate | | | |
| Notification → RSVP conversion rate | | | |
| Snapshot shares generated | | | |
| Share → new signup conversion | | | |
| Noticeboard health (Healthy / Sparse / Critical) | | | |

### Week 6 Deep Analysis (All Tracks)

At the end of Week 6, output for each track:

1. **Retention cohort split:** 6-week retention rate for agents who subscribed to 2+ clubs vs. agents who subscribed to 0 clubs
2. **"Look and leave" by archetype:** For each of the 12 archetypes, what % of that archetype's total first-session visitors took zero actions (no RSVP, no save, no subscription)? Rank archetypes from highest to lowest look-and-leave rate.
3. **Noticeboard quality score:** % of new event submissions in Weeks 4-6 that include a custom uploaded poster image (vs. gradient fallback). If below 50%, quality dilution is occurring.
4. **Active archetype distribution:** Which of the 12 archetypes represent 5%+ of the WAU? Which represent less than 5%? List both.
5. **Organizer health:** How many unique Org Executive agents have posted at least 2 events in Weeks 3-6?
6. **Trajectory projection:** Based on current metrics, project Week 8 WAU range and which outcome category (Failure / Marginal Survival / Viable / Breakout) each track is headed toward.

### Week 8 Verdict (All Tracks)

For each track, output:
1. **Outcome category reached** — Failure (<80 WAU) / Marginal Survival (80-200) / Viable (200-500) / Breakout (500+)
2. **Primary causal mechanism** — the specific variable or failure path that drove this outcome
3. **Retention split** — 8-week retention rate: subscribers (2+ clubs) vs. non-subscribers (0 clubs)
4. **Cross-community diversity score** — how many of the 12 archetypes have 5%+ representation in the active user base
5. **Organizer retention** — % of Org Executives who were active in Week 2 and are still posting in Week 8
6. **Noticeboard health average** — average live event count on the Noticeboard across Weeks 6-8
7. **What changes the outcome** — the 1-2 variables that, if changed in this track, would shift it to the next outcome category

### Week 12 Final Verdict (All Tracks)

Same structure as Week 8 verdict, plus:
- **Semester cliff measurement** — WAU change from Week 9 to Week 11 as exam pressure increases
- **Ghost reactivation count** — how many agents classified as Ghosts in Week 3-4 were successfully reactivated by Week 10-12, and through what mechanism
- **Platform momentum signal** — is WAU growing, flat, or declining entering Week 12? What does the trajectory suggest about the spring semester?

---

## The Seven Hard Questions

Answer each of these explicitly at the conclusion of the simulation. Each must be answered with a specific finding, not a vague observation.

**Q1 — The Core Survival Question**
By Week 6 in Track A, what is the WAU/registered-users ratio? Is it above or below the 15% viability threshold? If below, identify the single root cause of the retention failure and the product intervention most likely to fix it.

**Q2 — The "Look and Leave" Rate**
Across all tracks, which archetype has the highest first-session zero-action rate? What is the specific moment or friction point that causes them to leave without acting? What one product change would most reduce their abandonment rate — and what does FlockIn!! currently do wrong at that moment?

**Q3 — The Organizer Threshold**
What is the minimum number of active Org Executives needed to maintain a Noticeboard with 15+ live events week-over-week? At what organizer count does the board become unhealthily sparse? In Track C, at which specific week does this threshold breach occur, and what is the cascade effect on user retention in the 2 weeks following?

**Q4 — The Notification Quality Cliff**
How many notification-opens-without-RSVP cycles does a typical agent experience before their notification open rate permanently drops? What is the average number before a user who opens but never acts begins treating notifications as background noise — and what distinguishes the notification content that avoided this cliff from the content that caused it?

**Q5 — The Cross-Community Test**
In Track A at Week 8, are users from at least 6 of the 12 archetypes present in the active user base at 5%+ representation, or has the platform siloed? If siloed, which communities are over-represented and which are absent? What is the structural reason the absent communities never arrived — and what would have brought them?

**Q6 — The Semester Cliff**
In all three tracks, does Week 10 (onset of exam pressure / reading break) produce a measurable WAU drop? What is the WAU change from Week 9 peak to Week 11 trough? What % of retained users survive this period, and is there a measurable difference between tracks in survival rate?

**Q7 — Subscription vs. Browse Retention**
At Week 8, what is the retention rate difference between agents who subscribed to 2+ clubs and agents who subscribed to 0 clubs? Is the gap large enough to confirm the core product hypothesis — that passive notification-driven engagement is more durable than voluntary browsing habits? If the gap is not significant, what does that mean about the platform's core retention strategy?

---

## Success and Failure Thresholds

| Outcome Category | Week 4 WAU | Week 8 WAU | Week 12 WAU | Pattern |
|---|---|---|---|---|
| **Failure** (app dies) | <80 | <50 | — | Sharp spike, steep drop, flat line |
| **Marginal Survival** | 80-200 | 60-150 | 60-130 | Small loyal core, no growth |
| **Viable** (PMF achieved) | 200-500 | 300-600 | 400-700 | Retention + continued growth |
| **Breakout** (campus hit) | 500+ | 800+ | 1,000+ | Institutional + social cascade |

Note: Breakout requires ~6-7% of UVic undergrads as weekly active users. It is the tail scenario — not expected in base case, possible in favorable conditions with 2-3 high-leverage events aligning.

---

## Calibration Instructions

To avoid common simulation bias, apply these calibration rules:

**Do not model wishful behavior.** Students at UVic are not early adopters looking for new campus apps. Most are mildly skeptical — they've seen campus apps come and go. Model skepticism as the default.

**Model the "cool but I don't need this" response.** A significant portion of first-time visitors will think the Noticeboard looks good and leave anyway. This is not a conversion failure caused by bad design. It is the base state of a new product with no social proof or personal history. The question is what percentage of the remaining visitors actually act.

**Model admin latency as a cumulative effect, not a binary.** A single 18-hour approval delay does not kill an Org Executive's usage. Two or three in a row, especially over weekends, creates a pattern the organizer notices and responds to. The damage accumulates.

**Output probability distributions, not point estimates.** When the simulation produces a WAU number, provide a range (e.g., "Track A Week 8: 110-160 WAU") rather than a single number. The simulation is modeling uncertain human behavior, and false precision is worse than honest uncertainty.

**The Ghost archetype's existence is not a failure — it is a measurement challenge.** The total registered user count will always outpace WAU. The ratio between them is the honest metric. A platform with 400 registered users and 300 WAU is healthier than a platform with 2,000 registered users and 90 WAU.

---

## The Primary Question

After all three tracks have run for 12 weeks, provide a single consolidated answer to this:

> **In the base case (Track A) — no lucky breaks, organic growth only, a student-run admin with realistic latency — does FlockIn!! survive to Week 12 as a viable product at UVic?**

Answer in three parts:

**Part 1 — The Outcome:**
Which outcome category does Track A reach at Week 12, and with what confidence? Provide the WAU range and the outcome category label.

**Part 2 — The Single Most Important Variable:**
Of all variables the simulation tested, which one has the largest measurable effect on whether Track A reaches Viable vs. staying in Marginal Survival? Not a general principle — a specific, named variable (e.g., "admin approval latency on weekdays", "number of Org Executives who post in Weeks 1-4", "first-session action rate of Club Crawlers in Week 1").

**Part 3 — The Honest Verdict:**
Is FlockIn!! likely to succeed at UVic? What does "success" realistically look like — and what is the minimum viable version of success that makes the product worth maintaining and growing into the spring semester? What would it take to shift from the most probable Track A outcome to the next category up — and is that shift within the product team's control?

---

*Simulation prompt version 1.0 — FlockIn!! at UVic, Fall Semester*
*Seed documents: 01_product_overview.md, 02_user_segments.md, 03_simulation_scenario.md, 04_entity_relationships.md*
