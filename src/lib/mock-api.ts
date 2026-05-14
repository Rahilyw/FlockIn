import {
  campusClubSchema,
  campusEventSchema,
  campusResourceSchema,
  recommendationsPayloadSchema,
  type CampusClub,
  type CampusEvent,
  type CampusResource,
  type RecommendationsPayload,
} from "@/lib/schemas";

const MOCK_DELAY_MS = 350;

function mockDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

const featuredEventsRaw = [
  {
    title: "Tech Innovation Symposium",
    description:
      "Join leading industry experts as they discuss the latest trends in technology and innovation. Network with professionals and discover new opportunities.",
    date: "March 15, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Engineering Auditorium",
    attendees: 245,
    category: "Technology",
  },
  {
    title: "Spring Career Fair",
    description:
      "Connect with 50+ employers from various industries. Bring your resume and discover internship and full-time opportunities.",
    date: "March 18, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Student Union Ballroom",
    attendees: 1200,
    category: "Career",
  },
  {
    title: "Cultural Festival",
    description:
      "Celebrate diversity with food, music, and performances from cultures around the world. Free admission and food tastings.",
    date: "March 22, 2024",
    time: "6:00 PM - 10:00 PM",
    location: "Campus Quad",
    attendees: 800,
    category: "Cultural",
  },
] as const;

const featuredClubsRaw = [
  {
    name: "Robotics Club",
    description:
      "Build robots, compete in competitions, and learn cutting-edge technology. All skill levels welcome!",
    category: "STEM",
    members: 156,
    rating: 4.8,
    tags: ["Robotics", "Engineering", "Competitions", "Arduino"],
  },
  {
    name: "Photography Society",
    description:
      "Capture campus life, learn new techniques, and showcase your work in our monthly exhibitions.",
    category: "Arts",
    members: 89,
    rating: 4.6,
    tags: ["Photography", "Digital Art", "Exhibitions", "Nature"],
  },
  {
    name: "Environmental Action Group",
    description:
      "Work together to make our campus more sustainable and raise environmental awareness in the community.",
    category: "Service",
    members: 203,
    rating: 4.9,
    tags: ["Sustainability", "Environment", "Community", "Activism"],
  },
] as const;

const featuredResourcesRaw = [
  {
    title: "Academic Success Center",
    description:
      "Get tutoring, study skills workshops, and academic coaching to help you succeed in your courses.",
    category: "Academic",
    location: "Library 2nd Floor",
    hours: "Mon-Fri 8AM-8PM",
    contact: "(555) 123-4567",
    iconKey: "bookOpen" as const,
  },
  {
    title: "Counseling & Wellness",
    description:
      "Mental health support, stress management resources, and wellness programs for student well-being.",
    category: "Wellness",
    location: "Health Center",
    hours: "Mon-Fri 9AM-5PM",
    contact: "(555) 123-4568",
    iconKey: "users" as const,
  },
  {
    title: "Career Services",
    description:
      "Resume reviews, interview prep, job search assistance, and career planning guidance.",
    category: "Career",
    location: "Student Services Building",
    hours: "Mon-Fri 8AM-6PM",
    contact: "(555) 123-4569",
    iconKey: "calendar" as const,
  },
] as const;

const recommendationsRaw = {
  topPick: {
    title: "Campus Hackathon Weekend",
    badgeLabel: "Event",
    summary:
      "A weekend-long experience designed for students who want to build fast, learn from mentors, and pitch new ideas. Perfect for your interest in AI and entrepreneurial projects.",
    dateRange: "April 27–29",
    venue: "Student Innovation Lab",
    attendeesHeadline: "180 attendees expected",
    attendeesSubtext: "Matches your recent event interests",
  },
  listItems: [
    {
      kind: "Event" as const,
      title: "Campus Hackathon Weekend",
      description:
        "A 48-hour challenge for students who love building products, meeting mentors, and launching new ideas.",
      category: "Tech",
      detail: "Starts Apr 27 · Student Innovation Lab",
      meta: "Based on your AI & startups interest",
      actionLabel: "View Event",
    },
    {
      kind: "Club" as const,
      title: "Design & UX Collective",
      description:
        "Join a creative community focused on product design, prototyping, and portfolio-building workshops.",
      category: "Design",
      detail: "120 members · Weekly meetups",
      meta: "Matches your creative activity",
      actionLabel: "Explore Club",
    },
    {
      kind: "Resource" as const,
      title: "Career Coaching Sessions",
      description:
        "Book one-on-one support for resume review, interview prep, and internship strategy.",
      category: "Career",
      detail: "Open slots this week · Virtual and in-person",
      meta: "Recommended from your job search history",
      actionLabel: "Book Now",
    },
  ],
} as const;

export async function getFeaturedEvents(): Promise<CampusEvent[]> {
  await mockDelay();
  return featuredEventsRaw.map((item) => campusEventSchema.parse(item));
}

export async function getFeaturedClubs(): Promise<CampusClub[]> {
  await mockDelay();
  return featuredClubsRaw.map((item) => campusClubSchema.parse(item));
}

export async function getFeaturedResources(): Promise<CampusResource[]> {
  await mockDelay();
  return featuredResourcesRaw.map((item) => campusResourceSchema.parse(item));
}

export async function getRecommendations(): Promise<RecommendationsPayload> {
  await mockDelay();
  return recommendationsPayloadSchema.parse(recommendationsRaw);
}
