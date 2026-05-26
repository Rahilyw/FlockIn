# FlockIn!! — Survival Simulation Scenario
*MiroFish seed document — University of Victoria, Fall Semester*
*Primary question: Does FlockIn!! actually succeed or fail at UVic?*

---

## What This Simulation Is For

This is not an optimistic rollout story. This simulation is designed to find the honest answer to a hard question: **will UVic students actually use FlockIn!!, or will they open it once, think "cool," and never come back?**

Campus apps fail constantly. A typical pattern: 300 signups in the first two weeks, fueled by launch energy and social media posts. Then a steep drop to 40 active users by week 6. Then nothing. The app technically still exists. Nobody opens it. The domain expires a year later.

This simulation should model the realistic probability of each outcome — success, marginal survival, or failure — and identify exactly which variables determine which path FlockIn!! ends up on. Every behavioral mechanic should be stress-tested against the hardest version of reality, not the best-case version.

---

## Setting

**University:** University of Victoria (UVic), Victoria, BC, Canada  
**Active undergraduates in fall semester:** ~15,000  
**Simulation start:** September 4, Week 3 of fall semester  
**Simulation length:** 12 weeks (through late November)  
**Feature state:** Full Phase 1 + Phase 2 + Phase 3 live (push notifications, club subscriptions, event sharing/snapshot, calendar export, Featured event gold pin)  
**Seed content:** 22 approved events, 12 clubs, 10 campus resources already in Firestore

---

## The Core Failure Problem: "Look and Leave"

The single most important behavioral metric in this simulation is the **first-session action rate** — the percentage of new users who perform at least one meaningful action (RSVP, save, subscribe to a club) within their first session on FlockIn!!.

Industry benchmarks for new social/discovery apps suggest that **50–70% of first-time visitors to a genuinely new product leave without taking any action.** For a campus app, this number is likely at the high end because:

1. Students have high skepticism — they've seen campus apps come and go
2. The Noticeboard looks impressive but if no event immediately matches their life, there's nothing to do
3. There is no social graph — they can't see if friends are on the platform, reducing social pull
4. The ask (onboarding + interest selection) has friction before the payoff arrives

A first-session action rate below 25% means the app is on a death spiral from day one. A rate above 40% means it has a genuine chance.

**The simulation must model the first-session action rate as its primary early-stage output.**

What determines whether a new visitor acts or leaves?
- **Event relevance on first view:** Does the Noticeboard show events that match why the student might care? A CS student landing on a Noticeboard full of music and art events will leave.
- **Social proof on visible events:** Poster cards with 0 RSVPs feel dead. Cards with 15+ RSVPs signal life.
- **Onboarding clarity:** Does the interest selection step make it obvious that the app will get better after completing it, or does it feel like friction before you can browse?
- **Time context:** A student landing at 11am on a Tuesday will see the #Today filter populated. A student landing on a Sunday afternoon might see a board where nothing is happening today or tomorrow.

---

## Defining Success and Failure

Before the simulation runs, it needs concrete thresholds. Here are the benchmarks:

### Failure (App Dies)
- Week 4 weekly active users: fewer than 80
- Week 8 weekly active users: fewer than 50
- Pattern: steep initial spike, sharp drop-off, flat line
- Cause: insufficient supply-demand match, organizers stop posting, platform feels dead

### Marginal Survival (Zombie Mode)
- Week 4 WAU: 80–200
- Week 8 WAU: 60–150
- Pattern: small, loyal core (40–80 people who genuinely use it), no growth
- Cause: platform is useful for the already-committed but never achieves critical mass for organic spread

### Viable (Product-Market Fit Achieved)
- Week 4 WAU: 200–500
- Week 8 WAU: 300–600 (retention, not just initial spike)
- Week 12 WAU: 400–700 (continued growth into late semester)
- Cause: notification pipeline working, event supply healthy, cross-community sharing happening

### Breakout (Campus Hit)
- Week 4 WAU: 500+
- Week 8 WAU: 800+
- Week 12 WAU: 1,000+ (~6-7% of UVic undergrads as weekly active users)
- Cause: institutional endorsement + social sharing cascade + high organizer adoption
- This is the tail scenario. Not expected but possible if 2–3 high-leverage events align.

