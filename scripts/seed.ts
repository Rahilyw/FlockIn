/**
 * Firestore seeder — run from the project root:
 *   npm run seed
 *   npm run seed:fresh   (clears collections first)
 *
 * Requires:  scripts/service-account.json  (Firebase Admin SDK key)
 */

import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { faker } from "@faker-js/faker";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const __dir = dirname(fileURLToPath(import.meta.url));
const serviceAccount = require(join(__dir, "service-account.json")) as ServiceAccount;

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// ── Helpers ───────────────────────────────────────────────────────────────────

const FRESH = process.argv.includes("--fresh");
const now = Timestamp.now();

function ts(date: Date) {
  return Timestamp.fromDate(date);
}

function futureDate(daysFromNow: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(Math.floor(Math.random() * 10) + 10, 0, 0, 0);
  return d;
}

async function clearCollection(name: string) {
  const snap = await db.collection(name).get();
  if (snap.empty) return;
  const batch = db.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  console.log(`  Cleared ${snap.size} docs from "${name}"`);
}

async function batchWrite(col: string, docs: Record<string, unknown>[]) {
  for (let i = 0; i < docs.length; i += 499) {
    const batch = db.batch();
    docs.slice(i, i + 499).forEach((doc) => {
      batch.set(db.collection(col).doc(doc.id as string), doc);
    });
    await batch.commit();
  }
  console.log(`  Wrote ${docs.length} docs → "${col}"`);
}

// ── Events (22) ───────────────────────────────────────────────────────────────

