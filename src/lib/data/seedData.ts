import type { Club, Event, Resource } from "@/types/database";

/** Small mock set for lists and demos until Firestore is wired. */
export const seedEvents: Event[] = [
  {
    id: "evt-react-101",
    title: "React Fundamentals Workshop",
    description: "Hands-on intro to components, hooks, and state for beginners.",
    date: "March 18, 2026",
    time: "4:00 PM – 6:00 PM",
    location: "CS Lab 3",
    category: "Workshop",
    tags: ["coding", "web-dev", "beginners-welcome", "free-food"],
    attendees: 28,
    capacity: 50,
  },
  {
    id: "evt-career-fair",
    title: "Spring Career Fair",
    description: "Meet employers hiring interns and new grads.",
    date: "March 22, 2026",
    time: "11:00 AM – 3:00 PM",
    location: "Student Union Ballroom",
    category: "Career",
    tags: ["career", "networking", "internships"],
    attendees: 420,
    capacity: 600,
  },
  {
    id: "evt-game-night",
    title: "Board Game Night",
    description: "Casual games, snacks, and new friends.",
    date: "March 25, 2026",
    time: "7:00 PM – 10:00 PM",
    location: "Quad Tent",
    category: "Social",
    tags: ["social", "games", "free-food"],
    attendees: 45,
    capacity: 80,
  },
];

export const seedClubs: Club[] = [
  {
    id: "club-code-wizards",
    name: "Code Wizards",
    description: "Weekly coding challenges and interview prep.",
    category: "Technology",
    tags: ["coding", "algorithms", "career"],
    members: 120,
    meetingTime: "Thursdays 6 PM",
    location: "Eng Building 201",
  },
  {
    id: "club-design-collective",
    name: "Design Collective",
    description: "UI/UX critiques, Figma jams, and portfolio reviews.",
    category: "Arts",
    tags: ["design", "ui-ux", "figma"],
    members: 64,
    meetingTime: "Mondays 5 PM",
    location: "Fine Arts Studio B",
  },
  {
    id: "club-outdoors",
    name: "Outdoor Adventure Club",
    description: "Hikes, climbing, and weekend trips.",
    category: "Recreation",
    tags: ["outdoors", "fitness", "social"],
    members: 210,
    meetingTime: "Sundays 9 AM",
    location: "Rec Center Lobby",
  },
];

export const seedResources: Resource[] = [
  {
    id: "res-tutoring",
    title: "Academic Success Center",
    description: "Free tutoring and study skills coaching.",
    category: "Academic",
    tags: ["tutoring", "study-skills", "writing"],
    location: "Library 2nd floor",
    contact: "success@campus.edu",
  },
  {
    id: "res-career",
    title: "Career Services Drop-In",
    description: "Resume reviews and mock interviews without an appointment.",
    category: "Career",
    tags: ["career", "resume", "interview-prep"],
    location: "Student Services 101",
    contact: "careers@campus.edu",
  },
  {
    id: "res-wellness",
    title: "Counseling & Wellness",
    description: "Short-term counseling and wellness workshops.",
    category: "Wellness",
    tags: ["mental-health", "wellness", "support"],
    location: "Health Center",
    contact: "wellness@campus.edu",
  },
];