**The simulation's job is to estimate which outcome the base-case scenario produces, and what changes move it between categories.**

---

## The Adoption Funnel

Model the following conversion funnel explicitly for each simulated user:

```
Awareness → Visit → Sign Up → Complete Onboarding → First Action → Habit → Retained User
```

**Awareness sources** (with realistic conversion rates to visit):
- Friend mentions FlockIn!! in iMessage: ~35% tap through
- Sees FlockIn!! poster card on someone's Instagram Story: ~8-12% tap through
- Sees the UVSS Instagram post about FlockIn!!: ~3-5% tap through
- Hears about it from an Org Executive at a club meeting: ~20% visit within 24 hours
- Sees a physical poster on campus (if any): ~1-2% scan QR code

**Funnel drop-off rates to model:**
- Visit → Sign Up: ~35-45% (many people browse the Noticeboard without signing in, especially on first visit)
- Sign Up → Complete Onboarding: ~70-80% (onboarding is 2 steps and relatively low friction)
- Complete Onboarding → First Action (RSVP or save within 48 hours): ~45-55%
- First Action → Habit (opens app 3+ times in week 2): ~30-40%
- Habit → Retained at Week 6: ~55-65%

**The compounding dropout:** Multiply these together and the realistic end-state is that approximately **8-12% of people who first visit FlockIn!! become retained 6-week active users.** This is not a bad number — it is industry-normal for a new social product. But it means to reach 500 retained users by Week 6, FlockIn!! needs approximately 4,000–6,000 total first visits in the first 5 weeks. Model whether this is achievable given the seed network at UVic.

---

## The Supply-Demand Balance Problem

The Noticeboard is only as good as the events on it. The simulation must explicitly model the event supply rate alongside the user acquisition rate and test whether they stay in balance.

