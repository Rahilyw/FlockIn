import { Users, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagBadge } from "./TagBadge";
import { Club } from "@/types/database";
import { cn } from "@/lib/utils";

interface ClubCardProps {
  club: Club;
  onFollow?: () => void;
  isFollowed?: boolean;
  className?: string;
}

export function ClubCard({
  club,
  onFollow,
  isFollowed = false,
  className,
}: ClubCardProps) {
  return (
    <div
      className={cn(
        "group rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      {/* Club Image/Logo Placeholder */}
      <div className="mb-4 h-40 w-full rounded-md bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="text-3xl">🎭</div>
          <p className="text-xs mt-1">Club Logo</p>
        </div>
      </div>

      {/* Category & Follow Button */}
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
          {club.category}
        </span>
        <Button
          variant={isFollowed ? "secondary" : "default"}
          size="sm"
          className="h-8 gap-1"
          onClick={onFollow}
          aria-label={isFollowed ? "Leave club" : "Join club"}
        >
          {isFollowed ? (
            <>
              <Check className="h-3 w-3" />
              Following
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" />
              Follow
            </>
          )}
        </Button>
      </div>

      {/* Club Name */}
      <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900 dark:text-gray-50">
        {club.name}
      </h3>

      {/* Description */}
      <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
        {club.description}
      </p>

      {/* Members Count */}
      <div className="mb-3 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <Users className="h-4 w-4" />
        <span className="font-medium">{club.memberCount} members</span>
      </div>

      {/* Meeting Info */}
      {club.meetingTime && (
        <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-500">
            MEETINGS
          </p>
          <p>{club.meetingTime}</p>
        </div>
      )}

      {/* Location */}
      {club.location && (
        <div className="mb-3 flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>📍</span>
          <span className="line-clamp-1">{club.location}</span>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {club.tags.slice(0, 3).map((tag) => (
          <TagBadge key={tag} label={tag} variant="outline" size="sm" />
        ))}
        {club.tags.length > 3 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            +{club.tags.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
}
