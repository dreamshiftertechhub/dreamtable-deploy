import { cn } from "@/lib/utils";
import type { SpiceLevel } from "@/data/types";

export function SpiceDots({ level, className }: { level: SpiceLevel; className?: string }) {
  if (level === 0) {
    return <span className={cn("text-[10px] tracking-label text-subtle", className)}>No spice</span>;
  }
  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-label={`Spice level ${level}`}>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={cn("size-1.5 rounded-full", n <= level ? "bg-brand" : "bg-line")}
        />
      ))}
    </span>
  );
}