**Minimum viable event supply for a healthy Noticeboard:**
- At least 15 approved, future-dated events visible at any given time
- Representation across at least 5 of the 9 event categories
- At least 1 event happening within the next 3 days (creates urgency)
- At least 1 event today or in progress (#Today and #HappeningNow have content)

If the Noticeboard drops below ~10 visible events, new visitors see a sparse board and leave without acting. If it stays above 20, the board feels alive.

**Event submission rate needed:** To maintain 15–20 live events given events expire after they pass, the platform needs approximately 5–8 new event approvals per week (accounting for events expiring as time passes).

**The organizer retention problem:** The supply side depends on a small number of Org Executives who are willing to post. The simulation should model the organizer cohort size and retention separately from the attendee cohort. If the top 5 organizers collectively stop posting (due to moderation latency, poor RSVP returns, or platform distrust), the supply side collapses within 2–3 weeks regardless of how many users are browsing.

**Critical threshold:** If an Org Executive's event sits in the pending queue for more than **8 hours** during a workday, their likelihood of resubmission drops significantly. If it sits for more than 24 hours, it is likely they will not use FlockIn!! as a primary promotion channel again.

---

## The Notification Dependency Test

This simulation has a specific hypothesis baked in: **the club subscription + push notification pipeline is FlockIn!!'s primary retention mechanism**. The simulation should test whether this is actually true or whether it's wishful thinking.

**Test A — No notifications:** Simulate a cohort of users who sign up, complete onboarding, but never subscribe to any club and never receive push notifications. What is their 6-week retention rate? Expected: very low (~10-15%). This cohort relies entirely on developing an organic checking habit. Without a recurring trigger, the app fades from memory within 2 weeks.

**Test B — Notifications but low-quality clubs:** Simulate users who subscribe to clubs that post infrequently (1 event per month) or whose events consistently don't match the subscriber's interests. How many notifications are needed before a user turns them off or ignores them? Expected: 2–3 notifications that lead to no RSVP is the typical threshold before a user begins treating notifications as noise.

**Test C — Notifications with high-quality clubs:** Simulate users subscribed to active clubs (Victoria Coding Collective, UVic Photography Club) that post 2–3 events per month, all with detailed descriptions, good images, and strong tag matching. What is the 6-week retention rate? Expected: 45-60% — significantly higher than Test A.

**The notification quality threshold:** A push notification converts to an app open at meaningfully higher rates when (a) the user subscribed to the club deliberately, not by default, and (b) the event title and date are immediately visible in the notification body. A notification that reads *"Victoria Coding Collective posted a new event!"* is less effective than *"Victoria Coding Collective: Weekly Hack Night — Wed Sept 18, 6pm, ECS 108."* The second notification tells you everything you need to decide whether to tap.

---

## The Rejection Scenarios (How FlockIn!! Fails)

Model each of the following failure paths explicitly. Each is a plausible outcome, not a worst-case thought experiment.

### Failure Path 1 — The Cold Board (Supply Starvation)

**Trigger:** The admin is the only person approving events, and their availability varies. In weeks 3–4, approval latency climbs to 18–36 hours. Three Org Executives whose events sat pending over a weekend without approval tell their club members to "just use Instagram." Word spreads among the organizer community that FlockIn!! is slow.

**Chain of events:** Organizer submissions drop. The Noticeboard has 8 future events instead of 18. New visitors open the board, see sparse content, and leave. The first-session action rate drops from 40% to 18% because there's nothing compelling to RSVP to. User growth stalls. The Noticeboard looks emptier each week. Active users check less frequently because there's less reason to.

**End state by Week 8:** 60–90 weekly active users, almost all of whom are the original seed network. The app survives technically but has no momentum.

**The fix that would have prevented it:** Admin commits to a review cadence — e.g., checks the queue at 9am, 1pm, and 6pm on weekdays. This is a process fix, not a product fix. The simulation should model whether a 2-hour average approval time vs. a 12-hour average approval time produces measurably different organizer retention by week 6.

### Failure Path 2 — The Ghost Majority (Retention Collapse)

**Trigger:** Strong initial sign-up numbers in weeks 1–2 (200+ accounts created) mask a low first-action rate. 60% of signups never save or RSVP to anything. They complete onboarding, look at the Noticeboard, and close the app.

**Chain of events:** Week 1 metrics look excellent (200 signups!). Week 2 metrics look acceptable (still some new signups from word-of-mouth). Week 3: the cohort of 200 signups from weeks 1–2 has a weekly active rate of 15% — 30 people. Total WAU is 30 + new Week 3 signups. The app appears to be growing because new signups are still coming in, but the underlying retention is catastrophic. By week 6, WAU has collapsed to 40–50 despite 350+ total registered accounts.

**The diagnostic signal:** The ratio of total registered users to weekly active users. If this ratio exceeds 5:1 by Week 4 (e.g., 200 registered, 40 WAU), the retention problem is terminal without a product intervention.

**What causes this pattern specifically at UVic?** Students signed up because they were curious, not because they had a specific event they wanted to track. Without an immediate compelling reason to act (a specific event they wanted to RSVP to, a club they specifically cared about), they browsed and left. The "cool aesthetic" hook creates visits but not habits.

**The fix:** Better onboarding-to-action flow. After completing interest selection, the user is immediately shown 3 events that match their interests with a prompt: "Here's what's happening this week for you — tap to save or RSVP." This converts the onboarding completion moment into a first action.

### Failure Path 3 — The Quality Dilution Spiral

**Trigger:** As the platform grows, low-effort event submissions increase. An event with a vague title ("Social Event"), no image (plain gradient), and no tags gets approved. Then more like it. The Noticeboard gradually fills with poster cards that look bland compared to the original seed events.

**Chain of events:** The Noticeboard's visual distinctiveness — the thing that creates the "wow" first impression — degrades. New users arriving in weeks 6–8 don't experience the same first impression as week 1 users. The "Whoa, this is actually cool" reaction becomes "oh, it's kind of like an event list." Sharing rates drop because the poster snapshot images are less interesting. The viral acquisition channel weakens exactly when the platform needs it most.

**The measurement:** Track the percentage of new event submissions that include a custom poster image vs. using a gradient fallback. If this ratio drops below 50% by Week 6, quality dilution is occurring.

**The fix:** Soft quality incentives — events with poster images receive higher initial placement on the Noticeboard. Events without images appear lower in the initial stack. This creates a structural incentive for image upload without hard-blocking text-only events.

### Failure Path 4 — The Single-Admin Burnout

**Trigger:** There is one admin. Rahil reviews all events. By week 6, with 20–30 event submissions per week, the admin queue becomes a recurring obligation that competes with other priorities. Review latency increases gradually — not dramatically, but consistently. Organizers notice.

**Chain of events:** Average approval time creeps from 2 hours (week 1–2) to 6 hours (week 4) to 14 hours (week 6). No single change is alarming. The cumulative effect is that organizers stop treating FlockIn!! as a reliable same-day-turnaround channel and revert to Instagram for time-sensitive promotion. FlockIn!! becomes the "secondary" channel. Secondary channels get lower-quality content. The Noticeboard reflects this. Users notice.

**The critical model question:** At what approval latency threshold does organizer behavior measurably change? Is it 6 hours? 12 hours? 24 hours? The simulation should produce a latency-sensitivity curve for organizer retention.

### Failure Path 5 — No Cross-Community Spread (Silo Problem)

**Trigger:** FlockIn!! gains traction with the tech and photography communities (Coding Collective members, Photography Club members) but never spreads beyond them. The Noticeboard has strong Workshop and Art representation but is invisible to students in Health Sciences, Social Sciences, and the broader general campus population.

**Chain of events:** The platform reaches 150–200 WAU but hits a ceiling. All active users are concentrated in 2–3 social clusters. The platform is genuinely useful within those clusters but has zero presence outside them. Cross-community discovery — FlockIn!!'s core value proposition — never happens because the user base is too homogeneous.

**The signal that this is happening:** The distribution of active users across archetypes. If The Quiet Observer / tech student cluster and The Arts and Creative Student cluster represent more than 60% of active users by Week 6, the platform has siloed. The Enthusiastic Connector archetype's density in the user base is the leading indicator — if this archetype is underrepresented, the cross-community bridge-building behavior that drives broad adoption isn't happening.

---

## The Success Scenarios

### Success Path 1 — The Subscription Flywheel

**Conditions:** Admin approval stays under 3-hour average. Victoria Coding Collective runs a "subscribe to our FlockIn!! club" push to their Discord (60 members subscribe in one week). The Coding Collective posts 2 events in the following week, both approved within 2 hours. 60 notifications fire. 22 people (37%) open the notification. 14 tap through and view the event. 9 RSVP (64% of viewers). Actual attendance: 6 of the 9 (67% attendance of RSVPs).

**Why this matters:** 9 RSVPs from 60 notifications is a 15% conversion rate. Applied across 5 active clubs each with 40+ subscribers, this is 30–50 RSVPs generated per week purely from push notifications, without any user needing to proactively open the app. By Week 8, the notification pipeline is responsible for 40–50% of all platform RSVPs. Retention for the subscribed cohort is 55–65% at 8 weeks vs. 10–15% for the non-subscribed cohort.

### Success Path 2 — The UVSS Endorsement Effect

**Conditions:** The UVSS Instagram account (8,000+ followers, the largest UVic student account) posts a Story: *"Find all UVSS events on FlockIn!! — link in bio."* This generates 300–500 link taps in a 48-hour window. Conversion from Noticeboard visit to sign-up is 25% (the Noticeboard looks good and there are 22 interesting events). 75–125 new signups in 48 hours. Of these, 40% complete onboarding, 45% take a first action, 30% develop a checking habit.

**End-state contribution:** 10–15 retained Week-6 active users from this one event. Modest but meaningful — and these users come from demographics (UVSS-adjacent, mainstream campus) that the organic seed network would never have reached.

### Success Path 3 — The Viral Poster Share

**Conditions:** The Battle of the Bands event has an excellent poster image (designed by a Fine Arts student). Three different users independently share the poster snapshot to their Instagram Stories. Combined reach: 1,800 story views across three accounts. Tap-through rate: 7% (126 visits). Sign-up conversion from these visits: 20% (25 signups). These 25 signups are from social circles the seed network doesn't touch — they came in because an image looked good.

**Cumulative effect:** If this happens 3–4 times with different high-quality events over the semester, it accounts for 80–100 signups from entirely new social clusters. This is how FlockIn!! escapes its initial silo.

---

## Week-by-Week Simulation Structure

Model each week as a state snapshot with the following tracked variables:

| Week | Key Event | Metric Focus |
|------|-----------|--------------|
| 1 | Launch + seed content live | First-session action rate, onboarding completion rate |
| 2 | First Connectors activate | Word-of-mouth amplification, iMessage share rate |
| 3 | Cross-community first contact | New social cluster penetration, snapshot share instances |
| 4 | First admin latency pressure | Organizer submission rate vs. approval rate, organizer churn signal |
| 5 | Subscription flywheel test | Notification open rate, subscribe-to-RSVP conversion, retained vs. ghost ratio |
| 6 | Quality variance visible | Image-upload rate of new submissions, "look and leave" rate for new users |
| 7 | Undergraduate Research Symposium | Cross-faculty discovery, cross-archetype RSVP overlap |
| 8 | Network density audit | Which social clusters have >20% penetration? Which have <5%? |
| 9 | Event sharing surge | Snapshot share rate, share-to-signup conversion |
| 10 | Reading break quiet | Retention during low-event period, resource directory engagement |
| 11 | End-of-semester event burst | Admin queue pressure, organizer retention signal |
| 12 | Final state assessment | WAU, MAU, retained organizer count, supply health score |

---

## The Seven Trigger Events

Inject these at the specified weeks to test specific dynamics:

**Week 1 — UVSS Instagram Story (Awareness Test)**  
UVSS posts about FlockIn!!. Measures: visit spike size, sign-up conversion from institutional endorsement, demographic reach of new signups vs. organic seed network.

**Week 2 — Photography Walk Viral Share (Aesthetic Virality Test)**  
A Photography Club member shares the Cadboro Bay Photography Basics poster card to their Instagram Story. Measures: tap-through rate from an aesthetic share, new social cluster penetration from a visual platform.

**Week 3 — Coding Collective Subscription Push (Notification Flywheel Test)**  
The Coding Collective asks all Discord members to subscribe on FlockIn!!. Measures: bulk subscription conversion, notification-to-RSVP rate, organizer incentive to post more events when they see notification reach data.

**Week 4 — Admin Offline Weekend (Supply Bottleneck Stress Test)**  
No events approved Friday 6pm through Monday 9am. 12 events accumulate pending. Measures: organizer frustration response rate, subsequent submission drop-off, whether any organizers explicitly abandon the platform after this event.

**Week 5 — Misleading Event Report (Trust and Moderation Test)**  
A borderline event (promotional for an off-campus business) is reported by 3 users. Admin reviews and rejects it. Measures: whether visible moderation action increases reporting behavior among users, whether the trust signal of a working report system affects user sentiment.

**Week 7 — Undergraduate Research Symposium Featured Event (Gold Pin Test)**  
Admin designates the Symposium as the Featured event with the gold pushpin. Measures: click-through premium of featured vs. non-featured events, whether academic credibility of a featured event drives signups from previously unrepresented archetypes.

**Week 9 — Co-op Returner Wave (Re-activation Test)**  
A group of 15 students returning from 4-month co-op work terms all heard about FlockIn!! from a friend. They sign up simultaneously, subscribe to their former clubs (Coding Collective, Entrepreneurship Hub), and immediately receive pending notifications. Measures: speed of co-op returner value realization, whether the subscription-to-notification path works within 24 hours of signup, cohort retention vs. Week 1 original signups.

---

## The Hard Questions This Simulation Must Answer

**Question 1 — The Core Survival Question:**  
By Week 6, what is the ratio of weekly active users to total registered users? If this ratio is below 15% (e.g., 30 WAU out of 200 registered), the platform has a retention crisis regardless of its sign-up numbers. If it's above 30%, it has genuine engagement.

**Question 2 — The "Look and Leave" Rate:**  
What percentage of first-session visitors perform zero actions (no RSVP, no save, no club subscription)? Track this by archetype. Which archetypes "look and leave" most? Which ones act immediately? The answer tells you which onboarding and first-session experience to optimize for.

**Question 3 — The Organizer Threshold:**  
How many active organizers (posting at least 1 event per month) does the platform need to maintain a healthy Noticeboard? What is the minimum organizer count before content quality and volume drops enough to cause user churn? The simulation should find this threshold.

**Question 4 — The Notification Quality Cliff:**  
At what notification-open-without-action frequency does a user turn off notifications or start ignoring them? How many "opened but didn't RSVP" cycles before notifications become noise? The answer defines how aggressively FlockIn!! should push notification volume.

**Question 5 — The Cross-Community Test:**  
By Week 8, are users from at least 6 of the 12 defined archetypes represented in the active user base? Or has the platform siloed into 2–3 communities? Cross-community diversity in the active user base is the best leading indicator of whether FlockIn!! achieves its core value proposition.

**Question 6 — The Semester Cliff:**  
Does engagement drop sharply in weeks 10–11 as academic pressure increases? How does the retained user count at Week 12 compare to peak WAU? The semester cliff is a natural stress test — platforms with strong notification pipelines and high-quality content survive it; platforms that depend entirely on voluntary checking habits lose 40–60% of users.

**Question 7 — Subscription vs. Browse Retention:**  
At Week 8, what is the 8-week retention rate for users who subscribed to 2+ clubs versus users who subscribed to 0 clubs? This is the single most important product-design hypothesis in FlockIn!!: that passive notification-driven engagement is more durable than active browsing habits. The simulation should confirm or refute this.

---

## The Realistic Base Case

Given UVic's specific context, the base-case outcome (no extraordinary events, normal admin cadence, organic growth only) is estimated to land in the **Marginal Survival** range — 100–180 weekly active users by Week 8, concentrated in 2–3 social clusters, with a loyal core of 15–20 organizers and 80–120 regular attendee-users.

This is not failure. It is a working product with a real user base. But it is not yet a campus hit.

The variables that move this toward **Viable** are, in order of impact:
1. Admin approval latency maintained under 3 hours on weekdays
2. At least 3 high-reach Org Executives commit and post consistently
3. The UVSS Instagram endorsement fires in Week 1–2
4. At least one event poster card goes viral on Instagram Stories

The variables that move this toward **Failure** are:
1. Admin approval latency exceeds 12 hours consistently from Week 4 onward
2. The Noticeboard drops below 10 live events at any point in weeks 3–5
3. The first-session action rate is below 25% (meaning the event-interest match is poor)
4. No Enthusiastic Connector archetype users are in the early cohort (no organic sharing)

The simulation should output a probability distribution across the four outcome categories, not a single point estimate. The honest answer to "will FlockIn!! succeed?" is: **it depends on 3–4 specific variables that are within the product team's control, and 1–2 that are not.**

---

## MiroFish Simulation Prompt

> Simulate the survival and adoption dynamics of FlockIn!!, a campus event discovery app, at the University of Victoria across a 12-week fall semester. Use 500 student agents weighted to UVic demographics: 20% first-year students, 30% co-op-program students (15% on-campus this semester, 15% returning from work terms in weeks 7–9), 15% international students, 10% graduate students, 25% general upper-year domestic students. No Greek life. Strong outdoor and sustainability culture. The SUB and The Vertigo are the primary social anchors.
>
> Run three parallel simulation tracks simultaneously:
> - **Track A (Base Case):** Admin approves events with 4–8 hour average latency. Organic growth only. No institutional endorsement.
> - **Track B (Favorable):** Admin approves within 2 hours. UVSS Instagram endorses FlockIn!! in Week 2. One event poster share goes viral in Week 3.
> - **Track C (Adverse):** Admin approval latency climbs to 18–24 hours by Week 4. Top 2 organizers stop posting after Week 4 approval delays. No institutional endorsement.
>
> For each track, output the following weekly metrics: weekly active users, total registered users, WAU/registered ratio, first-session action rate for new signups, organizer retention rate, Noticeboard live event count, push notification open rate, notification-to-RSVP conversion rate, event share instances, and share-to-signup conversion.
>
> At the end of week 8 and week 12, output: (1) which of the four outcome categories (Failure / Marginal Survival / Viable / Breakout) each track has reached, (2) the primary cause of the outcome, (3) the 8-week retention rate split between users who subscribed to 2+ clubs vs. 0 clubs, (4) the "look and leave" rate by archetype, and (5) the cross-community diversity score (what percentage of the 12 defined archetypes have at least 5% representation in the active user base).
>
> Primary question: In Track A, does FlockIn!! survive to Week 12 as a viable product? What is the single variable that most determines whether it reaches Viable or stays in Marginal Survival?
