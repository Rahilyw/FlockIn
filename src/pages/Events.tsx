import { useState } from "react";
import { Search, X } from "lucide-react";
import { EventPoster } from "@/components/cards/EventPoster";
import { NoticeboardLayout } from "@/components/events";
import { Button } from "@/components/ui/button";
import { Event, EventCategory } from "@/types/database";
import { cn } from "@/lib/utils";

/**
 * Temporary mock data for visual prototyping
 * These events showcase different categories and poster heights
 */
const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    name: "React Workshop: Building Interactive UIs",
    description:
      "Learn how to build modern, interactive user interfaces with React 18. Perfect for beginners and intermediate developers.",
    date: new Date(2024, 5, 15),
    startTime: "18:00",
    endTime: "20:00",
    location: "Engineering Building, Room 301",
    capacity: 40,
    attendees: 28,
    category: "Workshop" as EventCategory,
    tags: ["coding", "web", "react", "beginners-welcome", "free"],
    createdBy: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "AI & Machine Learning Seminar",
    description:
      "Explore the cutting edge of AI and machine learning with our guest speaker from a leading tech company. Q&A session included.",
    date: new Date(2024, 5, 16),
    startTime: "19:00",
    endTime: "20:30",
    location: "Main Hall, Auditorium",
    capacity: 100,
    attendees: 87,
    category: "Seminar" as EventCategory,
    tags: ["ai", "machine-learning", "tech", "networking"],
    createdBy: "user-2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Campus Basketball Tournament",
    description:
      "Annual 3v3 basketball tournament. All skill levels welcome! Winners get free merch.",
    date: new Date(2024, 5, 20),
    startTime: "14:00",
    endTime: "18:00",
    location: "Recreation Center, Court A",
    capacity: 60,
    attendees: 45,
    category: "Sports" as EventCategory,
    tags: ["sports", "basketball", "competition", "fun", "free-food"],
    createdBy: "user-3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Tech Startup Pitch Night",
    description:
      "Watch innovative student startups pitch their ideas to local investors. Network with entrepreneurs and VCs.",
    date: new Date(2024, 5, 18),
    startTime: "17:30",
    endTime: "19:30",
    location: "Innovation Hub",
    capacity: 80,
    attendees: 62,
    category: "Career" as EventCategory,
    tags: ["startup", "career", "networking", "business", "innovation"],
    createdBy: "user-4",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Jazz Concert Series",
    description:
      "Live jazz performance by our award-winning student jazz ensemble. Featuring classics and original compositions.",
    date: new Date(2024, 5, 22),
    startTime: "19:00",
    endTime: "21:00",
    location: "Music Hall, Theater",
    capacity: 120,
    attendees: 95,
    category: "Music" as EventCategory,
    tags: ["music", "arts", "culture", "live-performance"],
    createdBy: "user-5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Data Science Hackathon",
    description:
      "24-hour hackathon focused on solving real-world problems with data. Team or solo participation. Prizes available!",
    date: new Date(2024, 5, 23),
    startTime: "09:00",
    endTime: "09:00",
    location: "Computer Science Building",
    capacity: 150,
    attendees: 118,
    category: "Competition" as EventCategory,
    tags: ["coding", "data-science", "hackathon", "competition", "prizes"],
    createdBy: "user-6",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    name: "Mental Wellness Workshop",
    description:
      "Learn stress management techniques and mindfulness practices to improve your mental health. Yoga session included.",
    date: new Date(2024, 5, 19),
    startTime: "16:00",
    endTime: "17:30",
    location: "Wellness Center",
    capacity: 50,
    attendees: 38,
    category: "Academic" as EventCategory,
    tags: ["wellness", "health", "mindfulness", "free", "beginner-friendly"],
    createdBy: "user-7",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    name: "Cultural Exchange Dinner",
    description:
      "Join us for an evening celebrating international cultures through food, music, and conversation. All backgrounds welcome!",
    date: new Date(2024, 5, 21),
    startTime: "18:30",
    endTime: "21:00",
    location: "Dining Hall, Grand Ballroom",
    capacity: 200,
    attendees: 156,
    category: "Social" as EventCategory,
    tags: ["culture", "social", "food", "international", "networking"],
    createdBy: "user-8",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const CATEGORIES: EventCategory[] = [
  "Workshop",
  "Social",
  "Seminar",
  "Competition",
  "Career",
  "Sports",
  "Music",
  "Culture",
  "Academic",
  "Networking",
  "Other",
];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>(
    []
  );
  const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set());

  // Filter events based on search and categories
  const filteredEvents = MOCK_EVENTS.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(event.category);

    return matchesSearch && matchesCategory;
  });

  const handleCategoryToggle = (category: EventCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSaveEvent = (eventId: string) => {
    setSavedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header Section */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            Event Noticeboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover campus events tailored to your interests
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300",
                "bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
                "dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "transition-all"
              )}
            />
          </div>

          {/* Category Filters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Filter by Category
              </label>
              {(searchQuery || selectedCategories.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={cn(
                    "px-4 py-2 rounded-full font-medium transition-all text-sm",
                    selectedCategories.includes(category)
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
            {selectedCategories.length > 0 && (
              <span> in {selectedCategories.join(", ")}</span>
            )}
          </div>
        </div>

        {/* Noticeboard */}
        {filteredEvents.length > 0 ? (
          <NoticeboardLayout gap="md">
            {filteredEvents.map((event) => (
              <div key={event.id} className="break-inside-avoid">
                <EventPoster
                  event={event}
                  isSaved={savedEvents.has(event.id)}
                  onSave={() => handleSaveEvent(event.id)}
                  onRsvp={() => {
                    console.log("RSVP clicked for:", event.name);
                  }}
                />
              </div>
            ))}
          </NoticeboardLayout>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No events found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