const events = [
  // Music × 4
  {
    id: "evt-001",
    title: "Jazz & Blues Night",
    description:
      "UVic's jazz ensemble and special guest blues artists take the stage for a night of soulful improvisation. Grab a seat and enjoy live music in the heart of campus.",
    date: ts(futureDate(8)),
    location: "The Vertigo (SUB Lower Level)",
    category: "Music",
    organizerId: "seed-organizer",
    organizerName: "UVic Music Department",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Music", "Social", "Art"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "evt-002",
    title: "Open Mic Night",
    description:
      "Got a song, a poem, or a stand-up set? Sign up at the door and take the stage. All skill levels welcome — we celebrate courage over perfection.",
    date: ts(futureDate(15)),
    location: "The Vertigo (SUB Lower Level)",
    category: "Music",
    organizerId: "seed-organizer",
    organizerName: "UVSS Arts & Events",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Music", "Art", "Social"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "evt-003",
    title: "Battle of the Bands",
    description:
      "Five student bands compete for the title of UVic's best. Vote for your favourite and enjoy an evening of original music across genres from indie to metal.",
    date: ts(futureDate(22)),
    location: "MacLaurin B-wing Courtyard",
    category: "Music",
    organizerId: "seed-organizer",
    organizerName: "UVic Music Collective",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Music", "Social", "Art"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "evt-004",
    title: "Spring Classical Recital",
    description:
      "End-of-term performances by UVic School of Music students. Features solo piano, string quartets, and a choral piece premiered for the first time.",
    date: ts(futureDate(30)),
    location: "Phillip T. Young Recital Hall",
    category: "Music",
    organizerId: "seed-organizer",
    organizerName: "UVic School of Music",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Music", "Art", "Academic"],
    createdAt: now,
    updatedAt: now,
  },

  // Art × 3
  {
    id: "evt-005",
    title: "End of Year Art Exhibition",
    description:
      "Over 60 works by Fine Arts graduating students — painting, sculpture, digital media, and mixed-media installations. Opening night includes artist talks and refreshments.",
    date: ts(futureDate(12)),
    location: "University Centre Concourse",
    category: "Art",
    organizerId: "seed-organizer",
    organizerName: "UVic Department of Visual Arts",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Art", "Photography", "Academic"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "evt-006",
    title: "Life Drawing Session",
    description:
      "Open life drawing with a live model. Bring your own supplies. All experience levels welcome. Sessions run 2 hours with warm-up gestures and longer poses.",
    date: ts(futureDate(6)),
    location: "Visual Arts Building — Studio A",
    category: "Art",
    organizerId: "seed-organizer",
    organizerName: "UVic Visual Arts Society",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Art", "Workshop"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "evt-007",
    title: "Ceramics Open Studio",
    description:
      "Wheel throwing, hand-building, and glazing — open to all UVic students. Clay and tools provided. Perfect for beginners or practised potters looking for studio time.",
    date: ts(futureDate(9)),
    location: "Visual Arts Building — Ceramics Studio",
    category: "Art",
    organizerId: "seed-organizer",
    organizerName: "UVic Visual Arts Society",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Art", "Workshop", "Social"],
    createdAt: now,
    updatedAt: now,
  },

  // Workshop × 4
  {
    id: "evt-008",
    title: "Intro to Machine Learning",
    description:
      "Hands-on Python workshop covering supervised learning, scikit-learn, and building your first classifier. Laptops required. Beginner-friendly with no prior ML experience needed.",
    date: ts(futureDate(11)),
    location: "Engineering & Computer Science Building — ECS 108",
    category: "Workshop",
    organizerId: "seed-organizer",
    organizerName: "Victoria Coding Collective",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Technology", "Coding", "Academic", "Science"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "evt-009",
    title: "Photography Basics: Shoot in Manual",
    description:
      "Learn aperture, shutter speed, and ISO on your camera. We'll walk around campus for a hands-on shooting session. DSLRs or mirrorless cameras required.",
    date: ts(futureDate(14)),
    location: "Meet at Cadboro Bay Beach Entrance",
    category: "Workshop",
    organizerId: "seed-organizer",
    organizerName: "UVic Photography Club",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Photography", "Art", "Workshop"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "evt-010",
    title: "Resume & LinkedIn Workshop",
    description:
      "Get your resume reviewed by career advisors and learn how to optimise your LinkedIn profile for tech, business, and health-sciences roles. Bring a printed resume.",
    date: ts(futureDate(17)),
    location: "Career & Co-op Education Centre",
    category: "Workshop",
    organizerId: "seed-organizer",
    organizerName: "UVic Career Services",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Career", "Business", "Workshop", "Academic"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "evt-011",
    title: "Sustainable Living on Campus",
    description:
      "Zero-waste cooking demos, tips for buying second-hand, and a composting setup guide. Join fellow students who care about living lightly on the planet.",
    date: ts(futureDate(20)),
    location: "Student Union Building — Room B120",
    category: "Workshop",
    organizerId: "seed-organizer",
    organizerName: "UVic Environmental Society",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Nature", "Cooking", "Food", "Volunteering"],
    createdAt: now,
    updatedAt: now,
  },

  // Social × 3
  {
    id: "evt-012",
    title: "International Student Welcome BBQ",
    description:
      "A free BBQ for new and returning international students. Meet other students from around the world, get campus tips, and enjoy grilled food on the lawn.",
    date: ts(futureDate(5)),
    location: "Campus Community Gardens",
    category: "Social",
    organizerId: "seed-organizer",
    organizerName: "UVSS International Students Association",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Social", "Food", "Travel", "Volunteering"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "evt-013",
    title: "Campus Trivia Night",
    description:
      "Form a team of up to 5 and compete across pop culture, science, history, and UVic-specific trivia rounds. Prizes for first, second, and best team name.",
    date: ts(futureDate(18)),
    location: "The Grad House Pub",
    category: "Social",
    organizerId: "seed-organizer",
    organizerName: "Graduate Students Society",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Social", "Academic", "Gaming"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "evt-014",
    title: "Club Crawl Night",
    description:
      "Visit tables from 30+ student clubs in one evening. Perfect for finding your people. Snacks, swag, and sign-up incentives at every booth.",
    date: ts(futureDate(25)),
    location: "Student Union Building — Main Concourse",
    category: "Social",
    organizerId: "seed-organizer",
    organizerName: "UVSS Student Society",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Social", "Volunteering", "Academic"],
    createdAt: now,
    updatedAt: now,
  },

  // Sport × 2
  {
    id: "evt-015",
    title: "IM Flag Football Tournament",
    description:
      "Intramural flag football open to all skill levels. Register a team of 7–10 players or join as a free agent. Prizes for winners and MVP.",
    date: ts(futureDate(16)),
    location: "Centennial Stadium Fields",
    category: "Sport",
    organizerId: "seed-organizer",
    organizerName: "UVic Campus Recreation",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Sports", "Fitness", "Social"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "evt-016",
    title: "5K Fun Run — Victoria in Bloom",
    description:
      "A non-competitive 5K through the Garry oak meadows and campus trails. All paces welcome. Entry includes a medal and post-race smoothies at the Rec Centre.",
    date: ts(futureDate(23)),
    location: "Starting at the UVic Recreation Centre",
    category: "Sport",
    organizerId: "seed-organizer",
    organizerName: "UVic Campus Recreation",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Sports", "Fitness", "Nature", "Social"],
    createdAt: now,
    updatedAt: now,
  },

  // Academic × 3
  {
    id: "evt-017",
    title: "Study Skills Bootcamp",
    description:
      "A two-hour intensive covering active recall, spaced repetition, and exam-prep strategies backed by learning science. Worksheets included.",
    date: ts(futureDate(7)),
    location: "McPherson Library — Room 057",
    category: "Academic",
    organizerId: "seed-organizer",
    organizerName: "UVic Academic Advising",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Academic", "Workshop", "Science"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "evt-018",
    title: "Undergraduate Research Symposium",
    description:
      "Student researchers present posters and 10-minute talks from every faculty. A great chance to see what your peers are working on and get inspired.",
    date: ts(futureDate(28)),
    location: "University Centre — Lobby & Rooms A-C",
    category: "Academic",
    organizerId: "seed-organizer",
    organizerName: "UVic Office of Research",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Academic", "Science", "Technology", "Career"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "evt-019",
    title: "Philosophy Debate Night",
    description:
      "This month: 'Is universal basic income a moral obligation?' Two teams argue for and against. Audience votes at the end. Come ready to think.",
    date: ts(futureDate(13)),
    location: "Clearihue Building — CLE B007",
    category: "Academic",
    organizerId: "seed-organizer",
    organizerName: "UVic Philosophy & Debate Society",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Academic", "Politics", "Social"],
    createdAt: now,
    updatedAt: now,
  },

  // Career × 2
  {
    id: "evt-020",
    title: "Tech Recruiting Panel",
    description:
      "Recruiters from three Victoria-based tech companies share what they look for in new grads, how to ace technical interviews, and how to build a standout portfolio.",
    date: ts(futureDate(21)),
    location: "Engineering & Computer Science — ECS 104",
    category: "Career",
    organizerId: "seed-organizer",
    organizerName: "UVic Entrepreneurship Hub",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Career", "Technology", "Coding", "Business"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "evt-021",
    title: "Health Sciences Career Fair",
    description:
      "Meet employers from hospitals, clinics, public health agencies, and biotech firms. Bring your resume and come ready to network. Business casual dress recommended.",
    date: ts(futureDate(27)),
    location: "Petch Building — PETCH 108",
    category: "Career",
    organizerId: "seed-organizer",
    organizerName: "UVic Career Services",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Career", "Science", "Business"],
    createdAt: now,
    updatedAt: now,
  },

  // Food × 1
  {
    id: "evt-022",
    title: "UVic Farmers Market",
    description:
      "Local vendors bring fresh produce, baked goods, preserves, and crafts every Tuesday. Great coffee, great community. Rain or shine.",
    date: ts(futureDate(2)),
    location: "Ring Road (outside the SUB)",
    category: "Food",
    organizerId: "seed-organizer",
    organizerName: "UVSS Sustainability",
    attendeeCount: 0,
    attendeeIds: [],
    posterUrl: null,
    tags: ["Food", "Cooking", "Nature", "Social"],
    createdAt: now,
    updatedAt: now,
  },
];

