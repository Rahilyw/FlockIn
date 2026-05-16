import PosterCard from "./PosterCard";

const EVENTS = [
  {
    id: 1,
    title: "Sonic Echoes Live",
    date: "Friday, May 22 • 8:00 PM",
    location: "The Warehouse Loft",
    description:
      "An experimental night of synthesizers and visual projections. Join local artists for a journey through sound.",
    rotation: -2,
    attachmentType: "pushpin" as const,
    pushpinColor: "#FF5252",
    posterGradient:
      "linear-gradient(160deg, #f97316 0%, #a855f7 50%, #3b82f6 100%)",
    actionLabel: "RSVP Now",
    actionClassName: "bg-primary-container text-on-primary-container",
    marginTop: 0,
  },
  {
    id: 2,
    title: "Frames of Mind",
    date: "Sat, May 23 • 2:00 PM",
    location: "Fine Arts Annex",
    description:
      "Senior photography showcase exploring urban solitude and the beauty of mundane campus life.",
    rotation: 3,
    attachmentType: "washi" as const,
    washiColor: "rgba(178, 235, 242, 0.70)",
    washiSide: "right" as const,
    washiRotation: -12,
    posterGradient:
      "linear-gradient(160deg, #134e4a 0%, #0ea5e9 60%, #67e8f9 100%)",
    actionLabel: "Add to Calendar",
    actionClassName: "bg-secondary-container text-on-secondary-container",
    marginTop: 48,
  },
  {
    id: 3,
    title: "Urban Oasis Workshop",
    date: "Sun, May 24 • 10:00 AM",
    location: "West Campus Garden",
    description:
      "Learn the basics of sustainable gardening in tight spaces. Complimentary organic seeds for all attendees!",
    rotation: -1,
    attachmentType: "pushpin" as const,
    pushpinColor: "#F06292",
    posterGradient:
      "linear-gradient(160deg, #166534 0%, #84cc16 60%, #fde68a 100%)",
    actionLabel: "Sign Up",
    actionClassName: "bg-tertiary-container text-on-tertiary-container",
    marginTop: 24,
  },
  {
    id: 4,
    title: "Unfiltered: Poetry Slam",
    date: "Tuesday, May 26 • 7:00 PM",
    location: "The Coffee Cave",
    description:
      "Open mic night for poets and storytellers. Come share your truth or just listen to the rhythm of the city.",
    rotation: 6,
    attachmentType: "washi" as const,
    washiColor: "rgba(220, 231, 117, 0.70)",
    washiSide: "left" as const,
    washiRotation: 12,
    posterGradient:
      "linear-gradient(160deg, #1e1b4b 0%, #7c3aed 55%, #ec4899 100%)",
    actionLabel: "Register",
    actionClassName: "bg-primary text-on-primary",
    marginTop: 80,
  },
];

const Noticeboard = () => {
  return (
    <div className="relative rounded-[32px] p-4 bg-[#5D4037] shadow-2xl border-[12px] border-[#3E2723]">
      <div className="board-texture rounded-[20px] min-h-[900px] w-full relative masonry-grid">
        {EVENTS.map((event) => (
          <PosterCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
};

export default Noticeboard;
