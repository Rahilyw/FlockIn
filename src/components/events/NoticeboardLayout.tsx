import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NoticeboardLayoutProps {
  children: ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg";
}

/**
 * NoticeboardLayout - CSS columns-based masonry layout
 * Creates an organic, bulletin board-like appearance where posters
 * flow naturally into columns of varying heights, mimicking a real bulletin board.
 *
 * Features:
 * - Responsive column count based on screen size
 * - Smooth gap handling
 * - Natural text/flow break-inside prevention
 */
export function NoticeboardLayout({
  children,
  className,
  gap = "md",
}: NoticeboardLayoutProps) {
  const gapClasses = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div
      className={cn(
        "columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5",
        gapClasses[gap],
        "space-y-0", // Remove space-y since columns handle spacing
        className
      )}
      style={{
        columnGap: gap === "sm" ? "12px" : gap === "md" ? "16px" : "24px",
      }}
    >
      {/* Children should be individual poster items */}
      {children}
    </div>
  );
}
