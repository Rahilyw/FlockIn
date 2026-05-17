import { cn } from "@/lib/utils";

interface InterestTagProps {
  label: string;
  selected: boolean;
  onToggle: (label: string) => void;
  disabled?: boolean;
}

export function InterestTag({ label, selected, onToggle, disabled }: InterestTagProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle(label)}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors select-none",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {label}
    </button>
  );
}
