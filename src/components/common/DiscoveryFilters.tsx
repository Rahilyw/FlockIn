import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DiscoveryFiltersProps {
  onSearchChange?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
  categories: string[];
  placeholder?: string;
}

export function DiscoveryFilters({
  onSearchChange,
  onCategoryChange,
  categories,
  placeholder = "Search...",
}: DiscoveryFiltersProps) {
  return (
    <div className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <Select onValueChange={(value) => onCategoryChange?.(value)}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onSearchChange?.("");
              onCategoryChange?.("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
