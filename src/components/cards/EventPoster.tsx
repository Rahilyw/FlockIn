import { useState } from "react";
import { Bookmark, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/database";
import { cn } from "@/lib/utils";

interface EventPosterProps {
  event: Event;
  onSave?: () => void;
  onRsvp?: () => void;
  isSaved?: boolean;
  className?: string;
}

/**
 * EventPoster - A physical bulletin board-style event poster component
 * Features:
 * - Looks like a real printed poster/flyer
 * - Hover state with scale-up effect
 * - Information overlay on hover with interactive buttons
 * - Responsive design
 */
export function EventPoster({
  event,
  onSave,
  onRsvp,
  isSaved = false,
  className,
}: EventPosterProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getPosterColor = (index: number) => {
    const colors = [
      "from-blue-400 to-purple-500",
      "from-pink-400 to-red-500",
      "from-green-400 to-emerald-500",
      "from-yellow-400 to-orange-500",
      "from-indigo-400 to-blue-600",
      "from-violet-400 to-purple-600",
      "from-cyan-400 to-blue-500",
      "from-fuchsia-400 to-pink-500",
    ];
    return colors[index % colors.length];
  };

  // Simple hash function to generate consistent color for event
  const eventIndex =
    event.id.charCodeAt(0) + event.name.charCodeAt(0);

  return (
    <div
      className={cn("group relative h-80 w-full", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Background */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg shadow-lg transition-all duration-300",
          "border-4 border-gray-900 dark:border-gray-700",
          "bg-gradient-to-br overflow-hidden",
          getPosterColor(eventIndex),
          isHovered && "scale-105 shadow-2xl z-10"
        )}
      >
        {/* Poster Content */}
        <div className="flex flex-col justify-between h-full p-4 text-white pointer-events-none">
          {/* Category Badge */}
          <div className="flex items-start justify-between">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
              {event.category}
            </div>
          </div>

          {/* Poster Title */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-2xl font-black leading-tight line-clamp-3 drop-shadow-lg">
              {event.name}
            </h2>
          </div>

          {/* Date/Time Highlight */}
          <div className="bg-white/90 text-gray-900 rounded px-3 py-1.5 text-sm font-bold w-fit">
            {formattedDate}
          </div>
        </div>

        {/* Pin decorations (visual element) */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-red-600 shadow-md"></div>
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-red-600 shadow-md"></div>
      </div>

      {/* Hover Overlay */}
      {isHovered && (
        <div
          className={cn(
            "absolute inset-0 rounded-lg bg-gray-900/95 p-4 backdrop-blur-sm",
            "flex flex-col justify-between z-20 transition-opacity duration-200",
            "border-4 border-gray-900 dark:border-gray-700 scale-105"
          )}
        >
          {/* Header */}
          <div>
            {/* Category */}
            <div className="mb-2">
              <span className="inline-block bg-blue-500/80 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {event.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
              {event.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-200 mb-3 line-clamp-2">
              {event.description}
            </p>
          </div>

          {/* Event Details */}
          <div className="space-y-2 mb-4 text-sm text-gray-100">
            {/* Date & Time */}
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <div>
                <span className="font-semibold">{formattedDate}</span>
                <span className="mx-1">•</span>
                <span>{event.startTime}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2">
              <span className="text-lg mt-0.5">📍</span>
              <span className="line-clamp-1">{event.location}</span>
            </div>

            {/* Capacity */}
            {event.attendees && event.capacity && (
              <div className="flex items-center gap-2">
                <span className="text-lg">👥</span>
                <span>
                  {event.attendees} / {event.capacity} attending
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
              {event.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-700 text-gray-100 text-xs px-2 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
              {event.tags.length > 4 && (
                <span className="text-xs text-gray-400">
                  +{event.tags.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pointer-events-auto">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-2 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                onSave?.();
              }}
            >
              <Bookmark
                className={cn("h-4 w-4", isSaved && "fill-current")}
              />
              Save
            </Button>
            <Button
              size="sm"
              className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
              onClick={(e) => {
                e.stopPropagation();
                onRsvp?.();
              }}
            >
              <Check className="h-4 w-4" />
              RSVP
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
