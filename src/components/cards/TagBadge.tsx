import { cn } from "@/lib/utils";

interface TagBadgeProps {
  label: string;
  variant?: "default" | "secondary" | "outline";
  size?: "sm" | "md";
  interactive?: boolean;
  onRemove?: () => void;
}

export function TagBadge({
  label,
  variant = "default",
  size = "md",
  interactive = false,
  onRemove,
}: TagBadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1 font-medium rounded-full transition-colors";

  const variantStyles = {
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    secondary:
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
    outline:
      "border border-gray-300 bg-white text-gray-800 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100",
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  const interactiveStyles = interactive
    ? "cursor-pointer hover:opacity-80 active:scale-95"
    : "";

  return (
    <span
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        interactiveStyles
      )}
      role={interactive ? "button" : "status"}
      tabIndex={interactive ? 0 : -1}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5"
          aria-label={`Remove ${label}`}
        >
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