// ── Clubs (12) ────────────────────────────────────────────────────────────────

const clubs = [
  {
    id: "club-001",
    name: "Victoria Coding Collective",
    description:
      "Weekly hack nights, coding challenges, and project showcases. We build side projects together and support each other's learning — from first-year to PhD.",
    category: "Technology",
    memberCount: 0,
    memberIds: [],
    logoUrl: null,
    contactEmail: "codingcollective@uvic.ca",
    tags: ["Coding", "Technology", "Science", "Career"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "club-002",
    name: "UVic Photography Club",
    description:
      "Monthly photo walks, editing workshops, and a warm community of photographers at every level. We shoot film and digital, portraits and landscapes.",
    category: "Art",
    memberCount: 0,
    memberIds: [],
    logoUrl: null,
    contactEmail: "photoclub@uvic.ca",
    tags: ["Photography", "Art", "Nature", "Travel"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "club-003",
    name: "Environmental Society",
    description:
      "Advocacy, education, and action on climate, biodiversity, and sustainability. We run campus clean-ups, tree plantings, and policy workshops throughout the year.",
    category: "Nature",
    memberCount: 0,
    memberIds: [],
    logoUrl: null,
    contactEmail: "envsociety@uvic.ca",
    tags: ["Nature", "Volunteering", "Science", "Politics"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "club-004",
    name: "Philosophy & Debate Society",
    description:
      "Structured debates, Socratic seminars, and casual philosophy discussions. From metaethics to political theory — all views are welcome, all arguments must be good.",
    category: "Academic",
    memberCount: 0,
    memberIds: [],
    logoUrl: null,
    contactEmail: "debate@uvic.ca",
    tags: ["Academic", "Politics", "Social", "Literature"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "club-005",
    name: "Culinary Arts Club",
    description:
      "Cook together, eat together. We host weekly cooking sessions exploring global cuisines, food science, and budget-friendly cooking for students.",
    category: "Food",
    memberCount: 0,
    memberIds: [],
    logoUrl: null,
    contactEmail: "culinaryclub@uvic.ca",
    tags: ["Cooking", "Food", "Social", "Travel"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "club-006",
    name: "Salsa & Ballroom Dance Society",
    description:
      "Learn to dance — no partner or experience needed. Weekly beginner and intermediate lessons in salsa, bachata, swing, and waltz. Social dances every month.",
    category: "Dance",
    memberCount: 0,
    memberIds: [],
    logoUrl: null,
    contactEmail: "dance@uvic.ca",
    tags: ["Dance", "Music", "Social", "Fitness"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "club-007",
    name: "Outdoor Adventures Club",
    description:
      "Hiking, kayaking, cycling, and skiing trips organised year-round. We also run gear swaps and wilderness first aid workshops for members.",
    category: "Sports",
    memberCount: 0,
    memberIds: [],
    logoUrl: null,
    contactEmail: "outdoors@uvic.ca",
    tags: ["Sports", "Nature", "Fitness", "Travel"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "club-008",
    name: "Film & Media Arts Society",
    description:
      "Screenings, director Q&As, and our annual short film competition. We also offer equipment loans and editing suite access to members working on their own films.",
    category: "Film",
    memberCount: 0,
    memberIds: [],
    logoUrl: null,
    contactEmail: "filmclub@uvic.ca",
    tags: ["Film", "Art", "Photography", "Literature"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "club-009",
    name: "Entrepreneurship Hub",
    description:
      "Business pitch nights, startup workshops, and mentorship with Victoria's startup community. Helping students turn ideas into real ventures since 2018.",
    category: "Business",
    memberCount: 0,
    memberIds: [],
    logoUrl: null,
    contactEmail: "entrepreneurship@uvic.ca",
    tags: ["Business", "Career", "Technology", "Social"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "club-010",
    name: "UVic Music Collective",
    description:
      "A home for musicians of all genres — jazz, folk, electronic, classical. We jam, record, and perform together. No audition required to join.",
    category: "Music",
    memberCount: 0,
    memberIds: [],
    logoUrl: null,
    contactEmail: "music@uvic.ca",
    tags: ["Music", "Art", "Social", "Dance"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "club-011",
    name: "Video Games & Esports Club",
    description:
      "Competitive esports teams, casual gaming nights, and a game dev stream. We compete in collegiate leagues across League of Legends, Valorant, and CS2.",
    category: "Gaming",
    memberCount: 0,
    memberIds: [],
    logoUrl: null,
    contactEmail: "esports@uvic.ca",
    tags: ["Gaming", "Technology", "Coding", "Social"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "club-012",
    name: "Creative Writing Circle",
    description:
      "Workshops, critique sessions, and writing prompts every week. We publish an annual literary magazine featuring member work — fiction, poetry, and creative non-fiction.",
    category: "Literature",
    memberCount: 0,
    memberIds: [],
    logoUrl: null,
    contactEmail: "writingcircle@uvic.ca",
    tags: ["Literature", "Art", "Social", "Academic"],
    createdAt: now,
    updatedAt: now,
  },
];

// ── Resources (10) ────────────────────────────────────────────────────────────

const resources = [
  {
    id: "res-001",
    title: "McPherson Library Study Rooms",
    description:
      "Book a group or individual study room online up to 7 days in advance. Rooms come equipped with whiteboards and large display screens.",
    type: "room",
    url: "https://library.uvic.ca/spaces",
    location: "McPherson Library, Ring Road",
    tags: ["Academic", "Social"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "res-002",
    title: "Campus Counselling Services",
    description:
      "Free, confidential counselling for UVic students — individual sessions, drop-in, and crisis support. Same-day appointments available.",
    type: "service",
    url: "https://www.uvic.ca/services/counselling/",
    location: "Student Services Building — Room 130",
    tags: ["Academic", "Social", "Volunteering"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "res-003",
    title: "Career & Co-op Education Centre",
    description:
      "Resume reviews, interview prep, job boards, and co-op placement support. Walk-ins and appointments both available.",
    type: "service",
    url: "https://www.uvic.ca/career-services/",
    location: "University Centre — Room B234",
    tags: ["Career", "Business", "Academic"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "res-004",
    title: "UVic Recreation Centre",
    description:
      "Fitness facilities, aquatic centre, racquet courts, and group fitness classes. Free for full-time students with student card.",
    type: "service",
    url: "https://www.uvic.ca/recreation/",
    location: "McKinnon Building",
    tags: ["Sports", "Fitness", "Social"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "res-005",
    title: "Writing Centre",
    description:
      "Free one-on-one writing consultations at any stage of the writing process — brainstorming, drafts, or final revisions. Book online.",
    type: "service",
    url: "https://www.uvic.ca/learningandteaching/writingcentre/",
    location: "McPherson Library — Room 039",
    tags: ["Academic", "Literature"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "res-006",
    title: "UVic IT Help Desk",
    description:
      "Technical support for UVic accounts, campus Wi-Fi, software, and devices. Walk-in, phone, and chat support options available.",
    type: "service",
    url: "https://www.uvic.ca/systems/support/",
    location: "McPherson Library — Level 1",
    tags: ["Technology", "Coding"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "res-007",
    title: "My UVic Student Portal",
    description:
      "Your central hub for course registration, grades, financial account, and student record. Log in with your NetLink ID.",
    type: "link",
    url: "https://www.uvic.ca/myuvic/",
    location: null,
    tags: ["Academic", "Career"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "res-008",
    title: "UVic Interactive Campus Map",
    description:
      "Find buildings, parking, transit stops, bike cages, and accessible entrances across the UVic campus.",
    type: "link",
    url: "https://www.uvic.ca/search/maps-buildings/index.php",
    location: null,
    tags: ["Social", "Travel", "Nature"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "res-009",
    title: "UVSS Student Society",
    description:
      "The student union that advocates on your behalf. Access student club funding, event grants, legal advice, and student discounts through the UVSS.",
    type: "link",
    url: "https://uvss.ca",
    location: "Student Union Building",
    tags: ["Social", "Volunteering", "Academic", "Career"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "res-010",
    title: "UVic Food Bank",
    description:
      "Free, confidential food assistance for any UVic student experiencing food insecurity. No documentation required.",
    type: "service",
    url: "https://uvss.ca/food-bank/",
    location: "Student Union Building — Room B044",
    tags: ["Food", "Volunteering", "Social"],
    createdAt: now,
    updatedAt: now,
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────

// Suppress unused import warning — faker is available for extending the script
void faker;

async function main() {
  console.log(`\n🌱 FlockIn Firestore Seeder${FRESH ? " (--fresh mode)" : ""}\n`);

  if (FRESH) {
    console.log("Clearing existing data...");
    await clearCollection("events");
    await clearCollection("clubs");
    await clearCollection("resources");
    console.log();
  }

  console.log("Writing seed data...");
  await batchWrite("events", events as unknown as Record<string, unknown>[]);
  await batchWrite("clubs", clubs as unknown as Record<string, unknown>[]);
  await batchWrite("resources", resources as unknown as Record<string, unknown>[]);

  console.log(
    `\n✅ Done. Seeded ${events.length} events, ${clubs.length} clubs, ${resources.length} resources.\n`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Seeding failed:", err.message ?? err);
  process.exit(1);
});
