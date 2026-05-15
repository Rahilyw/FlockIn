import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/cards/TagBadge";
import { cn } from "@/lib/utils";

// Predefined interest categories with examples
const INTEREST_CATEGORIES = {
  "Tech & Innovation": [
    "coding",
    "web-dev",
    "mobile-dev",
    "machine-learning",
    "data-science",
    "cybersecurity",
    "blockchain",
    "ux-design",
  ],
  "Sports & Recreation": [
    "basketball",
    "soccer",
    "fitness",
    "yoga",
    "rock-climbing",
    "tennis",
    "dance",
    "swimming",
  ],
  "Arts & Culture": [
    "music",
    "photography",
    "painting",
    "writing",
    "theater",
    "cinema",
    "design",
    "animation",
  ],
  "Professional Development": [
    "leadership",
    "entrepreneurship",
    "product-management",
    "business",
    "career",
    "networking",
    "public-speaking",
    "sales",
  ],
  "Health & Wellness": [
    "mental-health",
    "meditation",
    "nutrition",
    "fitness",
    "wellness",
    "therapy",
    "health",
  ],
  "Social & Community": [
    "socializing",
    "community-service",
    "activism",
    "diversity",
    "volunteering",
    "cultural-exchange",
  ],
};

interface InterestSelectionProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
  maxSelections?: number;
  className?: string;
}

export function InterestSelection({
  selectedInterests,
  onInterestsChange,
  maxSelections = 10,
  className,
}: InterestSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const allInterests = Object.values(INTEREST_CATEGORIES).flat();

  const filteredInterests = allInterests.filter((interest) =>
    interest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleInterest = useCallback(
    (interest: string) => {
      if (selectedInterests.includes(interest)) {
        onInterestsChange(
          selectedInterests.filter((i) => i !== interest)
        );
      } else if (selectedInterests.length < maxSelections) {
        onInterestsChange([...selectedInterests, interest]);
      }
    },
    [selectedInterests, onInterestsChange, maxSelections]
  );

  const removeInterest = useCallback(
    (interest: string) => {
      onInterestsChange(
        selectedInterests.filter((i) => i !== interest)
      );
    },
    [selectedInterests, onInterestsChange]
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selected Interests Display */}
      {selectedInterests.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Interests ({selectedInterests.length}/{maxSelections})
          </label>
          <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
            {selectedInterests.map((interest) => (
              <TagBadge
                key={interest}
                label={interest}
                variant="default"
                onRemove={() => removeInterest(interest)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search interests
        </label>
        <Input
          type="text"
          placeholder="Search for interests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Interest Grid by Category */}
      <div className="space-y-4">
        {Object.entries(INTEREST_CATEGORIES).map(
          ([category, interests]) => {
            const categoryInterests = interests.filter((interest) =>
              interest.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (categoryInterests.length === 0 && searchQuery) {
              return null;
            }

            return (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categoryInterests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    const isDisabled =
                      !isSelected && selectedInterests.length >= maxSelections;

                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        disabled={isDisabled}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                          isSelected
                            ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
                          isDisabled && "opacity-50 cursor-not-allowed"
                        )}
                        aria-pressed={isSelected}
                        aria-label={`${isSelected ? "Remove" : "Add"} ${interest}`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }
        )}

        {/* No Results */}
        {searchQuery && filteredInterests.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            No interests match "{searchQuery}"
          </div>
        )}
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Select up to {maxSelections} interests to help us personalize your
        experience.
      </p>
    </div>
  );
}
