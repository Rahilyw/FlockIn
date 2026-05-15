import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagBadge } from "./TagBadge";
import { Event } from "@/types/database";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  onSave?: () => void;
  isSaved?: boolean;
  className?: string;
}

export function EventCard({
  event,
  onSave,
  isSaved = false,
  className,
}: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={cn(
        "group rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      {/* Image Placeholder */}
      <div className="mb-4 h-40 w-full rounded-md bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="text-3xl">📅</div>
          <p className="text-xs mt-1">Event Image</p>
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
          {event.category}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onSave}
          aria-label={isSaved ? "Remove from saved" : "Save event"}
        >
          <Heart
            className={cn("h-4 w-4", isSaved && "fill-current text-red-500")}
          />
        </Button>
      </div>

      {/* Title */}
      <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900 dark:text-gray-50">
        {event.name}
      </h3>

      {/* Description */}
      <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
        {event.description}
      </p>

      {/* Date & Time */}
      <div className="mb-3 flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-1">
          <span className="font-medium">{formattedDate}</span>
          <span>•</span>
          <span>{event.startTime}</span>
        </div>
      </div>

      {/* Location */}
      <div className="mb-3 flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span>📍</span>
        <span className="line-clamp-1">{event.location}</span>
      </div>

      {/* Tags */}
      <div className="mb-3 flex flex-wrap gap-1">
        {event.tags.slice(0, 3).map((tag) => (
          <TagBadge key={tag} label={tag} variant="outline" size="sm" />
        ))}
        {event.tags.length > 3 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            +{event.tags.length - 3} more
          </span>
        )}
      </div>

      {/* Capacity Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {event.attendees && event.capacity
          ? `${event.attendees} / ${event.capacity} attending`
          : "Capacity info unavailable"}
      </div>
    </div>
  );
}
