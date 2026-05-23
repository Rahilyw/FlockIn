import { useRef, useState, useMemo, KeyboardEvent } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTopTags } from "@/hooks/useTopTags";
import { EVENT_CATEGORIES } from "@/lib/eventSchemas";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

function normalizeTag(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "-");
}

export function TagInput({ value, onChange, maxTags = 10 }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: topTags } = useTopTags(8);

  const suggestions = useMemo(() => {
    const categoryNames = EVENT_CATEGORIES.map((c) => c.toLowerCase());
    const categorySet = new Set(categoryNames);
    const trendingExtras = (topTags ?? [])
      .map((t) => t.name.toLowerCase())
      .filter((n) => !categorySet.has(n));
    return [...categoryNames, ...trendingExtras];
  }, [topTags]);

  function addTag(raw: string) {
    const tag = normalizeTag(raw);
    if (!tag) return;
    if (value.length >= maxTags) return;
    if (value.some((t) => t.toLowerCase() === tag)) return;
    onChange([...value, tag]);
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
      setInputValue("");
    }
    if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Mobile-safe: if user typed a comma, commit immediately
    if (raw.endsWith(",")) {
      addTag(raw.slice(0, -1));
      setInputValue("");
    } else {
      setInputValue(raw);
    }
  }

  const atMax = value.length >= maxTags;

  return (
    <div
      className="w-full cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Selected tags + text input inline */}
      <div className="flex flex-wrap gap-1.5 min-h-[28px] items-center">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/30 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              aria-label={`Remove ${tag}`}
              className="text-primary/60 hover:text-destructive transition-colors leading-none"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? "Add a tag…" : ""}
          readOnly={atMax}
          aria-label="Add a tag"
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Suggestion pills */}
      <div className="flex flex-wrap gap-1.5 pt-2 mt-1.5 border-t border-border/30">
        {suggestions.map((sug) => {
          const isSelected = value.some((t) => t.toLowerCase() === sug);
          return (
            <button
              key={sug}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                isSelected ? removeTag(sug) : addTag(sug);
              }}
              disabled={!isSelected && atMax}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors inline-flex items-center gap-1",
                isSelected
                  ? "border border-primary/40 bg-primary/10 text-primary"
                  : "border border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed",
              )}
            >
              {isSelected && <Check className="w-3 h-3 shrink-0" />}
              {sug}
            </button>
          );
        })}
      </div>

      {atMax && (
        <p className="text-xs text-muted-foreground mt-1.5">
          Max {maxTags} tags reached
        </p>
      )}
    </div>
  );
}
